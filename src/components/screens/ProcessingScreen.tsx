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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center pt-1 px-4 sm:px-6 overflow-y-auto pb-6 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full flex flex-col items-center justify-center"
      >
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 w-full"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrevious}
            disabled={!onPrevious}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              onPrevious
                ? 'text-white border-2 shadow-sm hover:shadow-md'
                : 'text-gray-500 cursor-not-allowed border-2'
            }`}
            style={onPrevious ? {
              background: 'rgba(22, 35, 71, 0.8)', 
              borderColor: 'rgba(59, 130, 246, 0.3)'
            } : {
              background: 'rgba(22, 35, 71, 0.3)', 
              borderColor: 'rgba(100, 116, 139, 0.3)'
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            disabled={!onNext}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              onNext
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
                : 'text-gray-500 cursor-not-allowed'
            }`}
            style={!onNext ? {background: 'rgba(22, 35, 71, 0.3)'} : {}}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

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
            <div className="backdrop-blur-sm rounded-xl p-3 border" style={{background: 'rgba(22, 35, 71, 0.8)', borderColor: 'rgba(59, 130, 246, 0.3)'}}>
              <p className="text-xs text-gray-300 mb-1">Transaction ID</p>
              <p className="text-xs text-green-400 font-mono break-all">{transactionID}</p>
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

