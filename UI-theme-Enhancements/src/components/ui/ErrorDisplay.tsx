import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  title?: string;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  title = 'Something went wrong',
  type = 'error'
}) => {
  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-yellow-500/20 border-yellow-500/50',
          icon: 'text-yellow-400',
          title: 'text-yellow-300',
          text: 'text-yellow-200'
        };
      case 'info':
        return {
          container: 'bg-blue-500/20 border-blue-500/50',
          icon: 'text-blue-400',
          title: 'text-blue-300',
          text: 'text-blue-200'
        };
      default:
        return {
          container: 'bg-red-500/20 border-red-500/50',
          icon: 'text-red-400',
          title: 'text-red-300',
          text: 'text-red-200'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`rounded-xl border p-4 ${styles.container}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.icon}`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-medium ${styles.title}`}>{title}</h4>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={`p-1 hover:bg-black/20 rounded ${styles.icon} transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <p className={`text-sm ${styles.text}`}>{error}</p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors`}
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};