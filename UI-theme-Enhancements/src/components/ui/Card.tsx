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
      className={`bg-white/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-green-100/50 p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
