import React from 'react';
import { CheckCircle2, Circle, Camera, FileText, Calendar, User, Loader2, Mail } from 'lucide-react';
// Local step type for the indicator (keeps this component self-contained)
type CardScanStep = 'landing' | 'capture' | 'processing' | 'result' | 'avatar' | 'selfie' | 'emailDraft' | 'meetingScheduler' | 'confirmation';

interface StepIndicatorProps {
  currentStep: CardScanStep;
}

const steps: Array<{ key: CardScanStep; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'landing', label: 'Start', icon: Circle },
  { key: 'capture', label: 'Capture', icon: Camera },
  { key: 'processing', label: 'Process', icon: Loader2 },
  { key: 'result', label: 'Results', icon: FileText },
  { key: 'avatar', label: 'Avatar', icon: User },
  { key: 'selfie', label: 'Selfie', icon: User },
  { key: 'emailDraft', label: 'Email', icon: Mail },
  { key: 'meetingScheduler', label: 'Schedule', icon: Calendar },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const getStatus = (index: number) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="sticky top-0 z-20 px-2 pt-3 pb-4 sm:px-4 sm:pt-4 sm:pb-5 backdrop-blur-3xl">
      <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-white/5 bg-opacity-10 shadow-[0_10px_45px_rgba(103,49,183,0.45)]">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-1 px-3 sm:px-6 pt-3">
          <div className="flex-1 flex items-center gap-2">
            {steps.map((step, index) => {
              const status = getStatus(index);
              return (
                <div
                  key={step.key}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    status === 'completed'
                      ? 'bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-500 shadow-[0_0_14px_rgba(167,139,250,0.75)]'
                      : status === 'current'
                      ? 'bg-gradient-to-r from-fuchsia-400 via-purple-500 to-indigo-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]'
                      : 'bg-white/15'
                  }`}
                />
              );
            })}
          </div>

          {/* Buttons moved into individual screens per design — StepIndicator remains purely visual */}
        </div>

        <div className="flex items-center justify-between gap-1 px-3 sm:px-6 pb-3 sm:pb-4">
          {steps.map((step, index) => {
            const status = getStatus(index);
            const Icon = status === 'completed' ? CheckCircle2 : step.icon;
            return (
              <div key={step.key} className="flex flex-col items-center flex-1 px-1 group transition-all duration-300 hover:scale-[1.03]">
                <div
                  className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full mb-1.5 sm:mb-2 md:mb-2.5 transition-all duration-300 shadow-lg ${
                    status === 'completed'
                      ? 'bg-white/20 text-cyan-100 backdrop-blur group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]'
                      : status === 'current'
                      ? 'bg-white text-purple-700 ring-2 ring-purple-200 shadow-[0_0_25px_rgba(236,72,153,0.5)]'
                      : 'text-purple-200/80 bg-white/10'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <p
                  className={`text-xs font-medium text-center leading-tight ${
                    status === 'completed'
                      ? 'text-purple-100/90'
                      : status === 'current'
                      ? 'text-white underline decoration-purple-200 decoration-2'
                      : 'text-purple-200/70'
                  }`}
                >
                  {step.label}
                </p>
                {status === 'current' && (
                  <p className="text-[0.7rem] text-purple-50/90 mt-0.5 bg-white/5 px-2 py-1 rounded-full border border-white/10 backdrop-blur">
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
