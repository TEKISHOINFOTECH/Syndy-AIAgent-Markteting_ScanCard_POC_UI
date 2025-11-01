import { useState, useEffect, useRef } from 'react';
import { LandingScreen } from './screens/LandingScreen';
import { CardCaptureScreen } from './screens/CardCaptureScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { ResultScreen } from './screens/ResultScreen';
import { SelfieCaptureScreen } from './screens/SelfieCaptureScreen';
import { EmailDraftScreen } from './screens/EmailDraftScreen';
import { MeetingConfirmationScreen } from './screens/MeetingConfirmationScreen';
import { Toast } from './ui/Toast';
import { CardScannerAPI } from '../services/api';
import type { CardScanState, UserInfo, LLMResponse } from '../types/cardScanner';
import { StepIndicator } from './ui/StepIndicator';

interface CardScannerAppProps {
  activeView?: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner';
  onNavClick?: (view: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner') => void;
}

export function CardScannerApp({ activeView = 'cardscanner', onNavClick }: CardScannerAppProps) {
  const [state, setState] = useState<CardScanState>({
    step: 'landing',
    transactionID: null,
    capturedImage: null,
    extractedData: null,
    processingStatus: null,
    isLoading: false,
    error: null,
    llmResponse: null,
    emailDraft: null,
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef<number>(0);

  // Poll for updated card data when on result step and processing
  useEffect(() => {
    // Only poll if we're on result step and processing status indicates company enrichment
    if (state.step === 'result' && state.transactionID && state.processingStatus === 'processing') {
      const maxPolls = 30; // Poll for max 30 times (30 * 2 seconds = 60 seconds total)
      const pollInterval = 2000; // Poll every 2 seconds
      pollCountRef.current = 0; // Reset poll count for new polling cycle

      const pollForCompanyData = async () => {
        try {
          pollCountRef.current++;
          console.log(`🔄 Polling for company data (attempt ${pollCountRef.current}/${maxPolls})...`);
          
          const updatedData = await CardScannerAPI.getCardData(state.transactionID!);
          
          // Debug: Log the full response to see its structure
          console.log('📦 Full backend response:', JSON.stringify(updatedData, null, 2));
          
          // Check if company data is available (2nd LLM call completed)
          // Check multiple possible locations for company data in the response
          const hasCompanyData = updatedData?.structured_data?.company_description ||
                                updatedData?.company_data?.company_description ||
                                updatedData?.company_description ||
                                updatedData?.structured_data?.industry ||
                                updatedData?.company_data?.industry ||
                                updatedData?.structured_data?.company_data?.industry ||
                                updatedData?.industry ||
                                // Check if any company enrichment fields exist
                                updatedData?.structured_data?.num_of_employees ||
                                updatedData?.company_data?.num_of_employees ||
                                updatedData?.num_of_employees ||
                                updatedData?.structured_data?.revenue ||
                                updatedData?.company_data?.revenue ||
                                updatedData?.revenue;
          
          if (hasCompanyData || pollCountRef.current >= maxPolls) {
            // Company data is available or max polls reached
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            // Extract updated company data - check multiple possible response structures
            // Backend might return data in: structured_data, company_data, or directly at root
            const rootData = updatedData || {};
            const structuredData = rootData.structured_data || rootData.company_data || {};
            const companyDataObj = rootData.company_data || 
                                  rootData.structured_data?.company_data ||
                                  rootData.additional_info?.company_data ||
                                  rootData.additional_info ||
                                  {}; // Fallback to empty object
            
            // Merge all possible data sources (root level, structured_data, company_data nested)
            const allCompanyData = {
              ...rootData, // Root level fields
              ...structuredData, // structured_data fields
              ...companyDataObj, // company_data nested fields
            };

            console.log('🔍 Extracted company data:', {
              rootData: Object.keys(rootData),
              structuredData: Object.keys(structuredData),
              companyDataObj: Object.keys(companyDataObj),
              allCompanyData: Object.keys(allCompanyData),
            });

            // Update LLM response with enriched company data
            // Try all possible locations for each field
            const enrichedLLMResponse: LLMResponse = {
              extracted_data: {
                ...state.llmResponse?.extracted_data,
                // Extract each field from multiple possible locations
                company_description: allCompanyData.company_description || structuredData.company_description || rootData.company_description,
                products: allCompanyData.products || structuredData.products || rootData.products,
                location: allCompanyData.location || structuredData.location || rootData.location || state.llmResponse?.extracted_data?.location,
                industry: allCompanyData.industry || structuredData.industry || rootData.industry || state.llmResponse?.extracted_data?.industry,
                num_of_employees: allCompanyData.num_of_employees || structuredData.num_of_employees || rootData.num_of_employees,
                revenue: allCompanyData.revenue || structuredData.revenue || rootData.revenue,
                market_share: allCompanyData.market_share || structuredData.market_share || rootData.market_share,
                investors: allCompanyData.investors || structuredData.investors || rootData.investors,
                summarised_llm_company_response: allCompanyData.summarised_llm_company_response || structuredData.summarised_llm_company_response || rootData.summarised_llm_company_response,
                other_info_of_company: allCompanyData.other_info_of_company || structuredData.other_info_of_company || rootData.other_info_of_company,
              },
              confidence_score: state.llmResponse?.confidence_score || rootData.confidence || 0.85,
            };

            console.log('✅ Enriched LLM Response:', {
              extracted_data_keys: Object.keys(enrichedLLMResponse.extracted_data),
              company_fields: {
                company_description: !!enrichedLLMResponse.extracted_data.company_description,
                products: !!enrichedLLMResponse.extracted_data.products,
                industry: !!enrichedLLMResponse.extracted_data.industry,
                num_of_employees: !!enrichedLLMResponse.extracted_data.num_of_employees,
                revenue: !!enrichedLLMResponse.extracted_data.revenue,
                market_share: !!enrichedLLMResponse.extracted_data.market_share,
                investors: !!enrichedLLMResponse.extracted_data.investors,
                summarised_llm_company_response: !!enrichedLLMResponse.extracted_data.summarised_llm_company_response,
                other_info_of_company: !!enrichedLLMResponse.extracted_data.other_info_of_company,
              }
            });

            setState(prev => ({
              ...prev,
              llmResponse: enrichedLLMResponse,
              processingStatus: 'completed',
            }));

            if (hasCompanyData) {
              setToast({ message: 'Company data enriched!', type: 'success' });
              console.log('✅ Company data enrichment completed');
            } else {
              setToast({ message: 'Company data enrichment timed out. Showing available data.', type: 'info' });
              console.log('⏱️ Company data enrichment timed out');
            }
          }
        } catch (error) {
          console.error('❌ Error polling for company data:', error);
          
          // On error, stop polling after max attempts
          if (pollCountRef.current >= maxPolls) {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            setState(prev => ({
              ...prev,
              processingStatus: 'completed', // Mark as completed even if enrichment failed
            }));
            setToast({ message: 'Company enrichment unavailable. Showing available data.', type: 'info' });
          }
        }
      };

      // Start polling immediately
      pollForCompanyData();
      
      // Set interval for subsequent polls
      pollingIntervalRef.current = setInterval(() => {
        pollForCompanyData();
      }, pollInterval);

      // Cleanup on unmount or when step changes
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [state.step, state.transactionID, state.processingStatus]);

  const handleStartScan = () => {
    setState(prev => ({ ...prev, step: 'capture' }));
  };

  const handleCapture = async (file: File) => {
    // Move to processing step first
    setState(prev => ({ 
      ...prev, 
      capturedImage: file,
      isLoading: true,
      error: null,
      step: 'processing',
    }));

    try {
      console.log('📤 Uploading file:', file.name, file.type, `${(file.size / 1024).toFixed(2)}KB`);
      const response = await CardScannerAPI.uploadCard(file);
      console.log('✅ Upload response:', response);

      // Extract structured data from the AI response
      const structuredData = response.aiResponse?.structured_data || {};
      
      const extractedUserInfo: UserInfo = {
        transactionID: response.transactionID, // Using transactionID universally (maps to backend record_id)
        email: structuredData.email || null,
        name: structuredData.name || null,
        phone: structuredData.phone || null,
        company: structuredData.company || null,
        is_meeting_requested: false,
        created_at: new Date().toISOString(),
      };

      // Create LLMResponse from AI response for ResultScreen
      // Extract company data from structured_data, additional_info, or nested company_data
      const companyData = response.aiResponse?.structured_data?.company_data || 
                         response.aiResponse?.additional_info?.company_data ||
                         response.aiResponse?.additional_info || {};
      
      const llmResponse: LLMResponse | null = response.aiResponse ? {
        extracted_data: {
          ...structuredData,
          // Company insights fields
          company_description: companyData.company_description || structuredData.company_description,
          products: companyData.products || structuredData.products,
          location: companyData.location || structuredData.location || structuredData.address,
          industry: companyData.industry || structuredData.industry,
          num_of_employees: companyData.num_of_employees || structuredData.num_of_employees,
          revenue: companyData.revenue || structuredData.revenue,
          market_share: companyData.market_share || structuredData.market_share,
          investors: companyData.investors || structuredData.investors,
          summarised_llm_company_response: companyData.summarised_llm_company_response || structuredData.summarised_llm_company_response,
          other_info_of_company: companyData.other_info_of_company || structuredData.other_info_of_company,
        },
        confidence_score: response.aiResponse.confidence || 0.85,
      } : null;

      // Update state with transactionID and data, then auto-navigate to result after brief delay
      setState(prev => ({
        ...prev,
        transactionID: response.transactionID,
        extractedData: extractedUserInfo,
        processingStatus: 'processing', // Set to 'processing' to indicate company enrichment in progress
        llmResponse: llmResponse,
      }));

      // Auto-navigate to result after showing processing screen briefly
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          step: 'result',
          isLoading: false,
        }));
        setToast({ message: 'Card processed! Enriching company data...', type: 'info' });
      }, 2000); // Show processing screen for 2 seconds
    } catch (err) {
      console.error('❌ Upload error:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to upload card',
        isLoading: false,
        step: 'capture', // Go back to capture on error
      }));
      setToast({ message: 'Failed to upload card', type: 'error' });
    }
  };

  const handleSelfieCapture = async (selfieFile: File, _previewUrl: string) => {
    if (!state.transactionID) {
      setToast({ message: 'No transaction ID available', type: 'error' });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Upload selfie to backend
      const result = await CardScannerAPI.uploadSelfie(state.transactionID, selfieFile);
      
      console.log('✅ Selfie uploaded:', result);
      
      setState(prev => ({
        ...prev,
        step: 'emailDraft', // Navigate to email draft after successful upload
        isLoading: false,
      }));
      
      setToast({ message: result.message || 'Selfie captured successfully!', type: 'success' });
    } catch (err) {
      console.error('❌ Selfie upload error:', err);
      setState(prev => ({ ...prev, isLoading: false }));
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload selfie';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  const handleSkipSelfie = () => {
    setState(prev => ({
      ...prev,
      step: 'emailDraft', // Skip to email draft
    }));
  };

  const handleSaveEmailDraft = (draft: { to: string; subject: string; body: string }) => {
    setState(prev => ({
      ...prev,
      emailDraft: draft,
    }));
    console.log('📧 Email draft saved:', draft);
  };

  const handleCancelCapture = () => {
    setState(prev => ({ ...prev, step: 'landing' }));
  };

  const handleScheduleMeeting = async () => {
    if (!state.transactionID) {
      setToast({ message: 'No transaction ID available', type: 'error' });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      console.log('📅 Scheduling meeting for transaction:', state.transactionID);
      const response = await CardScannerAPI.scheduleMeeting(state.transactionID);
      console.log('✅ Meeting scheduled:', response);

      setState(prev => ({
        ...prev,
        step: 'confirmation',
        extractedData: prev.extractedData ? {
          ...prev.extractedData,
          is_meeting_requested: true,
        } : null,
        isLoading: false,
      }));
      setToast({ message: 'Meeting requested!', type: 'success' });
    } catch (err) {
      console.error('❌ Meeting scheduling error:', err);
      setState(prev => ({ ...prev, isLoading: false }));
      setToast({ message: 'Failed to schedule meeting', type: 'error' });
    }
  };

  const handleScanAnother = () => {
    // Clear polling interval if active
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    setState({
      step: 'landing',
      transactionID: null,
      capturedImage: null,
      extractedData: null,
      processingStatus: null,
      isLoading: false,
      error: null,
      llmResponse: null,
      emailDraft: null,
    });
  };

  const handleDone = () => {
    handleScanAnother();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-y-auto">
      {/* Light glassmorphism background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={state.step} />

      <div className="relative z-50 pb-6">
        {state.step === 'landing' && (
          <LandingScreen onStartScan={handleStartScan} activeView={activeView} onNavClick={onNavClick} />
        )}

        {state.step === 'capture' && (
          <CardCaptureScreen 
            onCapture={handleCapture} 
            onCancel={handleCancelCapture}
            onPrevious={() => setState(prev => ({ ...prev, step: 'landing' }))}
            onNext={() => {
              // onNext will be handled by handleCapture after file is captured
            }}
          />
        )}

        {state.step === 'processing' && (
          <ProcessingScreen
            transactionID={state.transactionID}
            onPrevious={() => setState(prev => ({ ...prev, step: 'capture' }))}
            onNext={() => {
              // Auto-navigate to result - this is handled in handleCapture
            }}
          />
        )}

        {state.step === 'result' && state.extractedData && (
          <ResultScreen
            userInfo={state.extractedData}
            llmResponse={state.llmResponse}
            processingStatus={state.processingStatus || 'completed'}
            onScheduleMeeting={handleScheduleMeeting}
            onScanAnother={handleScanAnother}
            onVoiceRecord={() => {
              console.log('🎤 Voice recording triggered');
              // Voice recording functionality can be added here
            }}
            onPrevious={() => {
              setState(prev => ({ ...prev, step: 'capture' }));
            }}
            onNext={() => {
              // Navigate to selfie step
              setState(prev => ({ ...prev, step: 'selfie' }));
            }}
          />
        )}

        {state.step === 'selfie' && state.transactionID && (
          <SelfieCaptureScreen
            transactionID={state.transactionID}
            onCapture={handleSelfieCapture}
            onSkip={handleSkipSelfie}
            isLoading={state.isLoading}
            onPrevious={() => setState(prev => ({ ...prev, step: 'result' }))}
            onNext={() => {
              // Navigate to email draft
              setState(prev => ({ ...prev, step: 'emailDraft' }));
            }}
          />
        )}

        {state.step === 'emailDraft' && state.transactionID && (
          <EmailDraftScreen
            userInfo={state.extractedData}
            transactionID={state.transactionID}
            onPrevious={() => setState(prev => ({ ...prev, step: 'selfie' }))}
            onNext={() => {
              // Navigate to confirmation after meeting is scheduled
              setState(prev => ({
                ...prev,
                step: 'confirmation',
                extractedData: prev.extractedData ? {
                  ...prev.extractedData,
                  is_meeting_requested: true,
                } : null,
              }));
            }}
            onSaveDraft={handleSaveEmailDraft}
            onScheduleMeeting={() => {
              // This callback is called after successful API call
              setToast({ message: 'Meeting requested!', type: 'success' });
            }}
            isLoading={state.isLoading}
          />
        )}

        {state.step === 'meetingScheduler' && state.transactionID && (
          <MeetingConfirmationScreen
            transactionID={state.transactionID}
            onDone={handleDone}
            onPrevious={() => setState(prev => ({ ...prev, step: 'emailDraft' }))}
            onNext={() => setState(prev => ({ ...prev, step: 'confirmation' }))}
          />
        )}

        {state.step === 'confirmation' && state.transactionID && (
          <MeetingConfirmationScreen
            transactionID={state.transactionID}
            onDone={handleDone}
            onPrevious={() => setState(prev => ({ ...prev, step: 'meetingScheduler' }))}
            onNext={() => setState(prev => ({ ...prev, step: 'landing' }))}
          />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
