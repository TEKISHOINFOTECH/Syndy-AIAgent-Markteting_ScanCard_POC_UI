import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Video, Clock, Maximize, Minimize, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const leftPanelCollapsed = false;
  const [transcriptInfo, setTranscriptInfo] = useState<{
    name?: string;
    company?: string;
    messageCount?: number;
  }>({});

  // Create refs for containers and iframe
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const normalContainerRef = useRef<HTMLDivElement>(null);
  const refreshDelayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Construct iframe URL with return parameters
    const currentUrl = window.location.origin;
    const returnUrl = encodeURIComponent(`${currentUrl}/avatar-callback`);
    const avatarUrl = `https://syndy-ai-agent-avatar-voice-agent-a-ten.vercel.app//?returnUrl=${returnUrl}&step=selfie&source=card-scanner`;
    
    setIframeSrc(avatarUrl);

    // Listen for messages from the avatar iframe
    const handleMessage = (event: MessageEvent) => {
      // Security: Verify origin
      if (event.origin !== 'https://syndy-ai-agent-avatar-voice-agent-a-ten.vercel.app/') {
        console.warn('⚠️ Received message from untrusted origin:', event.origin);
        return;
      }

      const { type, data } = event.data;
      console.log('📥 Received message from avatar:', type, data);

      switch (type) {
        case 'AVATAR_CHAT_STARTED':
          console.log('✅ Avatar chat started');
          setSessionEnded(false);
          setSessionStarted(true);
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
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, []);

  // Effect to update iframe position when fullscreen toggles
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (isFullscreen) {
      // Make iframe fullscreen using CSS
      console.log('📺 Switching to fullscreen mode');
      iframe.style.position = 'fixed';
      iframe.style.top = '80px'; // Below header
      iframe.style.left = '0';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '100%';
      iframe.style.height = 'calc(100vh - 80px)';
      iframe.style.zIndex = '50';
    } else {
      // Reset to normal positioning
      console.log('📺 Switching to normal mode');
      iframe.style.position = 'static';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.zIndex = 'auto';
    }
  }, [isFullscreen]);

  // Handle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    if (isFullscreen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  const handleContinueToSelfie = () => {
    setShowSuccessModal(false);
    onProceedToSelfie();
  };

  const handleStayHere = () => {
    setShowSuccessModal(false);
  };

  const handleRefreshAvatar = () => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    const iframe = iframeRef.current;
    const currentSrc = iframe.src;

    // Force reload without recreating component
    iframe.src = '';
    requestAnimationFrame(() => {
      iframe.src = currentSrc;
    });

    if (refreshDelayRef.current) {
      clearTimeout(refreshDelayRef.current);
    }

    refreshDelayRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  // Create iframe once on mount - keeps it in one place always
  useEffect(() => {
    if (!iframeSrc) return;

    // Create iframe element
    const iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.className = "w-full h-full border-0";
    iframe.allow = "camera; microphone; autoplay";
    iframe.title = "AI Avatar Assistant";
    iframe.style.backgroundColor = '#f0f0f0';
    
    // Store reference
    (iframeRef as React.MutableRefObject<HTMLIFrameElement | null>).current = iframe;

    // Append to normal container - it stays here always
    const normalContainer = normalContainerRef.current;
    if (normalContainer) {
      normalContainer.appendChild(iframe);
      console.log('✅ Iframe created and appended to container');
    }

    // Cleanup on unmount only
    return () => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      (iframeRef as React.MutableRefObject<HTMLIFrameElement | null>).current = null;
      console.log('🧹 Iframe cleaned up');
      if (refreshDelayRef.current) {
        clearTimeout(refreshDelayRef.current);
      }
    };
  }, [iframeSrc]);

  // Session completed component
  const SessionCompleted = ({ isFullscreenMode = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-8"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <CheckCircle className={`text-purple-600 mx-auto ${isFullscreenMode ? 'w-24 h-24 mb-6' : 'w-20 h-20 mb-4'}`} />
        </motion.div>
        <h3 className={`font-bold text-gray-900 ${isFullscreenMode ? 'text-3xl mb-4' : 'text-2xl mb-2'}`}>
          Great Conversation!
        </h3>
        <p className={`text-gray-600 ${isFullscreenMode ? 'text-lg mb-8' : 'mb-6'}`}>
          Your session with Aria has been completed and all insights have been saved.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinueToSelfie}
          className={`bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-violet-700 transition-colors shadow-lg ${
            isFullscreenMode ? 'px-8 py-4 text-lg' : 'px-6 py-3'
          }`}
        >
          Continue to Next Step
        </motion.button>
      </div>
    </motion.div>
  );

  // Loading component
  const LoadingState = ({ isFullscreenMode = false }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
    >
      <div className="text-center">
        <div className={`border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4 ${isFullscreenMode ? 'w-20 h-20' : 'w-16 h-16'}`}></div>
        <h3 className={`font-semibold text-gray-900 mb-2 ${isFullscreenMode ? 'text-2xl' : 'text-lg'}`}>Preparing Avatar</h3>
        <p className="text-gray-600">Setting up your AI assistant...</p>
      </div>
    </motion.div>
  );

  // Fullscreen Modal Component - Just shows backdrop and controls
  const FullscreenAvatar = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black"
    >
      {/* Fullscreen Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-violet-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Avatar Assistant - Fullscreen</h2>
              <p className="text-blue-100 text-sm">
                {isLoading ? 'Initializing...' : 
                 sessionEnded ? 'Session completed' :
                 sessionStarted ? 'Connected' : 'Ready to start'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isLoading ? 'bg-violet-300 animate-pulse' :
                sessionEnded ? 'bg-purple-300' :
                sessionStarted ? 'bg-purple-400 animate-pulse' : 'bg-blue-300'
              }`}></div>
              <span className="text-white text-sm font-medium">
                {isLoading ? 'Loading' : 
                 sessionEnded ? 'Complete' :
                 sessionStarted ? 'Live' : 'Ready'}
              </span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              title="Exit Fullscreen (ESC)"
            >
              <Minimize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Session completed overlay shown in fullscreen if needed */}
      {sessionEnded && (
        <div className="pt-20 h-full relative">
          <SessionCompleted isFullscreenMode={true} />
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white pt-20 pb-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 border-2 border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinueToSelfie}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-lg hover:shadow-xl"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="flex gap-6 flex-col justify-content-center">
          {/* Left Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              width: leftPanelCollapsed ? '60px' : '400px'
            }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className={`flex-shrink-0 space-y-6 ${leftPanelCollapsed ? 'overflow-hidden' : ''}`}
            style={{ maxWidth: leftPanelCollapsed ? '60px' : '400px' }}
          >
            {!leftPanelCollapsed && (
              <>
                {/* Session Status */}
                <AnimatePresence>
                  {(sessionStarted || sessionEnded) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`bg-white rounded-xl shadow-lg p-6 border ${
                        sessionEnded ? 'border-green-200' : 'border-orange-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          sessionEnded ? 'bg-green-100' : 'bg-orange-100'
                        }`}>
                          {sessionEnded ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {sessionEnded ? 'Session Complete!' : 'Session Active'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {sessionEnded ? 'Ready to continue' : 'Conversation in progress'}
                          </p>
                        </div>
                      </div>
                      
                      {transcriptInfo.messageCount && transcriptInfo.messageCount > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {transcriptInfo.name && (
                              <div>
                                <span className="text-gray-500">Contact:</span>
                                <p className="font-medium text-gray-800">{transcriptInfo.name}</p>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Messages:</span>
                              <p className="font-medium text-gray-800">{transcriptInfo.messageCount}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>

          {/* Right Content - Avatar Interface */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 min-w-0 flex items-center justify-center"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full w-full max-w-5xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">AI Avatar Assistant</h2>
                      <p className="text-blue-100 text-sm">
                        {isLoading ? 'Initializing...' : 
                         sessionEnded ? 'Session completed' :
                         sessionStarted ? 'Connected' : 'Ready to start'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        isLoading ? 'bg-yellow-300 animate-pulse' :
                        sessionEnded ? 'bg-green-300' :
                        sessionStarted ? 'bg-green-400 animate-pulse' : 'bg-blue-300'
                      }`}></div>
                      <span className="text-white text-sm font-medium">
                        {isLoading ? 'Loading' : 
                         sessionEnded ? 'Complete' :
                         sessionStarted ? 'Live' : 'Ready'}
                      </span>
                    </div>
                    <button
                      onClick={handleRefreshAvatar}
                      className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                      title="Refresh Avatar"
                    >
                      <RefreshCw className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                      title="Open Fullscreen"
                    >
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Avatar Container - Always rendered, iframe lives here */}
              <div className="relative" style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}>
                <AnimatePresence>
                  {isLoading && <LoadingState isFullscreenMode={false} />}
                </AnimatePresence>

                {/* Iframe container - always present */}
                {!sessionEnded && (
                  <div ref={normalContainerRef} className="h-full" />
                )}

                {/* Session completed view */}
                {sessionEnded && <SessionCompleted isFullscreenMode={false} />}

                {/* Placeholder overlay when in fullscreen mode */}
                {isFullscreen && !sessionEnded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 z-10">
                    <div className="text-center">
                      <Maximize className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Avatar in Fullscreen</h3>
                      <p className="text-gray-600">Your session is running in fullscreen mode</p>
                      <p className="text-sm text-gray-500 mt-2">Press ESC or click minimize to return</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && <FullscreenAvatar />}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  🎉 Session Complete!
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your conversation with Aria has been saved successfully. 
                  {transcriptInfo.name && ` Contact information for ${transcriptInfo.name} has been recorded.`}
                </p>
                
                {transcriptInfo.messageCount && transcriptInfo.messageCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100"
                  >
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{transcriptInfo.messageCount}</p>
                        <p className="text-sm text-blue-800">Messages Saved</p>
                      </div>
                      {transcriptInfo.company && (
                        <div className="text-center">
                          <p className="text-sm font-medium text-purple-600">{transcriptInfo.company}</p>
                          <p className="text-xs text-purple-800">Company Identified</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinueToSelfie}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                  >
                    Continue to Selfie Capture
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStayHere}
                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Review Session
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvatarScreen;