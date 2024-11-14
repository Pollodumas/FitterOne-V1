import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface CompletedWorkoutsProps {
  completedWorkouts: Array<{
    day: string;
    title: string;
    datetime: string;
    exercises: Array<{
      name: string;
      series: number;
      reps: string;
      pause: string;
      weight: number;
    }>;
  }>;
  onBack: () => void;
}

export const CompletedWorkouts: React.FC<CompletedWorkoutsProps> = ({
  completedWorkouts,
  onBack,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return format(date, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha no disponible';
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-400 hover:text-gray-300" />
        </button>
        <h2 className="text-2xl font-bold text-teal-400">
          Entrenamientos Guardados
        </h2>
      </div>

      <div className="space-y-6">
        {completedWorkouts.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-8"
          >
            No hay entrenamientos guardados
          </motion.p>
        ) : (
          completedWorkouts.map((workout, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {workout.day} - {workout.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {formatDate(workout.datetime)}
                </p>
              </div>

              <div className="space-y-3">
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className="bg-gray-700 rounded p-3"
                  >
                    <h4 className="font-medium text-white mb-1">
                      {exercise.name}
                    </h4>
                    <div className="text-sm text-gray-300">
                      <p>Series: {exercise.series}</p>
                      <p>Repeticiones: {exercise.reps}</p>
                      <p>Descanso: {exercise.pause}s</p>
                      <p>Peso: {exercise.weight}kg</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};