import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../contexts/AuthContext';
import { Trainer } from '../types/Trainer';

interface TrainerSearchDialogProps {
  onBack: () => void;
  theme: string;
}

export const TrainerSearchDialog: React.FC<TrainerSearchDialogProps> = ({
  onBack,
  theme
}) => {
  const { userId } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [showPlans, setShowPlans] = useState(false);
  const { searchTrainers, getPlansByTrainer, getClientByEmail, updateClient } = useDatabase();

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const results = await searchTrainers('');
        setSearchResults(results);
      } catch (error) {
        console.error('Error loading trainers:', error);
        setSearchResults([]);
      }
    };
    loadTrainers();
  }, []);

  const handleSearch = async () => {
    try {
      const results = await searchTrainers(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching trainers:', error);
      setSearchResults([]);
    }
  };

  const handleTrainerSelect = async (trainer: Trainer) => {
    try {
      const plans = await getPlansByTrainer(trainer.id);
      setSelectedTrainer({
        ...trainer,
        plans: plans
      });
      setShowPlans(true);
    } catch (error) {
      console.error('Error loading trainer plans:', error);
      alert('Error al cargar los planes del trainer. Por favor, intente nuevamente.');
    }
  };

  const handlePlanSelect = async (planId: string) => {
    if (!selectedTrainer || !userId) return;
    
    try {
      const client = await getClientByEmail(userId);
      if (!client) {
        throw new Error('Cliente no encontrado');
      }

      // Update client with trainer and plan info
      const updatedClient = {
        ...client,
        trainer: {
          id: selectedTrainer.id,
          status: 'pending',
          planId: planId
        },
        status: 'new',
        updatedAt: new Date().toISOString()
      };

      await updateClient(updatedClient);
      alert('Solicitud enviada al trainer. Te notificaremos cuando acepte.');
      onBack();
    } catch (error) {
      console.error('Error al solicitar trainer:', error);
      alert('Error al enviar la solicitud. Por favor intenta nuevamente.');
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-400 hover:text-white" />
        </button>
        <h2 className="text-2xl font-bold text-white">
          {showPlans ? 'Planes Disponibles' : 'Buscar Trainer'}
        </h2>
      </div>

      {!showPlans ? (
        <>
          <div className="flex space-x-4 mb-8">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar por nombre o especialidad..."
                className="w-full bg-gray-700 border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-teal-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
            >
              Buscar
            </button>
          </div>

          <div className="space-y-4">
            {searchResults.map((trainer) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {trainer.photoUrl ? (
                      <img
                        src={trainer.photoUrl}
                        alt={trainer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-2xl text-gray-400">
                          {trainer.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {trainer.name}
                      </h3>
                      <p className="text-teal-400 mt-1">{trainer.specialty}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center text-yellow-400">
                          <StarIcon className="h-5 w-5" />
                          <span className="ml-1">{trainer.rating}</span>
                        </div>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-gray-400">
                          {trainer.clients} clientes activos
                        </span>
                      </div>
                      {trainer.bio && (
                        <p className="mt-3 text-gray-300 text-sm">{trainer.bio}</p>
                      )}
                      {trainer.certifications && trainer.certifications.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-400 mb-2">Certificaciones:</p>
                          <div className="flex flex-wrap gap-2">
                            {trainer.certifications.map((cert, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleTrainerSelect(trainer)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
                  >
                    Ver Planes
                  </button>
                </div>
              </motion.div>
            ))}

            {searchResults.length === 0 && searchTerm && (
              <div className="text-center py-8 text-gray-400">
                No se encontraron trainers que coincidan con tu búsqueda
              </div>
            )}
          </div>
        </>
      ) : selectedTrainer && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4">
              {selectedTrainer.photoUrl ? (
                <img
                  src={selectedTrainer.photoUrl}
                  alt={selectedTrainer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">
                    {selectedTrainer.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {selectedTrainer.name}
                </h3>
                <p className="text-gray-400">{selectedTrainer.specialty}</p>
              </div>
            </div>
          </div>

          {selectedTrainer.plans && selectedTrainer.plans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {selectedTrainer.plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-6 flex flex-col"
                >
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {plan.name}
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Duración</span>
                    <span className="text-white font-medium">
                      {plan.duration} meses
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">Precio mensual</span>
                    <span className="text-teal-400 font-semibold">
                      ${plan.price}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-teal-400 mr-2">•</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors mt-auto"
                  >
                    Solicitar Plan
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              Este trainer aún no tiene planes disponibles
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowPlans(false)}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Volver a la búsqueda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};