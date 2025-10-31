import { useState } from 'react';
import { LandingScreen } from './screens/LandingScreen';
import { CardCaptureScreen } from './screens/CardCaptureScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { SelfieCaptureScreen } from './screens/SelfieCaptureScreen';
import { ResultScreen } from './screens/ResultScreen';
import { MeetingConfirmationScreen } from './screens/MeetingConfirmationScreen';
import { Toast } from './ui/Toast';
import { StepIndicator } from './ui/StepIndicator';
import { CardScannerAPI } from '../services/api';
import type { CardScanState, UserInfo } from '../types/cardScanner';

export function CardScannerApp() {
  const [state, setState] = useState<CardScanState>({
    step: 'landing',
    transactionID: null,
    capturedImage: null,
    selfieImage: null,
    extractedData: null,
    processingStatus: null,
    isLoading: false,
    error: null,
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleStartScan = () => {
    setState(prev => ({ ...prev, step: 'capture' }));
  };

  const handleCapture = async (file: File) => {
    setState(prev => ({ 
      ...prev, 
      capturedImage: file,
      isLoading: true,
      error: null,
    }));

    try {
      console.log('📤 Uploading file:', file.name, file.type, `${(file.size / 1024).toFixed(2)}KB`);
      
      const response = await CardScannerAPI.uploadCard(file);
      
      console.log('✅ Upload response:', response);
      
      // Go to processing screen
      setState(prev => ({
        ...prev,
        step: 'processing',
        transactionID: response.transactionID,
        isLoading: false,
      }));

      // Start processing and then move to selfie
      setTimeout(async () => {
        try {
          const result = await CardScannerAPI.checkProcessingStatus(response.transactionID);
          
          // Extract real user data from the API result
          const extractedUserInfo: UserInfo = {
            transaction_id: response.transactionID,
            email: result.llm_response?.extracted_data?.email || null,
            name: result.llm_response?.extracted_data?.name || null,
            title: result.llm_response?.extracted_data?.title || null,
            phone: result.llm_response?.extracted_data?.phone || null,
            company: result.llm_response?.extracted_data?.company || null,
            is_meeting_requested: false,
            created_at: new Date().toISOString(),
          };
          
          setState(prev => ({
            ...prev,
            step: 'selfie',
            processingStatus: result.processing_status,
            extractedData: extractedUserInfo,
          }));
        } catch (err) {
          console.error('❌ Processing error:', err);
          setState(prev => ({
            ...prev,
            error: 'Failed to process card',
            step: 'landing',
          }));
        }
      }, 3000);
      setToast({ message: 'Card uploaded successfully!', type: 'success' });
    } catch (err) {
      console.error('❌ Upload error:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to upload card',
        isLoading: false,
      }));
      setToast({ message: 'Failed to upload card', type: 'error' });
    }
  };

  const handleCancelCapture = () => {
    setState(prev => ({ ...prev, step: 'landing' }));
  };

  const handleSelfieCapture = async (selfieFile: File, previewUrl: string) => {
    if (!state.transactionID) {
      setToast({ message: 'No transaction ID available', type: 'error' });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await CardScannerAPI.uploadSelfie(state.transactionID, selfieFile);
      
      setState(prev => ({
        ...prev,
        step: 'result',
        selfieImage: previewUrl,
        processingStatus: 'completed',
        isLoading: false,
      }));
      
      setToast({ message: 'Selfie captured successfully!', type: 'success' });
    } catch (err) {
      console.error('❌ Selfie upload error:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to upload selfie',
        isLoading: false,
      }));
      setToast({ message: 'Failed to upload selfie', type: 'error' });
    }
  };

  const handleSkipSelfie = () => {
    setState(prev => ({
      ...prev,
      step: 'result',
      processingStatus: 'completed',
    }));
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
      setToast({ message: 'Meeting invitation sent!', type: 'success' });
    } catch (err) {
      console.error('❌ Meeting scheduling error:', err);
      setState(prev => ({ ...prev, isLoading: false }));
      setToast({ message: 'Failed to schedule meeting', type: 'error' });
    }
  };

  const handleScanAnother = () => {
    setState({
      step: 'landing',
      transactionID: null,
      capturedImage: null,
      selfieImage: null,
      extractedData: null,
      processingStatus: null,
      isLoading: false,
      error: null,
    });
  };

  const handleDone = () => {
    handleScanAnother();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Glassmorphic background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={state.step} />

      <div className="relative z-10">
        {state.step === 'landing' && (
          <LandingScreen onStartScan={handleStartScan} />
        )}

        {state.step === 'capture' && (
          <CardCaptureScreen 
            onCapture={handleCapture} 
            onCancel={handleCancelCapture}
          />
        )}

        {state.step === 'processing' && state.transactionID && (
          <ProcessingScreen transactionID={state.transactionID} />
        )}

        {state.step === 'selfie' && state.transactionID && (
          <SelfieCaptureScreen
            transactionID={state.transactionID}
            onCapture={handleSelfieCapture}
            onSkip={handleSkipSelfie}
            isLoading={state.isLoading}
          />
        )}

        {state.step === 'result' && state.extractedData && (
          <ResultScreen
            userInfo={state.extractedData}
            llmResponse={null}
            processingStatus={state.processingStatus || 'completed'}
            selfieImage={state.selfieImage}
            onScheduleMeeting={handleScheduleMeeting}
            onScanAnother={handleScanAnother}
          />
        )}

        {state.step === 'confirmation' && state.transactionID && (
          <MeetingConfirmationScreen
            transactionID={state.transactionID}
            onDone={handleDone}
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