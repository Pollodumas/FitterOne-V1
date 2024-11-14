import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface SaveWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  isOverwriting?: boolean;
  onConfirmOverwrite?: () => void;
}

export const SaveWorkoutDialog: React.FC<SaveWorkoutDialogProps> = ({
  isOpen,
  onClose,
  theme,
  isOverwriting = false,
  onConfirmOverwrite
}) => {
  if (isOverwriting) {
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
            className="mx-auto max-w-sm rounded-xl bg-gray-800 p-6 shadow-xl border border-yellow-500/20"
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              >
                <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mb-4" />
              </motion.div>

              <Dialog.Title className="text-xl font-medium text-white mb-2">
                ¡Atención!
              </Dialog.Title>
              
              <p className="text-gray-300 mb-6">
                Ya existe un entrenamiento guardado para este día. ¿Deseas sobrescribirlo?
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (onConfirmOverwrite) onConfirmOverwrite();
                    onClose();
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Sobrescribir
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

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
          className="mx-auto max-w-sm rounded-xl bg-gray-800 p-6 shadow-xl border border-teal-400/20"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ 
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              <CheckCircleIcon className="h-16 w-16 text-teal-400 mb-4" />
            </motion.div>

            <Dialog.Title className="text-xl font-medium text-white mb-2">
              ¡Entrenamiento Guardado!
            </Dialog.Title>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 mb-6"
            >
              Tu progreso ha sido registrado exitosamente.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors font-medium"
            >
              Continuar
            </motion.button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};