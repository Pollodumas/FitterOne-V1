import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ExerciseActionsProps {
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  theme: string;
}

export const ExerciseActions: React.FC<ExerciseActionsProps> = ({
  index,
  onEdit,
  onDelete,
  theme
}) => (
  <div className="flex space-x-2">
    <ActionButton
      onClick={() => onEdit(index)}
      icon={PencilIcon}
      theme={theme}
      hoverColor="teal"
    />
    <ActionButton
      onClick={() => onDelete(index)}
      icon={TrashIcon}
      theme={theme}
      hoverColor="red"
    />
  </div>
);

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  theme: string;
  hoverColor: 'teal' | 'red';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon: Icon,
  theme,
  hoverColor
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors duration-200 ${
      theme === 'dark'
        ? `text-gray-400 hover:text-${hoverColor}-400 hover:bg-gray-700`
        : `text-gray-500 hover:text-${hoverColor}-600 hover:bg-gray-100`
    }`}
  >
    <Icon className="h-5 w-5" />
  </button>
);