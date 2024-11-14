import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Client } from '../../types/Client';
import { AddClientDialog } from './AddClientDialog';
import { useAuth } from '../../contexts/AuthContext';
import { database } from '../../services/database';
import { 
  UserPlusIcon, 
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface ClientListProps {
  onClientSelect: (client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ onClientSelect }) => {
  const { userId } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const loadedClients = await database.getClientsByTrainer(userId);
      setClients(loadedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      setError('Error al cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [userId]);

  const handleAddClient = async (newClient: Client) => {
    try {
      await database.saveClient({
        ...newClient,
        trainer: userId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await loadClients();
      setIsAddClientDialogOpen(false);
    } catch (error) {
      console.error('Error adding client:', error);
      throw new Error('Error al agregar cliente');
    }
  };

  const handleUpdateClientStatus = async (clientId: string, status: 'active' | 'inactive') => {
    try {
      await database.updateClientStatus(clientId, status);
      await loadClients();
    } catch (error) {
      console.error('Error updating client status:', error);
      setError('Error al actualizar el estado del cliente');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={loadClients}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Mis Clientes</h2>
        <button
          onClick={() => setIsAddClientDialogOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Agregar Cliente
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-12">
          <UserCircleIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No tienes clientes aún</p>
          <button
            onClick={() => setIsAddClientDialogOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Agregar tu primer cliente
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center mb-4">
                {client.profile.photoUrl ? (
                  <img
                    src={client.profile.photoUrl}
                    alt={client.profile.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xl text-gray-400">
                      {client.profile.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">
                    {client.profile.name}
                  </h3>
                  <p className="text-sm text-gray-400">{client.profile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Peso</p>
                  <p className="text-white font-medium">
                    {client.profile.weight} kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Altura</p>
                  <p className="text-white font-medium">
                    {client.profile.height} cm
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {client.objectives?.map((objective, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                  >
                    {objective}
                  </span>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => onClientSelect(client)}
                  className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
                >
                  <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
                  Rutinas
                </button>
                <button
                  onClick={() => onClientSelect(client)}
                  className="flex items-center px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors text-sm"
                >
                  <ChartBarIcon className="h-4 w-4 mr-1" />
                  Progreso
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddClientDialog
        isOpen={isAddClientDialogOpen}
        onClose={() => setIsAddClientDialogOpen(false)}
        onSave={handleAddClient}
        trainerId={userId || ''}
        theme="dark"
      />
    </div>
  );
};