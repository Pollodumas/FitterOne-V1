import React from 'react';
import { motion } from 'framer-motion';
import { useConfig } from '../contexts/ConfigContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { theme, setTheme } = useConfig();

  const themes = [
    { value: 'system', label: 'Sistema' },
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4"
    >
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-white">Configuración</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Tema</h3>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
          >
            {themes.map((themeOption) => (
              <option key={themeOption.value} value={themeOption.value} className="text-white bg-gray-700">
                {themeOption.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
};