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
      className={`bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200 ${className}`}
    >
      {children}
    </motion.div>
  );
}
