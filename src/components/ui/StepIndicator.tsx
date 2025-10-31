import React from 'react';
import { CheckCircle2, Circle, Camera, Cpu, User, FileText, Calendar } from 'lucide-react';

import type { CardScanStep } from '../../types/cardScanner';

type Step = CardScanStep;

interface StepIndicatorProps {
  currentStep: Step;
}

const stepConfig = [
  { key: 'landing', label: 'Start', icon: Circle },
  { key: 'capture', label: 'Capture', icon: Camera },
  { key: 'processing', label: 'Process', icon: Cpu },
  { key: 'selfie', label: 'Selfie', icon: User },
  { key: 'result', label: 'Results', icon: FileText },
  { key: 'meetingScheduler', label: 'Schedule', icon: Calendar },
  { key: 'confirmation', label: 'Done', icon: CheckCircle2 },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const getCurrentStepIndex = () => {
    return stepConfig.findIndex(step => step.key === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  const getStepStatus = (index: number) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-200/50 p-3 sm:p-4 shadow-sm">
      <div className="max-w-6xl mx-auto">
        {/* Progress Lines */}
        <div className="flex items-center justify-between mb-3 gap-1">
          {stepConfig.map((step, index) => {
            const status = getStepStatus(index);
            
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

        {/* Step Labels */}
        <div className="flex items-center justify-between gap-1">
          {stepConfig.map((step, index) => {
            const status = getStepStatus(index);
            const Icon = status === 'completed' ? CheckCircle2 : step.icon;
            
            return (
              <div key={step.key} className="flex flex-col items-center flex-1 px-1">
                {/* Step Icon */}
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

                {/* Step Label */}
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

        {/* Current Step Description */}
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">
            {currentStep === 'landing' && 'Welcome! Ready to scan your business card?'}
            {currentStep === 'capture' && 'Position your business card and take a photo'}
            {currentStep === 'processing' && 'AI is analyzing your business card...'}
            {currentStep === 'selfie' && 'Take a quick selfie to complete your profile'}
            {currentStep === 'result' && 'Review extracted information and schedule meetings'}
            {currentStep === 'meetingScheduler' && 'Schedule a meeting with your new contact'}
            {currentStep === 'confirmation' && 'All done! Meeting request has been sent'}
          </p>
        </div>
      </div>
    </div>
  );
};