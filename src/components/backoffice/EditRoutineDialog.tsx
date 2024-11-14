import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { PlusIcon, XMarkIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { DailyRoutine, Exercise } from "../../types/Trainer";
import { v4 as uuidv4 } from 'uuid';

interface EditRoutineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: DailyRoutine) => void;
  initialRoutine: DailyRoutine | null;
}

export const EditRoutineDialog: React.FC<EditRoutineDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRoutine,
}) => {
  const [routine, setRoutine] = useState<DailyRoutine>({
    id: '',
    day: '',
    title: '',
    exercises: [],
    description: ''
  });

  useEffect(() => {
    if (initialRoutine) {
      setRoutine(initialRoutine);
    }
  }, [initialRoutine]);

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: uuidv4(),
      name: '',
      series: 3,
      reps: '12',
      pause: '60',
      weight: 0,
      videoUrl: '',
      notes: ''
    };

    setRoutine(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: any) => {
    setRoutine(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const handleRemoveExercise = (index: number) => {
    setRoutine(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(routine);
  };

  const handlePreviewVideo = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
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
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-gray-800 rounded-xl shadow-xl max-h-[90vh] flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-white">
                Editar Rutina - {routine.day}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título de la Rutina
                </label>
                <input
                  type="text"
                  value={routine.title}
                  onChange={(e) => setRoutine(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
                  placeholder="Ej: Rutina de Pecho y Hombros"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={routine.description}
                  onChange={(e) => setRoutine(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  placeholder="Agrega notas o instrucciones especiales..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Ejercicios</h3>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="flex items-center px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Agregar Ejercicio
                  </button>
                </div>

                <div className="space-y-6">
                  {routine.exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-700 p-6 rounded-lg"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Nombre del Ejercicio
                          </label>
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Series
                            </label>
                            <input
                              type="number"
                              value={exercise.series}
                              onChange={(e) => handleExerciseChange(index, 'series', parseInt(e.target.value))}
                              className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Reps
                            </label>
                            <input
                              type="text"
                              value={exercise.reps}
                              onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                              className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Pausa (seg)
                            </label>
                            <input
                              type="text"
                              value={exercise.pause}
                              onChange={(e) => handleExerciseChange(index, 'pause', e.target.value)}
                              className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Video URL (opcional)
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="url"
                              value={exercise.videoUrl || ''}
                              onChange={(e) => handleExerciseChange(index, 'videoUrl', e.target.value)}
                              className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                              placeholder="https://youtube.com/..."
                            />
                            {exercise.videoUrl && (
                              <button
                                type="button"
                                onClick={() => handlePreviewVideo(exercise.videoUrl || '')}
                                className="p-2 text-teal-400 hover:text-teal-300 transition-colors"
                                title="Ver video"
                              >
                                <PlayCircleIcon className="h-6 w-6" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Notas (opcional)
                          </label>
                          <textarea
                            value={exercise.notes || ''}
                            onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                            rows={2}
                            placeholder="Agrega notas o instrucciones específicas..."
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(index)}
                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                          >
                            Eliminar ejercicio
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </form>

          <div className="p-6 border-t border-gray-700">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
              >
                Guardar Rutina
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};