import { motion } from 'framer-motion';
import { XCircle, Lightbulb, RefreshCw } from 'lucide-react';

interface CardRejectionScreenProps {
  validationReason: string;
  suggestions: string[];
  onRetry: () => void;
}

export function CardRejectionScreen({
  validationReason,
  suggestions,
  onRetry,
}: CardRejectionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Error Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
          <h2 className="text-3xl font-bold text-gray-900">Invalid Card</h2>
        </div>

        {/* Validation Reason */}
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-red-800 font-medium">{validationReason}</p>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">Suggestions</h3>
            </div>
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Try Again Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:from-red-700 hover:to-orange-700 transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
