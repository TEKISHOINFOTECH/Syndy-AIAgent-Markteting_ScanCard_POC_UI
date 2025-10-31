import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', isVisible, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />
  };

  const colors = {
    success: 'bg-green-500/90 border-green-400/30 text-white',
    error: 'bg-red-500/90 border-red-400/30 text-white',
    info: 'bg-blue-500/90 border-blue-400/30 text-white'
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`fixed top-36 sm:top-40 md:top-44 right-4 z-[9999] ${colors[type]} backdrop-blur-xl px-4 py-2.5 rounded-xl shadow-lg border flex items-center gap-2 max-w-xs text-sm pointer-events-auto`}
          style={{ isolation: 'isolate' }}
        >
          {icons[type]}
          <span className="flex-1 font-medium text-sm">{message}</span>
          <button
            onClick={onClose}
            className="p-0.5 hover:bg-white/20 rounded transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
