import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  startDay: string;
  onStartDayChange: (day: string) => void;
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  startDay,
  onStartDayChange,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-xl bg-gray-800 p-6 shadow-xl border border-teal-400/20">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-medium text-white">
              Configuración
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Día de inicio de semana
              </label>
              <select
                value={startDay}
                onChange={(e) => onStartDayChange(e.target.value)}
                className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};