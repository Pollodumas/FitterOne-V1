import React from 'react';
import { Exercise } from '../types/Exercise';
import { PencilIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface ExerciseListProps {
  exercises: Exercise[];
  onEditExercise: (index: number) => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onEditExercise }) => {
  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800 p-4 rounded-lg shadow-lg border border-teal-400/20 hover:border-teal-400/40 transition-colors duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
              <div className="text-sm text-gray-400 mt-1">
                <p>Series: {exercise.series} | Repeticiones: {exercise.reps}</p>
                <p>Descanso: {exercise.pause}s | Peso: {exercise.weight}kg</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEditExercise(index)}
              className="p-2 text-teal-400 hover:text-teal-300 transition-colors duration-200"
            >
              <PencilIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      ))}
      {exercises.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No hay ejercicios para este día
        </div>
      )}
    </div>
  );
}