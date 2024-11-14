import React, { useRef, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  XMarkIcon, 
  ClockIcon, 
  Cog6ToothIcon, 
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface MainMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShowHistory: () => void;
  onShowSettings: () => void;
  onShowProfile: () => void;
  onShowTrainerSearch: () => void;
  onLogout: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  isOpen,
  onClose,
  onShowHistory,
  onShowSettings,
  onShowProfile,
  onShowTrainerSearch,
  onLogout
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const menuItems = [
    {
      icon: UserCircleIcon,
      label: 'Mi Perfil',
      onClick: () => {
        onShowProfile();
        onClose();
      },
      color: 'text-teal-400'
    },
    {
      icon: MagnifyingGlassIcon,
      label: 'Buscar Trainer',
      onClick: () => {
        onShowTrainerSearch();
        onClose();
      },
      color: 'text-blue-400'
    },
    {
      icon: ClockIcon,
      label: 'Entrenamientos Guardados',
      onClick: () => {
        onShowHistory();
        onClose();
      },
      color: 'text-purple-400'
    },
    {
      icon: Cog6ToothIcon,
      label: 'Configuración',
      onClick: () => {
        onShowSettings();
        onClose();
      },
      color: 'text-gray-400'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          <motion.div
            ref={overlayRef}
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm cursor-pointer"
          />

          <div className="fixed inset-0">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-gray-800/95 shadow-xl border-r border-gray-700/50 backdrop-blur-sm"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
                      Menú
                    </h2>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-gray-700/70 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6 text-gray-400" />
                    </button>
                  </div>
                </div>

                <nav className="flex-1 px-4 py-6">
                  <div className="space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ x: 8, backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                        onClick={item.onClick}
                        className="flex items-center w-full px-4 py-3 text-gray-300 rounded-xl transition-colors group"
                      >
                        <item.icon className={`h-6 w-6 mr-4 ${item.color} transition-transform group-hover:scale-110`} />
                        <span className="font-medium">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </nav>

                <div className="p-6 border-t border-gray-700/50">
                  <motion.button
                    whileHover={{ x: 8, backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="flex items-center w-full px-4 py-3 text-red-400 rounded-xl transition-colors group"
                  >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-4 transition-transform group-hover:scale-110" />
                    <span className="font-medium">Cerrar Sesión</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};