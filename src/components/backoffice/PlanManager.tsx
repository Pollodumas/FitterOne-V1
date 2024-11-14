import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClientPlan } from '../../types/Trainer';
import { useDatabase } from '../../hooks/useDatabase';
import { useAuth } from '../../contexts/AuthContext';
import { PlanDialog } from './PlanDialog';
import { 
  PlusIcon, 
  PencilIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export const PlanManager: React.FC = () => {
  const { userId } = useAuth();
  const [plans, setPlans] = useState<ClientPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ClientPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAllPlans, savePlan } = useDatabase();

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedPlans = await getAllPlans();
      // Filter plans for current trainer
      const trainerPlans = loadedPlans.filter(plan => plan.trainerId === userId);
      setPlans(trainerPlans || []);
    } catch (error) {
      console.error('Error loading plans:', error);
      setError('Error al cargar los planes. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadPlans();
    }
  }, [userId]);

  const handleSavePlan = async (plan: ClientPlan) => {
    try {
      const planToSave = {
        ...plan,
        trainerId: userId || 'trainer-demo'
      };
      await savePlan(planToSave);
      await loadPlans();
      setIsDialogOpen(false);
      setEditingPlan(null);
    } catch (error) {
      console.error('Error saving plan:', error);
      setError('Error al guardar el plan. Por favor, intente nuevamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Cargando planes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={loadPlans}
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
        <h2 className="text-2xl font-bold text-white">Planes de Entrenamiento</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingPlan(null);
            setIsDialogOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Crear Plan
        </motion.button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
              </div>
              <button
                onClick={() => {
                  setEditingPlan(plan);
                  setIsDialogOpen(true);
                }}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-t border-gray-700">
                <span className="text-gray-400">Duración</span>
                <span className="text-white font-medium">{plan.duration} meses</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-700">
                <span className="text-gray-400">Precio mensual</span>
                <span className="text-blue-400 font-semibold">${plan.price}</span>
              </div>
            </div>

            {plan.features && plan.features.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Características:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircleIcon className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <PlanDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        initialPlan={editingPlan}
      />
    </div>
  );
};