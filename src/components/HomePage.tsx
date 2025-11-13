import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NavTabs } from "./ui/NavTabs";
import { BackButton } from "./ui/BackButton";
import LeadQLogo from "../images/LeadQ Logo final.png";

interface HomePageProps {
  onOpenVoiceAssistant: () => void;
  activeView?: 'home' | 'analysis' | 'cardscanner';
  onNavClick?: (view: 'home' | 'analysis' | 'cardscanner') => void;
}

export const HomePage = ({ onOpenVoiceAssistant, activeView, onNavClick }: HomePageProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{background: 'linear-gradient(135deg, #0e1a3b 0%, #1a2456 50%, #0e1a3b 100%)'}}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {onNavClick && <BackButton onClick={() => onNavClick('cardscanner')} />}
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-screen flex items-center justify-center">
        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl rounded-3xl p-12 sm:p-16 lg:p-20 relative overflow-hidden shadow-2xl"
          style={{background: 'linear-gradient(135deg, #0f1b3c 0%, #162347 100%)', border: '1px solid rgba(59, 130, 246, 0.1)'}}
        >
          {/* Card Background Effects */}
          <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, #0f1b3c 0%, #162347 100%)'}}></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <div className="relative z-10 text-center">
            {/* LeadQ.AI Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12 flex flex-col items-center"
            >
              {/* Logo Image */}
              <div className="mb-8">
                <img 
                  src={LeadQLogo} 
                  alt="LeadQ.AI Logo" 
                  className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain mx-auto drop-shadow-2xl"
                />
              </div>
              
              {/* AI Lead Intelligence Suite Text */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                AI Lead Intelligence Suite
              </h2>
            </motion.div>

            {/* Start Scanning Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button 
                onClick={() => onNavClick?.('cardscanner')}
                className="group bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-16 py-5 rounded-2xl text-2xl font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center gap-4 mx-auto"
              >
                Start Scanning
                <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Navigation Tabs for Mobile */}
            {onNavClick && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 sm:hidden"
              >
                <NavTabs activeView={activeView || 'home'} onNavClick={onNavClick} />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};