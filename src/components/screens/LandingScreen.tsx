import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, Calendar, Scan } from 'lucide-react';
import { CardScannerAPI } from '../../services/api';

interface LandingScreenProps {
  onStartScan: () => void;
  activeView?: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner';
  onNavClick?: (view: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner') => void;
}

export function LandingScreen({ onStartScan, activeView: _activeView = 'cardscanner', onNavClick: _onNavClick }: LandingScreenProps) {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ready' | 'error'>('checking');

  useEffect(() => {
    // Check backend status only when component mounts
    const checkBackend = async () => {
      const isReachable = await CardScannerAPI.pingBackend();
      setBackendStatus(isReachable ? 'ready' : 'error');
    };
    checkBackend();
  }, []);

  const features = [
    { icon: <Camera className="w-7 h-7" />, title: 'Instant Scanning', description: 'Capture business cards in seconds' },
    { icon: <Zap className="w-7 h-7" />, title: 'AI-Powered', description: 'Smart extraction using advanced AI' },
    { icon: <Calendar className="w-7 h-7" />, title: 'Easy Scheduling', description: 'Schedule meetings with one click' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col px-4 sm:px-6 overflow-y-auto pb-8 pt-20 relative">
      {/* Animated Background Elements - Same as Home Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto flex flex-col items-center justify-center flex-1 space-y-8 sm:space-y-12">
        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center space-y-3 sm:space-y-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Scan Business Cards
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-purple-200 max-w-2xl mx-auto px-4">
            Transform business cards into digital contacts with AI-powered scanning
          </p>
        </motion.div>

        {/* Button with Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartScan}
            className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-base sm:text-lg font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
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

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
