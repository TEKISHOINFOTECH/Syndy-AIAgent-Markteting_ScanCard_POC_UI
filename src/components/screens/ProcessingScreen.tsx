import { motion } from 'framer-motion';
import { CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProcessingScreenProps {
  transactionID?: string | null;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function ProcessingScreen({ transactionID, onPrevious, onNext }: ProcessingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col items-center justify-center pt-1 px-4 sm:px-6 overflow-y-auto pb-6 relative">
      {/* Navigation Buttons */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 max-w-6xl mx-auto">
        <button
          onClick={onPrevious}
          disabled={!onPrevious}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            onPrevious
              ? 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 border border-gray-300 hover:border-green-300 shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Previous Step"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <button
          onClick={onNext}
          disabled={!onNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            onNext
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Next Step"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full flex flex-col items-center justify-center"
      >
        <Card className="text-center space-y-4 h-auto p-4">
          {/* Animated Card Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-4"
          >
            <CreditCard className="w-10 h-10 text-green-600" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">Processing Business Card</h2>
            <p className="text-sm text-gray-600">AI is extracting information...</p>
          </div>

          {/* Loading Spinner - Centered */}
          <div className="flex justify-center py-4">
            <LoadingSpinner size="md" />
          </div>

          {/* Transaction ID */}
          {transactionID && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
              <p className="text-xs text-green-600 font-mono break-all">{transactionID}</p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

