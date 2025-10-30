import { useState } from 'react';
import { LandingScreen } from './screens/LandingScreen';
import { CardCaptureScreen } from './screens/CardCaptureScreen';
import { ResultScreen } from './screens/ResultScreen';
import { MeetingConfirmationScreen } from './screens/MeetingConfirmationScreen';
import { Toast } from './ui/Toast';
import { CardScannerAPI } from '../services/api';
import type { CardScanState, UserInfo } from '../types/cardScanner';

export function CardScannerApp() {
  const [state, setState] = useState<CardScanState>({
    step: 'landing',
    transactionID: null,
    capturedImage: null,
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
      
      // Create placeholder user info with transactionID
      const placeholderUserInfo: UserInfo = {
        transaction_id: response.transactionID,
        email: null,
        name: null,
        phone: null,
        company: null,
        is_meeting_requested: false,
        created_at: new Date().toISOString(),
      };
      
      // Go directly to result screen (no polling needed)
      setState(prev => ({
        ...prev,
        step: 'result',
        transactionID: response.transactionID,
        extractedData: placeholderUserInfo,
        processingStatus: 'completed',
        isLoading: false,
      }));
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

  const handleScheduleMeeting = async () => {
    if (!state.transactionID) {
      setToast({ message: 'No transaction ID available', type: 'error' });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      console.log('� Scheduling meeting for transaction:', state.transactionID);
      
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
    <>
      {state.step === 'landing' && (
        <LandingScreen onStartScan={handleStartScan} />
      )}

      {state.step === 'capture' && (
        <CardCaptureScreen 
          onCapture={handleCapture} 
          onCancel={handleCancelCapture}
        />
      )}

      {state.step === 'result' && state.extractedData && (
        <ResultScreen
          userInfo={state.extractedData}
          llmResponse={null}
          processingStatus={state.processingStatus || 'completed'}
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
    </>
  );
}
