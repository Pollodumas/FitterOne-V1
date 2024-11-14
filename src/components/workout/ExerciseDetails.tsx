import React from 'react';
import { Exercise } from '../../types/Exercise';

interface ExerciseDetailsProps {
  exercise: Exercise;
  theme: string;
}

export const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({ exercise, theme }) => (
  <div className={`grid grid-cols-2 gap-4 mt-2 ${
    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  }`}>
    <DetailItem
      label="Series"
      value={exercise.series.toString()}
      theme={theme}
    />
    <DetailItem
      label="Repeticiones"
      value={exercise.reps}
      theme={theme}
    />
    <DetailItem
      label="Descanso"
      value={`${exercise.pause}s`}
      theme={theme}
    />
    <DetailItem
      label="Peso"
      value={`${exercise.weight > 0 ? exercise.weight : '-'} kg`}
      theme={theme}
    />
  </div>
);

interface DetailItemProps {
  label: string;
  value: string;
  theme: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, theme }) => (
  <div>
    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);