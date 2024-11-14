import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircleIcon } from '@heroicons/react/24/outline';
import { Exercise } from '../../types/Exercise';
import { ExerciseDetails } from './ExerciseDetails';
import { ExerciseNotes } from './ExerciseNotes';
import { ExerciseActions } from './ExerciseActions';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  theme: string;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  theme,
  onEdit,
  onDelete
}) => {
  const handleVideoClick = (videoUrl?: string) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-lg p-4 shadow-lg border ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {exercise.name}
            </h3>
            {exercise.videoUrl && exercise.videoUrl.trim() !== '' && (
              <button
                onClick={() => handleVideoClick(exercise.videoUrl)}
                className={`p-1 rounded-full hover:bg-opacity-80 transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-teal-400 hover:bg-gray-700'
                    : 'text-teal-600 hover:bg-gray-100'
                }`}
                title="Ver video del ejercicio"
              >
                <PlayCircleIcon className="h-6 w-6" />
              </button>
            )}
          </div>
          <ExerciseDetails exercise={exercise} theme={theme} />
          {exercise.notes && (
            <ExerciseNotes notes={exercise.notes} theme={theme} />
          )}
        </div>
        <ExerciseActions
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          theme={theme}
        />
      </div>
    </motion.div>
  );
};