import { useState, useEffect, useRef } from 'react';
import { LandingScreen } from './screens/LandingScreen';
import { CardCaptureScreen } from './screens/CardCaptureScreen';
import { CardPreviewScreen } from './screens/CardPreviewScreen';
import { CardRejectionScreen } from './screens/CardRejectionScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { ResultScreen } from './screens/ResultScreen';
import { SelfieCaptureScreen } from './screens/SelfieCaptureScreen';
import { EmailDraftScreen } from './screens/EmailDraftScreen';
import { MeetingConfirmationScreen } from './screens/MeetingConfirmationScreen';
import { Toast } from './ui/Toast';
import { CardScannerAPI } from '../services/api';
import type { CardScanState, UserInfo, LLMResponse } from '../types/cardScanner';
import AvatarScreen from './screens/AvatarScreen';
import { StepIndicator } from './ui/StepIndicator';

interface CardScannerAppProps {
  activeView?: 'home' | 'analysis' | 'cardscanner';
  onNavClick?: (view: 'home' | 'analysis' | 'cardscanner') => void;
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

  // Add includeSelfie state (default true if selfie was captured, false if skipped)
  const [includeSelfie, setIncludeSelfie] = useState<boolean>(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef<number>(0);
  // Track whether we used streaming to avoid redundant polling
  const usedStreamingRef = useRef<boolean>(false);

  // Poll for updated card data when on result step and processing
  useEffect(() => {
    // Only poll if we're on result step and processing status indicates company enrichment
  if (state.step === 'result' && state.transactionID && state.processingStatus === 'processing' && !usedStreamingRef.current) {
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
    // Phase 1: Detection only (no confirmation yet)
    setState(prev => ({ 
      ...prev, 
      capturedImage: file,
      isLoading: true,
      error: null,
      step: 'processing',
    }));

    try {
      console.log('� Phase 1: Detecting business card...', file.name);

      // Call Phase 1 detection (no confirmTempRecordId)
      const response = await CardScannerAPI.uploadCard(file);
      const data = response.aiResponse;

      console.log('✅ Phase 1 detection result:', data);

      // Check if it's a valid business card
      if (data.is_business_card === false) {
        // Invalid card - show rejection screen
        setState(prev => ({
          ...prev,
          isLoading: false,
          step: 'rejection',
          detectionResult: {
            isBusinessCard: false,
            validationReason: data.validation_reason || 'Not a valid business card',
            suggestions: data.suggestions || ['Ensure good lighting', 'Capture the entire card', 'Avoid blur or glare'],
          },
        }));
        setToast({ message: 'Card validation failed', type: 'error' });
        return;
      }

      // Valid card - show preview screen
      setState(prev => ({
        ...prev,
        isLoading: false,
        step: 'preview',
        detectionResult: {
          isBusinessCard: true,
          croppedImagePreview: data.cropped_image_preview,
          confidence: data.confidence || 0.85,
          tempRecordId: response.transactionID,
        },
      }));
      setToast({ message: 'Card detected successfully!', type: 'success' });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Card detection failed';
      console.error('❌ Phase 1 detection error:', err);
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false,
        step: 'capture',
      }));
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  // Phase 2: Confirmation handler (user clicked "Confirm & Process" on preview screen)
  const handleConfirmCard = async () => {
    const tempRecordId = state.detectionResult?.tempRecordId;
    if (!tempRecordId || !state.capturedImage) {
      setToast({ message: 'Missing detection data', type: 'error' });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, step: 'processing' }));

    try {
      console.log('🚀 Phase 2: Processing confirmed card with streaming...');

      const response = await CardScannerAPI.uploadCard(state.capturedImage, {
        confirmTempRecordId: tempRecordId,
        streamCompanyResearch: true,
        onInitial: (payload) => {
          // Mark streaming
          usedStreamingRef.current = true;

          const structuredData = payload.structured_data || {};
          const extractedUserInfo: UserInfo = {
            transactionID: payload.record_id,
            email: structuredData.email || null,
            name: structuredData.name || null,
            phone: structuredData.phone || null,
            company: structuredData.company || null,
            is_meeting_requested: false,
            created_at: new Date().toISOString(),
          };

          const companyData = structuredData.company_data || payload.additional_info?.company_data || payload.additional_info || {};
          const llmResponse: LLMResponse = {
            extracted_data: {
              ...structuredData,
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
            confidence_score: (payload as any).confidence || 0.85,
          };

          // Show result screen with initial data
          setState(prev => ({
            ...prev,
            transactionID: payload.record_id,
            extractedData: extractedUserInfo,
            processingStatus: 'processing',
            llmResponse: llmResponse,
            step: 'result',
            isLoading: false,
          }));

          setToast({ message: 'Card processed! Enriching company data…', type: 'info' });
        },
        onStreamEvent: ({ event, data }) => {
          console.log('📡 Received SSE event:', event, 'Data:', data);
          
          // Handle streaming text chunks
          if (event === 'message' && data?.chunk) {
            console.log('📝 Appending chunk:', data.chunk);
            setState(prev => ({
              ...prev,
              llmResponse: {
                extracted_data: {
                  ...prev.llmResponse?.extracted_data,
                  summarised_llm_company_response: (prev.llmResponse?.extracted_data?.summarised_llm_company_response || '') + data.chunk,
                },
                confidence_score: prev.llmResponse?.confidence_score || 0.85,
              },
            }));
            return;
          }

          // Handle company_data_ready event
          if (event === 'company_data_ready') {
            console.log('📊 Company data ready event received:', data);
            const inlineCompany = data?.company_structured_data;
            if (inlineCompany) {
              console.log('✅ Processing company structured data:', Object.keys(inlineCompany));
              setState(prev => ({
                ...prev,
                llmResponse: {
                  extracted_data: {
                    ...prev.llmResponse?.extracted_data,
                    company_description: inlineCompany["Description/tagline"] || prev.llmResponse?.extracted_data?.company_description,
                    products: inlineCompany["Products/services"] || prev.llmResponse?.extracted_data?.products,
                    location: inlineCompany["Location/headquarters"] || prev.llmResponse?.extracted_data?.location,
                    industry: inlineCompany["Industry"] || prev.llmResponse?.extracted_data?.industry,
                    num_of_employees: inlineCompany["Number of employees"] || prev.llmResponse?.extracted_data?.num_of_employees,
                    revenue: inlineCompany["Revenue"] || prev.llmResponse?.extracted_data?.revenue,
                    market_share: inlineCompany["Market Share"] || prev.llmResponse?.extracted_data?.market_share,
                    investors: inlineCompany["Investors"] || prev.llmResponse?.extracted_data?.investors,
                    summarised_llm_company_response: inlineCompany["Summarised LLM company response"] || prev.llmResponse?.extracted_data?.summarised_llm_company_response,
                    other_info_of_company: inlineCompany["Other info of company"] || prev.llmResponse?.extracted_data?.other_info_of_company,
                  },
                  confidence_score: prev.llmResponse?.confidence_score || 0.85,
                },
                processingStatus: 'completed',
              }));
              setToast({ message: 'Company data enriched!', type: 'success' });
            } else {
              console.log('⏳ Company data ready but no structured data yet (intermediate event)');
            }
          }

          // Handle company_research_saved event
          if (event === 'company_research_saved') {
            console.log('✅ Company data saved to database');
            setToast({ message: 'Company data saved!', type: 'success' });
          }
        },
      });

      console.log('✅ Phase 2 complete:', response);
      
      // Fallback: If streaming didn't trigger onInitial (non-SSE response), handle it here
      if (!usedStreamingRef.current && response) {
        console.log('⚠️ Streaming did not trigger, using fallback response handling');
        const structuredData = response.aiResponse?.structured_data || {};
        const extractedUserInfo: UserInfo = {
          transactionID: response.transactionID,
          email: structuredData.email || null,
          name: structuredData.name || null,
          phone: structuredData.phone || null,
          company: structuredData.company || null,
          is_meeting_requested: false,
          created_at: new Date().toISOString(),
        };
        
        const companyData = structuredData.company_data || response.aiResponse?.additional_info?.company_data || response.aiResponse?.additional_info || {};
        const llmResponse: LLMResponse = {
          extracted_data: {
            ...structuredData,
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
          confidence_score: response.aiResponse?.confidence || 0.85,
        };

        setState(prev => ({
          ...prev,
          transactionID: response.transactionID,
          extractedData: extractedUserInfo,
          processingStatus: 'completed',
          llmResponse: llmResponse,
          step: 'result',
          isLoading: false,
        }));
        
        setToast({ message: 'Card processed successfully!', type: 'success' });
      }
      
    } catch (err) {
      console.error('❌ Phase 2 error:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Processing failed',
        isLoading: false,
        step: 'preview', // Return to preview on error
      }));
      setToast({ message: 'Processing failed', type: 'error' });
    }
  };

  const handleRetryCapture = () => {
    setState(prev => ({
      ...prev,
      step: 'capture',
      capturedImage: null,
      detectionResult: undefined,
      error: null,
    }));
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
      setToast({ message: result.message || 'Selfie captured successfully!', type: 'success' });
      
      // After successful upload, set includeSelfie to true (user captured selfie)
      setIncludeSelfie(true);

      // Generate email draft after successful selfie upload
      try {
        console.log('📧 Generating email draft after selfie upload...');
        const emailDraftResult = await CardScannerAPI.generateEmailDraft(state.transactionID);
        
        if (emailDraftResult.success && emailDraftResult.email_draft) {
          // Extract email draft data
          const emailDraft = emailDraftResult.email_draft;
          const generatedDraft = {
            to: state.extractedData?.email || '',
            subject: emailDraft.subject || emailDraftResult.email_subject || '',
            body: emailDraft.body || emailDraftResult.email_body || '',
          };
          
          setState(prev => ({
            ...prev,
            step: 'emailDraft',
            emailDraft: generatedDraft,
            isLoading: false,
          }));
          
          setToast({ message: 'Email draft generated successfully!', type: 'success' });
          console.log('✅ Email draft generated:', emailDraftResult);
        } else {
          // Navigate to email draft even if generation fails (user can still edit)
          setState(prev => ({
            ...prev,
            step: 'emailDraft',
            isLoading: false,
          }));
          setToast({ message: 'Email draft generation unavailable. You can create your own draft.', type: 'info' });
        }
      } catch (emailErr) {
        console.error('❌ Email draft generation error:', emailErr);
        // Navigate to email draft anyway (user can still create their own)
        setState(prev => ({
          ...prev,
          step: 'emailDraft',
          isLoading: false,
        }));
        setToast({ message: 'Email draft generation failed. You can create your own draft.', type: 'info' });
      }
    } catch (err) {
      console.error('❌ Selfie upload error:', err);
      setState(prev => ({ ...prev, isLoading: false }));
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload selfie';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  const handleSkipSelfie = async () => {
    if (!state.transactionID) {
      setToast({ message: 'No transaction ID available', type: 'error' });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Generate email draft when skipping selfie
      console.log('📧 Generating email draft (selfie skipped)...');
      const emailDraftResult = await CardScannerAPI.generateEmailDraft(state.transactionID);
      
      if (emailDraftResult.success && emailDraftResult.email_draft) {
        // Extract email draft data
        const emailDraft = emailDraftResult.email_draft;
        const generatedDraft = {
          to: state.extractedData?.email || '',
          subject: emailDraft.subject || emailDraftResult.email_subject || '',
          body: emailDraft.body || emailDraftResult.email_body || '',
        };
        
        setState(prev => ({
          ...prev,
          step: 'emailDraft',
          emailDraft: generatedDraft,
          isLoading: false,
        }));
        
        setToast({ message: 'Email draft generated successfully!', type: 'success' });
        console.log('✅ Email draft generated:', emailDraftResult);
      } else {
        // Navigate to email draft even if generation fails (user can still edit)
        setState(prev => ({
          ...prev,
          step: 'emailDraft',
          isLoading: false,
        }));
        setToast({ message: 'Email draft generation unavailable. You can create your own draft.', type: 'info' });
      }
    } catch (emailErr) {
      console.error('❌ Email draft generation error:', emailErr);
      // Navigate to email draft anyway (user can still create their own)
      setState(prev => ({
        ...prev,
        step: 'emailDraft',
        isLoading: false,
      }));
      setToast({ message: 'Email draft generation failed. You can create your own draft.', type: 'info' });
    }
  };

  const handleProceedToSelfie = () => {
    setState(prev => ({
      ...prev,
      step: 'selfie',
    }));
  };

  const handleBackToResult = () => {
    setState(prev => ({
      ...prev,
      step: 'result',
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
      const response = await CardScannerAPI.scheduleMeeting(state.transactionID, includeSelfie);
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

  // Add handler for includeSelfie toggle change
  const handleIncludeSelfieChange = (value: boolean) => {
    setIncludeSelfie(value);
  };

  return (
    <div className="min-h-screen overflow-y-auto" style={{background: 'linear-gradient(135deg, #0e1a3b 0%, #0f1b3c 60%, #0e1a3b 100%)'}}>
      {/* Light glassmorphism background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
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

        {state.step === 'preview' && state.detectionResult?.isBusinessCard && (
          <CardPreviewScreen
            croppedImagePreview={state.detectionResult.croppedImagePreview || ''}
            confidence={state.detectionResult.confidence || 0}
            detectionMessage="Card detected successfully!"
            onConfirm={handleConfirmCard}
            onRetry={handleRetryCapture}
          />
        )}

        {state.step === 'rejection' && state.detectionResult && !state.detectionResult.isBusinessCard && (
          <CardRejectionScreen
            validationReason={state.detectionResult.validationReason || 'Not a valid business card'}
            suggestions={state.detectionResult.suggestions || []}
            onRetry={handleRetryCapture}
          />
        )}

        {state.step === 'result' && state.extractedData && (
          <ResultScreen
            userInfo={state.extractedData}
            llmResponse={state.llmResponse}
            processingStatus={state.processingStatus || 'completed'}
            onScheduleMeeting={handleScheduleMeeting}
            onScanAnother={handleScanAnother}
            onPrevious={() => {
              setState(prev => ({ ...prev, step: 'capture' }));
            }}
            onNext={() => {
              // Navigate to avatar step
              setState(prev => ({ ...prev, step: 'avatar' }));
            }}
          />
        )}
        {state.step === 'avatar' && state.extractedData && (
          <AvatarScreen
            onProceedToSelfie={handleProceedToSelfie}
            onGoBack={handleBackToResult}
          />
        )}

        {state.step === 'selfie' && state.transactionID && (
          <SelfieCaptureScreen
            transactionID={state.transactionID}
            onCapture={handleSelfieCapture}
            onSkip={handleSkipSelfie}
            isLoading={state.isLoading}
            onPrevious={() => setState(prev => ({ ...prev, step: 'avatar' }))}
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
            emailDraft={state.emailDraft}
            includeSelfie={includeSelfie}
            onIncludeSelfieChange={handleIncludeSelfieChange}
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
            onScheduleMeeting={async () => {
              // Pass includeSelfie when scheduling meeting
              if (!state.transactionID) return;
              try {
                await CardScannerAPI.scheduleMeeting(state.transactionID, includeSelfie);
                setToast({ message: 'Meeting requested!', type: 'success' });
              } catch (err) {
                console.error('❌ Meeting scheduling error:', err);
                setToast({ message: 'Failed to schedule meeting', type: 'error' });
              }
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
