import { motion } from "framer-motion";
import { Scan, Sparkles, Database, Zap, Home, BarChart3, CreditCard } from "lucide-react";

interface HomePageProps {
  onOpenVoiceAssistant?: () => void;
  activeView?: 'home' |'cardscanner';
  onNavClick?: (view: 'home' | 'cardscanner') => void;
}

export const HomePage = ({ activeView, onNavClick }: HomePageProps) => {
  const handleStartScanning = () => {
    if (onNavClick) {
      onNavClick('cardscanner');
    }
  };

  const navItems = [
    { label: 'Home', icon: Home, view: 'home' as const },
    { label: 'Card Scanner', icon: CreditCard, view: 'cardscanner' as const },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-[95%] lg:max-w-[90rem]"
      >
        {/* Glowing Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-700 to-purple-900 rounded-3xl opacity-90 blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 via-purple-600 to-indigo-700 rounded-3xl animate-pulse"></div>
        
        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-gray-900/95 via-purple-900/90 to-gray-900/95 backdrop-blur-2xl border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden">
          {/* Animated Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Glowing Orbs */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-violet-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

          {/* Card Content */}
          <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            {/* Navigation inside card - Top Center */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.view;
                  return (
                    <motion.button
                      key={item.view}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onNavClick && onNavClick(item.view)}
                      className={`
                        flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30' 
                          : 'text-purple-200 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
            {/* Main Heading with LeadQ.AI Branding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    LeadQ.AI
                  </span>
                </h1>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-purple-200">
                  AI Lead Intelligence Suite
                </h2>
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
            >
              <div className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4">
                  <Scan className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Smart Scanning</h3>
                <p className="text-gray-400 text-sm">AI-powered card detection and text extraction</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Instant Processing</h3>
                <p className="text-gray-400 text-sm">Real-time analysis and data organization</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Secure Storage</h3>
                <p className="text-gray-400 text-sm">Cloud-based contact management system</p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center"
            >
              <button
                onClick={handleStartScanning}
                className="group relative px-12 py-5 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Scanning
                  <Scan className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500/30 rounded-full blur-xl"
        ></motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -bottom-4 -right-4 w-32 h-32 bg-violet-500/30 rounded-full blur-xl"
        ></motion.div>
      </motion.div>

    </div>
  );
};