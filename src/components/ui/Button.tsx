import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white shadow-lg',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-gray-200 border border-slate-600',
    ghost: 'bg-transparent hover:bg-slate-700/50 text-gray-300'
  } as const;
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
    md: 'px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base',
    lg: 'px-5 py-1.5 text-base sm:px-8 sm:py-2 sm:text-lg'
  } as const;

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
