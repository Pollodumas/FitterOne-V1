import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';

interface EditTitleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  currentTitle: string;
  theme: string;
}

export const EditTitleDialog: React.FC<EditTitleDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentTitle,
  theme
}) => {
  const [title, setTitle] = useState(currentTitle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          as={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-md transform overflow-hidden rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-6 text-left align-middle shadow-xl transition-all`}
        >
          <Dialog.Title
            as="h3"
            className={`text-lg font-medium leading-6 mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Editar Título de Rutina
          </Dialog.Title>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } mb-4`}
              placeholder="Introduce el título de la rutina"
            />

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 transition-colors duration-200"
              >
                Guardar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};