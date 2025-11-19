import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, Home } from 'lucide-react';
import { CardScannerAPI } from '../../services/api';
import heroVideo from '../../images/5-mascot.mp4';
interface LandingScreenProps {
  onStartScan: () => void;
  onNavClick?: (view: 'home' | 'cardscanner') => void;
}

export function LandingScreen({ onStartScan, onNavClick }: LandingScreenProps) {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ready' | 'error'>('checking');

useEffect(() => {
    // Check backend status only when component mounts
    const checkBackend = async () => {
      const isReachable = await CardScannerAPI.pingBackend();
      setBackendStatus(isReachable ? 'ready' : 'error');
    };
    checkBackend();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col overflow-y-auto pb-8 pt-2 sm:pt-4 relative w-full">
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 space-y-5 sm:space-y-6">
        {/* Logo and LeadQ.AI Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-3 mb-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-500">
              TEKISHO
            </span>
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              LeadQ.AI
            </span>
          </div>
        </motion.div>

        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center space-y-2 sm:space-y-3"
        >
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          AI Lead Intelligence Suite 
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-purple-200 max-w-xl mx-auto px-2">
            
          </p>
        </motion.div>

        {/* Button with Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavClick?.('home')}
            className="group relative px-6 sm:px-8 py-2.5 sm:py-3.5 bg-white/10 text-white text-sm sm:text-base font-medium rounded-2xl border border-white/30 hover:border-white/60 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-3">
              Home Page
              <Home className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartScan}
            className="group relative px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm sm:text-base font-semibold rounded-2xl shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Scanning
              <Scan className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>
          
          {/* Backend Status Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <div
              className={`
                px-4 py-2.5 rounded-full backdrop-blur-xl border shadow-lg
                flex items-center gap-2 text-sm font-medium
                transition-all duration-500
                ${backendStatus === 'ready'
                  ? 'bg-purple-500/20 border-purple-400/50 text-purple-200 shadow-purple-500/30'
                  : backendStatus === 'error'
                  ? 'bg-red-500/30 border-red-400/50 text-red-200 shadow-red-500/30'
                  : 'bg-white/10 border-white/30 text-purple-200 shadow-white/10'
                }
              `}
            >
              <span className="relative flex h-3 w-3">
                {backendStatus === 'ready' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                )}
                <span
                  className={`
                    relative inline-flex rounded-full h-3 w-3
                    ${backendStatus === 'ready'
                      ? 'bg-purple-400 shadow-lg shadow-purple-400/50'
                      : backendStatus === 'error'
                      ? 'bg-red-400 shadow-lg shadow-red-400/50'
                      : 'bg-white/50 shadow-lg shadow-white/30 animate-pulse'
                    }
                  `}
                ></span>
              </span>
              <span>
                {backendStatus === 'ready' ? 'Ready' : backendStatus === 'error' ? 'Offline' : 'Checking...'}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Avatar Video with Glowing Moving Border */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
          className="w-full flex justify-center"
        >
          <div className="video-glow-border">
            <div className="video-inner">
              <video
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-w-md sm:max-w-lg md:max-w-xl object-contain block video-enhanced"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </motion.div>

        {/* Features Grid removed as requested */}
      </div>
    </div>
  );
}