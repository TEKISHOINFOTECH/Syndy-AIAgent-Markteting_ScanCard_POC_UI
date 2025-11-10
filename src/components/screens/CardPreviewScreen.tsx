import { motion } from 'framer-motion';
import { CheckCircle, RefreshCw } from 'lucide-react';

interface CardPreviewScreenProps {
  croppedImagePreview: string; // base64 image
  confidence: number; // 0-1
  detectionMessage: string;
  onConfirm: () => void;
  onRetry: () => void;
}

export function CardPreviewScreen({
  croppedImagePreview,
  confidence,
  detectionMessage,
  onConfirm,
  onRetry,
}: CardPreviewScreenProps) {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Success Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
          <h2 className="text-3xl font-bold text-gray-900">Card Detected!</h2>
        </div>

        <p className="text-center text-gray-600 mb-8">{detectionMessage}</p>

        {/* Cropped Card Preview */}
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-green-400">
            <img
              src={croppedImagePreview}
              alt="Detected business card"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Detection Confidence</span>
            <span className="text-sm font-bold text-green-600">{confidencePercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-400 to-green-600"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="flex-1 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-lg"
          >
            Confirm & Process
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
