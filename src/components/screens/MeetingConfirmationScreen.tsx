import { motion } from 'framer-motion';
import { PartyPopper, CheckCircle2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { BackButton } from '../ui/BackButton';

interface MeetingConfirmationScreenProps {
  transactionID: string;
  onDone: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function MeetingConfirmationScreen({ transactionID, onDone, onPrevious, onNext }: MeetingConfirmationScreenProps) {
  return (
  <div className="min-h-screen bg-white flex flex-col items-center pt-1 px-4 sm:px-6 overflow-y-auto pb-6">
      {/* Navigation Buttons - Top */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex items-center justify-between mb-4 pt-20"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
          disabled={!onPrevious}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
            onPrevious
              ? 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 border-2 border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
          }`}
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
              ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full mx-auto"
      >
        <Card className="text-center space-y-3 sm:space-y-4 md:space-y-5 p-4 sm:p-5 md:p-6">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 mb-2 sm:mb-3 md:mb-4"
          >
            <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-400" />
          </motion.div>

          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-500" />
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Meeting Requested</h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 px-2">
              Your meeting request has been successfully processed
            </p>
          </div>

          {/* Transaction ID */}
          <div className="bg-gray-100 rounded-xl p-4 sm:p-5 border border-gray-200 mx-auto max-w-full">
            <p className="text-xs sm:text-sm text-gray-500 mb-2.5 sm:mb-3 text-center">Transaction ID</p>
            <p className="text-xs sm:text-sm text-purple-600 font-mono break-all text-center px-2">{transactionID}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 sm:gap-3 pt-1 sm:pt-2 md:pt-4">
            <Button onClick={onDone} className="flex-1">
              <Calendar className="w-4 h-4" />
              Scan Another Card
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
