import { motion } from 'framer-motion';
import { Camera, Zap, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

interface LandingScreenProps {
  onStartScan: () => void;
  activeView?: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner';
  onNavClick?: (view: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner') => void;
}

export function LandingScreen({ onStartScan, activeView = 'cardscanner', onNavClick }: LandingScreenProps) {
  const features = [
    { icon: <Camera className="w-6 h-6" />, title: 'Instant Scanning', description: 'Capture business cards in seconds' },
    { icon: <Zap className="w-6 h-6" />, title: 'AI-Powered', description: 'Smart extraction using advanced AI' },
    { icon: <Calendar className="w-6 h-6" />, title: 'Easy Scheduling', description: 'Schedule meetings with one click' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col px-4 sm:px-6 overflow-y-auto pb-6">
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

      {/* Button - Center of Screen */}
      <div className="flex items-center justify-center max-w-4xl w-full mx-auto py-4 sm:py-6">
        <Button size="lg" onClick={onStartScan}>
          <Camera className="w-5 h-5" />
          Start Scanning
        </Button>
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
