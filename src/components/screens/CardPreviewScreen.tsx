import { motion } from 'framer-motion';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';

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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8">
        {/* Success Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <CheckCircle className="w-10 h-10 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">Card Detected!</h2>
        </div>

  <p className="text-center text-gray-600 mb-8">{detectionMessage}</p>

        {/* Cropped Card Preview */}
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-purple-300">
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
            <span className="text-sm font-bold text-purple-600">{confidencePercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-400 to-violet-600"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="flex-1 py-4 rounded-xl border-2 border-white/10 text-gray-700 font-semibold hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-700 hover:to-violet-700 transition-colors shadow-lg"
          >
            Confirm & Process
          </motion.button>
        </div>
        </Card>
      </motion.div>
    </div>
  );
}
