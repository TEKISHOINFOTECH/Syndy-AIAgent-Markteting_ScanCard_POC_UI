import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { CardScannerAPI } from '../../services/api';

interface LandingScreenProps {
  onStartScan: () => void;
  activeView?: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner';
  onNavClick?: (view: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner') => void;
}

export function LandingScreen({ onStartScan, activeView = 'cardscanner', onNavClick }: LandingScreenProps) {
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
    { icon: <Camera className="w-6 h-6" />, title: 'Instant Scanning', description: 'Capture business cards in seconds' },
    { icon: <Zap className="w-6 h-6" />, title: 'AI-Powered', description: 'Smart extraction using advanced AI' },
    { icon: <Calendar className="w-6 h-6" />, title: 'Easy Scheduling', description: 'Schedule meetings with one click' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col px-4 sm:px-6 overflow-y-auto pb-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full mx-auto pt-1 sm:pt-2"
      >
        {/* Heading Section - Top */}
        <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 flex-shrink-0"
            >
              <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>

            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Scan Business Cards
            </h1>
          </div>
          
          <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            Transform business cards into digital contacts with AI-powered scanning
          </p>
        </div>
      </motion.div>

      {/* Button with Status Indicator - Center of Screen */}
      <div className="flex items-center justify-center gap-3 max-w-4xl w-full mx-auto py-4 sm:py-6">
        <Button size="lg" onClick={onStartScan}>
          Start Scanning
        </Button>
        
        {/* Backend Status Indicator - Beside Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <div
            className={`
              px-2.5 py-1.5 rounded-full backdrop-blur-2xl border shadow-lg
              flex items-center gap-1.5 text-xs font-medium
              transition-all duration-500
              ${backendStatus === 'ready'
                ? 'bg-green-500/20 border-green-400/50 text-green-700 shadow-green-500/30'
                : backendStatus === 'error'
                ? 'bg-red-500/20 border-red-400/50 text-red-700 shadow-red-500/30'
                : 'bg-gray-500/20 border-gray-400/50 text-gray-700 shadow-gray-500/30'
              }
            `}
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            {/* Status Dot with Glow */}
            <span className="relative flex h-2.5 w-2.5">
              {/* Ping animation for ready state */}
              {backendStatus === 'ready' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              )}
              <span
                className={`
                  relative inline-flex rounded-full h-2.5 w-2.5
                  ${backendStatus === 'ready'
                    ? 'bg-green-500 shadow-lg shadow-green-500/50'
                    : backendStatus === 'error'
                    ? 'bg-red-500 shadow-lg shadow-red-500/50'
                    : 'bg-gray-400 shadow-lg shadow-gray-400/50 animate-pulse'
                  }
                `}
              ></span>
            </span>
            <span>
              {backendStatus === 'ready' ? 'Ready' : backendStatus === 'error' ? 'Offline' : 'Checking...'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Features - Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl w-full mx-auto pb-4"
      >

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-green-300 transition-colors shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-3 sm:mb-4 text-green-600">
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
