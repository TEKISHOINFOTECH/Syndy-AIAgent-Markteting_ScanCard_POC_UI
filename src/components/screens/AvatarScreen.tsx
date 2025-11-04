import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import '../../avatar-styles.css';

interface AvatarScreenProps {
  /** Callback when user wants to proceed to selfie */
  onProceedToSelfie: () => void;
  /** Callback when user wants to go back to result */
  onGoBack: () => void;
}

const AvatarScreen: React.FC<AvatarScreenProps> = ({
  onProceedToSelfie,
  onGoBack
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const [transcriptInfo, setTranscriptInfo] = useState<{
    name?: string;
    company?: string;
    messageCount?: number;
  }>({});

  useEffect(() => {
    // Construct iframe URL with return parameters
    const currentUrl = window.location.origin;
    const returnUrl = encodeURIComponent(`${currentUrl}/avatar-callback`);
    const avatarUrl = `https://syndy-ai-agent-avatar-and-voice-age.vercel.app/?returnUrl=${returnUrl}&step=selfie&source=card-scanner`;
    
    setIframeSrc(avatarUrl);

    // Listen for messages from the avatar iframe
    const handleMessage = (event: MessageEvent) => {
      // Security: Verify origin
      if (event.origin !== 'https://syndy-ai-agent-avatar-and-voice-age.vercel.app') {
        console.warn('⚠️ Received message from untrusted origin:', event.origin);
        return;
      }

      const { type, data } = event.data;
      console.log('📥 Received message from avatar:', type, data);

      switch (type) {
        case 'AVATAR_CHAT_STARTED':
          console.log('✅ Avatar chat started');
          setSessionEnded(false);
          setShowSuccessModal(false);
          break;
        
        case 'AVATAR_CHAT_ENDED':
          console.log('✅ Avatar chat ended successfully');
          setSessionEnded(true);
          setShowSuccessModal(true);
          break;
        
        case 'AVATAR_TRANSCRIPT_SAVED':
          console.log('💾 Transcript saved:', data);
          setTranscriptInfo({
            name: data.name,
            company: data.company,
            messageCount: data.messageCount
          });
          break;
        
        case 'AVATAR_ERROR':
          console.error('❌ Avatar error:', data.error);
          alert(`Avatar Error: ${data.error}`);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleContinueToSelfie = () => {
    setShowSuccessModal(false);
    onProceedToSelfie();
  };

  const handleStayHere = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onGoBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-md border border-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="text-sm font-medium text-gray-600">
            Step 3 of 5 • Avatar Setup
          </div>

          <button
            onClick={handleContinueToSelfie}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* AI Avatar Assistant Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Meet Your AI Avatar Assistant
            </h2>
            <p className="text-gray-600">
              Experience interactive video chat with your AI representative
            </p>
          </div>

          {/* Avatar iframe or success state */}
          <div className="avatar-container relative" style={{ minHeight: '600px' }}>
            {!sessionEnded ? (
              <iframe
                src={iframeSrc}
                className="w-full rounded-lg border-2 border-gray-200"
                style={{ height: '600px' }}
                allow="camera; microphone; autoplay"
                title="AI Avatar Assistant"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                <div className="text-center p-8">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Session Complete!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your conversation has been saved successfully
                  </p>
                  {transcriptInfo.name && (
                    <div className="bg-white rounded-lg p-4 shadow-sm inline-block">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Contact:</span> {transcriptInfo.name}
                      </p>
                      {transcriptInfo.company && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Company:</span> {transcriptInfo.company}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Messages:</span> {transcriptInfo.messageCount || 0}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center">
              <div className="mb-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Session Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Your conversation with Aria has been saved successfully. 
                {transcriptInfo.name && ` Contact information for ${transcriptInfo.name} has been recorded.`}
              </p>
              
              {transcriptInfo.messageCount && transcriptInfo.messageCount > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    📊 <span className="font-semibold">{transcriptInfo.messageCount} messages</span> saved to database
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleContinueToSelfie}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Continue to Selfie Capture
                </button>
                <button
                  onClick={handleStayHere}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Review Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AvatarScreen;