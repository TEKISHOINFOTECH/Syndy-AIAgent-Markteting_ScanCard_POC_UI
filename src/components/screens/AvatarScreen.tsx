import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, MessageCircle, Video, Users, Sparkles, Clock, Play, Volume2, Maximize, Minimize, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [transcriptInfo, setTranscriptInfo] = useState<{
    name?: string;
    company?: string;
    messageCount?: number;
  }>({});

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

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

  // Fullscreen Modal Component
  const FullscreenAvatar = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Fullscreen Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
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
              onClick={toggleFullscreen}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              title="Exit Fullscreen (ESC)"
            >
              <Minimize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Avatar Container */}
      <div className="pt-20 h-full">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
            >
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Preparing Avatar</h3>
                <p className="text-gray-600">Setting up your AI assistant...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!sessionEnded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.95 : 1 }}
            transition={{ delay: 0.5 }}
            className="h-full"
          >
            <iframe
              src={iframeSrc}
              className="w-full h-full border-0"
              allow="camera; microphone; autoplay"
              title="AI Avatar Assistant - Fullscreen"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-8"
          >
            <div className="text-center max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Great Conversation!
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Your session with Aria has been completed and all insights have been saved.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinueToSelfie}
                className="px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg text-lg"
              >
                Continue to Next Step
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-20 pb-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <button
            onClick={onGoBack}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-green-50 hover:text-green-700 transition-all border border-gray-300 hover:border-green-300 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">Step 3 of 6</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <span className="text-sm font-medium text-gray-800">AI Avatar Chat</span>
          </div>

          <button
            onClick={handleContinueToSelfie}
            disabled={!sessionEnded}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-md ${
              sessionEnded 
                ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Main Content with improved layout */}
        <div className="flex gap-6">
          {/* Left Sidebar - Instructions & Status */}
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
            {/* Collapse/Expand Button */}
            <motion.button
              onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
              className="w-full flex items-center justify-center p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {leftPanelCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
              {!leftPanelCollapsed && (
                <span className="ml-2 text-sm text-gray-600">Collapse Panel</span>
              )}
            </motion.button>

            {!leftPanelCollapsed && (
              <>
                {/* Welcome Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Meet Aria</h3>
                      <p className="text-sm text-gray-500">Your AI Assistant</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Experience natural conversation with our AI-powered avatar. Aria will help gather additional information to personalize your outreach.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <Play className="w-4 h-4" />
                    <span>Click to start conversation</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">What to Expect</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Natural Conversation</p>
                        <p className="text-sm text-gray-600">Chat naturally with voice or text</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Context Gathering</p>
                        <p className="text-sm text-gray-600">Share additional business insights</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Volume2 className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Smart Recording</p>
                        <p className="text-sm text-gray-600">Everything is saved for personalization</p>
                      </div>
                    </div>
                  </div>
                </div>

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

          {/* Right Content - Avatar Interface (Now with flex-grow) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 min-w-0"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full">
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
                      onClick={toggleFullscreen}
                      className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                      title="Open Fullscreen"
                    >
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Avatar Container with improved height */}
              <div className="relative" style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}>
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Preparing Avatar</h3>
                        <p className="text-gray-600">Setting up your AI assistant...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!sessionEnded ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.95 : 1 }}
                    transition={{ delay: 0.5 }}
                    className="h-full"
                  >
                    <iframe
                      src={iframeSrc}
                      className="w-full h-full border-0"
                      allow="camera; microphone; autoplay"
                      title="AI Avatar Assistant"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-8"
                  >
                    <div className="text-center max-w-md">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Great Conversation!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Your session with Aria has been completed and all insights have been saved.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleContinueToSelfie}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg"
                      >
                        Continue to Next Step
                      </motion.button>
                    </div>
                  </motion.div>
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

      {/* Enhanced Success Modal */}
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
              {/* Decorative background */}
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