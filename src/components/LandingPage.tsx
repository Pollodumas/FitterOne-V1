import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  UserIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface LandingPageProps {
  onClientLogin: () => void;
  onTrainerLogin: () => void;
  onClientRegister: () => void;
  onTrainerRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onClientLogin,
  onTrainerLogin,
  onClientRegister,
  onTrainerRegister
}) => {
  return (
    <div className="min-h-screen bg-gray-900 flex relative overflow-hidden">
      {/* Client Side */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 flex items-center justify-center relative overflow-hidden border-r border-gray-800"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/50 to-transparent" />
        <div className="relative z-10 text-center p-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <UserIcon className="h-16 w-16 text-teal-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Acceso Clientes</h2>
            <p className="text-gray-300 mb-8">Accede a tus rutinas personalizadas</p>

            <div className="space-y-4">
              <motion.button
                onClick={onClientLogin}
                className="group relative inline-flex w-full items-center justify-center px-8 py-4 text-lg font-medium text-white bg-teal-600 rounded-lg overflow-hidden transition-all duration-300 ease-out hover:bg-teal-500 shadow-lg shadow-teal-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center">
                  INGRESAR
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                onClick={onClientRegister}
                className="group relative inline-flex w-full items-center justify-center px-6 py-3 text-sm font-medium text-teal-400 bg-transparent border border-teal-400/20 rounded-lg overflow-hidden transition-all duration-300 ease-out hover:border-teal-400/40 hover:text-teal-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">¿No tienes cuenta? Regístrate aquí</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Trainer Side */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/50 to-transparent" />
        <div className="relative z-10 text-center p-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <UserGroupIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Panel de Trainers</h2>
            <p className="text-gray-300 mb-8">Gestiona tus clientes y rutinas</p>

            <div className="space-y-4">
              <motion.button
                onClick={onTrainerLogin}
                className="group relative inline-flex w-full items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg overflow-hidden transition-all duration-300 ease-out hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center">
                  INGRESAR
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                onClick={onTrainerRegister}
                className="group relative inline-flex w-full items-center justify-center px-6 py-3 text-sm font-medium text-blue-400 bg-transparent border border-blue-400/20 rounded-lg overflow-hidden transition-all duration-300 ease-out hover:border-blue-400/40 hover:text-blue-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">¿No tienes cuenta? Regístrate aquí</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};