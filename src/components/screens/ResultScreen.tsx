import { motion } from 'framer-motion';
import { CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { UserInfo, LLMResponse } from '../../types/cardScanner';

interface ResultScreenProps {
  userInfo: UserInfo;
  llmResponse: LLMResponse | null;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  onScheduleMeeting: () => void;
  onScanAnother: () => void;
}

export function ResultScreen({ 
  userInfo, 
  llmResponse, 
  processingStatus,
  onScheduleMeeting, 
  onScanAnother 
}: ResultScreenProps) {
  const isCompleted = processingStatus === 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-start justify-center pt-28 sm:pt-32 md:pt-36 p-4 sm:p-6 overflow-y-auto pb-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <Card>
          <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 md:p-6">
            {/* Success Header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="flex flex-col items-center text-center space-y-2 sm:space-y-2.5"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500/20">
                <CheckCircle2 className="w-7 h-7 sm:w-9 sm:h-9 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Received Card Details</h2>
                <p className="text-gray-600 mt-0.5 sm:mt-1">Thank you</p>
              </div>
            </motion.div>

            {/* Processing Status */}
            <div className={`rounded-xl p-2 sm:p-2.5 text-center text-xs sm:text-sm font-medium ${
              processingStatus === 'completed' ? 'bg-green-500/10 text-green-400' :
              processingStatus === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
              processingStatus === 'failed' ? 'bg-red-500/10 text-red-400' :
              'bg-blue-500/10 text-blue-400'
            }`}>
              Status: {processingStatus.toUpperCase()}
            </div>

            {/* Extracted Information */}
            <div className="space-y-2 sm:space-y-2.5">
              <p className="text-sm sm:text-base text-gray-600 text-center">Thank you for using our service.</p>
            </div>

            {/* Confidence Score */}
            {llmResponse?.confidence_score !== undefined && (
              <div className="bg-gray-100 rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm text-gray-600">Confidence Score</p>
                  <p className="text-base sm:text-lg font-bold text-green-600">
                    {(llmResponse.confidence_score * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: `${llmResponse.confidence_score * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1 sm:pt-2 justify-center">
              <Button onClick={onScheduleMeeting} className="sm:max-w-[200px] !px-4 !py-2 !text-sm !rounded-lg">
                <Calendar className="w-4 h-4" />
                Schedule Meeting
              </Button>
              <Button variant="secondary" onClick={onScanAnother} className="sm:max-w-[200px] !px-4 !py-2 !text-sm !rounded-lg">
                Scan Another
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
