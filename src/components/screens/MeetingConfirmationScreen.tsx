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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="text-center space-y-5 sm:space-y-6">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-3 sm:mb-4"
          >
            <PartyPopper className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
          </motion.div>

          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Meeting Invitation Sent!</h2>
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
          <div className="flex gap-2.5 sm:gap-3 pt-2 sm:pt-4">
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
