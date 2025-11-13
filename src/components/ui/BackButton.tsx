import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className = '' }: BackButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`block lg:hidden fixed bottom-6 left-4 sm:bottom-8 sm:left-6 z-50 p-3 sm:p-3.5 bg-slate-800/60 backdrop-blur-2xl border border-slate-600/40 rounded-full shadow-2xl hover:bg-slate-700/70 hover:shadow-blue-500/20 transition-all text-gray-300 hover:text-white ${className}`}
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
    </motion.button>
  );
}

