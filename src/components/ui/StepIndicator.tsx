import React from 'react';
import { CheckCircle2, Circle, Camera, FileText, Calendar } from 'lucide-react';
import type { CardScanStep } from '../../types/cardScanner';

interface StepIndicatorProps {
  currentStep: CardScanStep;
}

const steps: Array<{ key: CardScanStep; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'landing', label: 'Start', icon: Circle },
  { key: 'capture', label: 'Capture', icon: Camera },
  { key: 'result', label: 'Results', icon: FileText },
  { key: 'meetingScheduler', label: 'Schedule', icon: Calendar },
  { key: 'confirmation', label: 'Done', icon: CheckCircle2 },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const getStatus = (index: number) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-green-200/50 p-3 sm:p-4 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3 gap-1">
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
                  className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full mb-1 transition-all duration-300 ${
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
                      ? 'text-green-700'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
