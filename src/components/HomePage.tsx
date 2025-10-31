import { motion } from "framer-motion";
import { Mic, Users, Zap, Search } from "lucide-react";
import { TekishoCard } from "./TekishoCard";

interface HomePageProps {
  onOpenVoiceAssistant: () => void;
}

export const HomePage = ({ onOpenVoiceAssistant }: HomePageProps) => {
  const features = [
    { icon: <Users className="w-6 h-6" />, title: 'Enterprise Solutions', description: 'Connect with professionals instantly' },
    { icon: <Zap className="w-6 h-6" />, title: 'AI-Powered Innovation', description: 'Advanced AI for business transformation' },
    { icon: <Search className="w-6 h-6" />, title: 'Smart Analytics', description: 'Data-driven insights for better decisions' },
    { icon: <Mic className="w-6 h-6" />, title: 'Voice Assistant', description: 'Interact with AI using voice commands', onClick: onOpenVoiceAssistant }
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12 sm:mb-16">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-gray-800">Tekisho - </span>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                The Right Place for Innovative Solutions
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Tekisho helps enterprises modernize systems and build AI-powered solutions 
              that deliver measurable business impact.
            </p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Smart Features</h2>
              <div className="space-y-4 sm:space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`flex items-center space-x-4 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 hover:border-green-300 transition-colors shadow-sm ${feature.onClick ? 'cursor-pointer' : ''}`}
                    onClick={feature.onClick}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Card Display */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <TekishoCard 
                name="John Doe"
                designation="Senior Engineer" 
                email="john@tekisho.com"
                phone="+1 (555) 123-4567"
                company="Tekisho Technologies"
                animated={true}
              />
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Preview
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl">
            Start Networking Today
          </button>
        </motion.div>
      </div>
    </div>
  );
};