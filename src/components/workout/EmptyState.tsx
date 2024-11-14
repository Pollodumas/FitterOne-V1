import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  theme: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`text-center py-8 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}
    >
      No hay ejercicios programados para este día
    </motion.div>
  );
};