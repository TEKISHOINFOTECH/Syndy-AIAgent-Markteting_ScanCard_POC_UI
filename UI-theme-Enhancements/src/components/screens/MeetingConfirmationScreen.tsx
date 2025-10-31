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
    <div className="flex-1 flex items-center justify-center p-4 max-h-screen overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full my-4"
      >
        <Card className="text-center space-y-4 h-auto p-4">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-4"
          >
            <PartyPopper className="w-12 h-12 text-green-500" />
          </motion.div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <h2 className="text-3xl font-bold text-gray-800">Meeting Invitation Sent!</h2>
            </div>
            <p className="text-gray-600">
              Your meeting request has been successfully processed
            </p>
          </div>

          {/* Transaction ID */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 mb-2">Transaction ID</p>
            <p className="text-sm text-green-600 font-mono break-all">{transactionID}</p>
          </div>

          {/* Confetti Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, times: [0, 0.5, 1] }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: '50%',
                  y: '50%',
                  scale: 0
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05
                }}
                className={`absolute w-2 h-2 rounded-full ${
                  ['bg-green-500', 'bg-emerald-500', 'bg-green-400', 'bg-emerald-400'][i % 4]
                }`}
              />
            ))}
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
