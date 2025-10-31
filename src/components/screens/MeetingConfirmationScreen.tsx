import { motion } from 'framer-motion';
import { PartyPopper, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface MeetingConfirmationScreenProps {
  transactionID: string;
  onDone: () => void;
}

export function MeetingConfirmationScreen({ transactionID, onDone }: MeetingConfirmationScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-start justify-center pt-24 sm:pt-28 md:pt-32 md:items-center md:pt-0 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="text-center space-y-3 sm:space-y-4 md:space-y-6">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-2 sm:mb-3 md:mb-4"
          >
            <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-400" />
          </motion.div>

          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Meeting Request Received</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Your meeting request has been successfully processed
            </p>
          </div>

          {/* Transaction ID */}
          <div className="bg-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Transaction ID</p>
            <p className="text-xs sm:text-sm text-green-600 font-mono break-all">{transactionID}</p>
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
