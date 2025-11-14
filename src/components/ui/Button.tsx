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
    primary: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg backdrop-blur-sm border border-white/10',
    secondary: 'bg-white/10 backdrop-blur-sm border border-white/20 text-purple-600 hover:bg-white/20',
    ghost: 'bg-transparent hover:bg-white/5 text-purple-600'
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
      } focus:outline-none focus:ring-2 focus:ring-purple-200`}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
      {children}
    </motion.button>
  );
}
