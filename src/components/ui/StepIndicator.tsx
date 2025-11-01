import React from 'react';
import { CheckCircle2, Circle, Camera, FileText, Calendar, User, Clock, Loader2, Mail } from 'lucide-react';
import type { CardScanStep } from '../../types/cardScanner';

interface StepIndicatorProps {
  currentStep: CardScanStep;
}

const steps: Array<{ key: CardScanStep; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'landing', label: 'Start', icon: Circle },
  { key: 'capture', label: 'Capture', icon: Camera },
  { key: 'processing', label: 'Process', icon: Loader2 },
  { key: 'result', label: 'Results', icon: FileText },
  { key: 'selfie', label: 'Selfie', icon: User },
  { key: 'emailDraft', label: 'Email', icon: Mail },
  { key: 'meetingScheduler', label: 'Schedule', icon: Calendar },
  { key: 'confirmation', label: 'Done', icon: Clock },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const getStatus = (index: number) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-green-200/50 px-2 pt-2 pb-2 sm:px-3 sm:pt-3 sm:pb-3 md:px-4 md:pt-4 md:pb-4 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4 gap-1">
          {steps.map((step, index) => {
            const status = getStatus(index);
            return (
              <div
                key={step.key}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  status === 'completed'
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : status === 'current'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gray-200'
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-1">
          {steps.map((step, index) => {
            const status = getStatus(index);
            const Icon = status === 'completed' ? CheckCircle2 : step.icon;
            return (
              <div key={step.key} className="flex flex-col items-center flex-1 px-1">
                <div
                  className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full mb-1.5 sm:mb-2 md:mb-2.5 transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : status === 'current'
                      ? 'bg-green-50 text-green-700 ring-2 ring-green-200'
                      : 'text-gray-400'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <p
                  className={`text-xs font-medium text-center leading-tight ${
                    status === 'completed'
                      ? 'text-green-600'
                      : status === 'current'
                      ? 'text-green-700 underline decoration-green-600 decoration-2'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {status === 'current' && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {step.key === 'result' ? 'Review extracted information' :
                     step.key === 'emailDraft' ? 'Edit your email draft' :
                     step.key === 'selfie' ? 'Take a selfie' :
                     step.key === 'meetingScheduler' ? 'Schedule a meeting' :
                     step.key === 'processing' ? 'Processing your card' :
                     ''}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
