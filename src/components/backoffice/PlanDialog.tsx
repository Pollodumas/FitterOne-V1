import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { ClientPlan } from '../../types/Trainer';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';

interface PlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: ClientPlan) => void;
  initialPlan: ClientPlan | null;
}

export const PlanDialog: React.FC<PlanDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlan
}) => {
  const [plan, setPlan] = useState<ClientPlan>({
    id: '',
    trainerId: '',
    name: '',
    description: '',
    duration: 1,
    price: 0,
    features: []
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialPlan) {
        setPlan(initialPlan);
      } else {
        setPlan({
          id: uuidv4(),
          trainerId: '',
          name: '',
          description: '',
          duration: 1,
          price: 0,
          features: []
        });
      }
    }
  }, [initialPlan, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(plan);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setPlan({
        ...plan,
        features: [...plan.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setPlan({
      ...plan,
      features: plan.features.filter((_, i) => i !== index)
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold text-white">
              {initialPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Nombre del Plan *
              </label>
              <input
                type="text"
                required
                value={plan.name}
                onChange={(e) => setPlan({ ...plan, name: e.target.value })}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Plan Premium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Descripción
              </label>
              <textarea
                value={plan.description}
                onChange={(e) => setPlan({ ...plan, description: e.target.value })}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Describe el plan..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Duración (meses) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={plan.duration}
                  onChange={(e) => setPlan({ ...plan, duration: parseInt(e.target.value) || 1 })}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Precio (por mes) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={plan.price}
                  onChange={(e) => setPlan({ ...plan, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Características del Plan
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Agregar característica..."
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg"
                  >
                    <span className="text-gray-200">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                {initialPlan ? 'Guardar Cambios' : 'Crear Plan'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};