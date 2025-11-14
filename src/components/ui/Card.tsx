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
      className={`bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/10 ${className}`}
      style={{ WebkitBackdropFilter: 'blur(12px) saturate(140%)', backdropFilter: 'blur(12px) saturate(140%)' }}
    >
      {children}
    </motion.div>
  );
}
