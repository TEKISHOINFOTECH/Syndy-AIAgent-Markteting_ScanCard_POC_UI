import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 p-4 sm:p-5 md:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
