import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProcessingScreenProps {
  transactionID: string;
}

export function ProcessingScreen({ transactionID }: ProcessingScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 max-h-screen overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full my-4"
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

          <LoadingSpinner size="md" />

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-gray-800">Processing Business Card</h2>
            <p className="text-sm text-gray-600">AI is extracting information...</p>
          </div>

          {/* Transaction ID */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
            <p className="text-xs text-green-600 font-mono break-all">{transactionID}</p>
          </div>

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
