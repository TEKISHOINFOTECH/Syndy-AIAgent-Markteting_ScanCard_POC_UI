import { motion } from 'framer-motion';
import { Camera, Zap, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { NavTabs } from '../ui/NavTabs';

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-start justify-center pt-20 sm:pt-24 md:items-center md:pt-0 p-4 sm:p-6 overflow-y-auto pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full text-center space-y-6 sm:space-y-8 md:space-y-12"
      >
        {/* Hero Section */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 mb-3 sm:mb-4 md:mb-6"
          >
            <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Scan Business Cards
          </h1>
          
          <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            Transform business cards into digital contacts with AI-powered scanning
          </p>

          <Button size="lg" onClick={onStartScan} className="mt-3 sm:mt-4 md:mt-8">
            <Camera className="w-5 h-5" />
            Start Scanning
          </Button>
        </div>

        {/* Navigation Tabs */}
        {onNavClick && (
          <div className="mb-6 sm:mb-8">
            <NavTabs activeView={activeView} onNavClick={onNavClick} />
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-16">
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
