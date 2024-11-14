import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UserIcon,
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

interface RegisterFormProps {
  isTrainer: boolean;
  onBack: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ isTrainer, onBack }) => {
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Remove the useEffect hook as we'll handle state in the AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');

    if (!formData.email || !formData.password || !formData.name) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        isTrainer ? 'trainer' : 'client'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el usuario');
      setLoading(false);
    }
  };

  const accentColor = isTrainer ? 'blue' : 'teal';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-xl">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack} 
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold text-white ml-4">
            {isTrainer ? 'Registro Trainer' : 'Registro Cliente'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nombre</label>
            <div className="mt-1 relative">
              <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`appearance-none block w-full px-10 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}-500`}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <div className="mt-1 relative">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`appearance-none block w-full px-10 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}-500`}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Contraseña</label>
            <div className="mt-1 relative">
              <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`appearance-none block w-full px-10 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}-500`}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Confirmar Contraseña</label>
            <div className="mt-1 relative">
              <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`appearance-none block w-full px-10 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}-500`}
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md bg-${accentColor}-600 text-white font-medium hover:bg-${accentColor}-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                'Registrarse'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};