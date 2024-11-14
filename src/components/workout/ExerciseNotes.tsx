import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface ExerciseNotesProps {
  notes: string;
  theme: string;
}

export const ExerciseNotes: React.FC<ExerciseNotesProps> = ({ notes, theme }) => (
  <div className={`mt-3 p-2 rounded-lg ${
    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
  }`}>
    <div className="flex items-center gap-2 mb-1">
      <DocumentTextIcon className="h-4 w-4 text-gray-400" />
      <span className={`text-sm ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Notas:
      </span>
    </div>
    <p className={`text-sm ${
      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
    }`}>
      {notes}
    </p>
  </div>
);