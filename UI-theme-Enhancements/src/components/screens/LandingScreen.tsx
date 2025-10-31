import { motion } from 'framer-motion';
import { Camera, Zap, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

interface LandingScreenProps {
  onStartScan: () => void;
}

export function LandingScreen({ onStartScan }: LandingScreenProps) {
  const features = [
    { icon: <Camera className="w-6 h-6" />, title: 'Instant Scanning', description: 'Capture business cards in seconds' },
    { icon: <Zap className="w-6 h-6" />, title: 'AI-Powered', description: 'Smart extraction using advanced AI' },
    { icon: <Calendar className="w-6 h-6" />, title: 'Easy Scheduling', description: 'Schedule meetings with one click' }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full text-center space-y-12"
      >
        {/* Hero Section */}
        <div className="space-y-6">
          {/* Decorative hero icon removed for cleaner professional look */}
          <div className="mb-6" />

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Scan Business Cards
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform business cards into digital contacts instantly with AI-powered scanning and automated meeting scheduling
          </p>

          <Button size="lg" onClick={onStartScan} className="mt-8 mx-auto">
            Start Scanning
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-green-200/50 hover:border-green-300/70 transition-colors shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 mb-4 text-green-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
