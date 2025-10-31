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
      className={`block lg:hidden fixed bottom-6 left-4 sm:bottom-8 sm:left-6 z-50 p-3 sm:p-3.5 bg-white/20 backdrop-blur-2xl border border-white/40 rounded-full shadow-2xl hover:bg-white/30 hover:shadow-green-200/50 transition-all ${className}`}
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

