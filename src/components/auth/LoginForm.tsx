import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

interface LoginFormProps {
  isTrainer: boolean;
  onBack: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isTrainer, onBack }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setError('');
    setLoading(true);

    try {
      const success = await login(formData.email, formData.password, isTrainer ? 'trainer' : 'client');
      if (!success) {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      // Only set loading to false if we're not redirecting
      if (document.body.contains(e.target as Node)) {
        setLoading(false);
      }
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
            {isTrainer ? 'Acceso Trainer' : 'Acceso Cliente'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <div className="mt-1 relative">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                className={`appearance-none block w-full px-10 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}-500`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                required
                className={`appearance-none block w-full px-10 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}-500`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};