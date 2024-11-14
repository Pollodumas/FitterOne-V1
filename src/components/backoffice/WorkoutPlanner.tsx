import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeftIcon,
  PlusIcon, 
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";
import { EditRoutineDialog } from "./EditRoutineDialog";
import { useDatabase } from "../../hooks/useDatabase";
import { Client, Week, DailyRoutine, Exercise } from "../../types/Trainer";
import { v4 as uuidv4 } from 'uuid';

interface WorkoutPlannerProps {
  client: Client;
  onBack: () => void;
}

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const createEmptyRoutine = (day: string): DailyRoutine => ({
  id: uuidv4(),
  day,
  title: `Rutina ${day}`,
  exercises: [],
  description: ''
});

const createEmptyWeek = (weekNumber: number): Week => ({
  id: uuidv4(),
  number: weekNumber,
  routines: DAYS.map(day => createEmptyRoutine(day))
});

export const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({ client, onBack }) => {
  const [weeks, setWeeks] = useState<Week[]>([createEmptyWeek(1)]);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<DailyRoutine | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));
  const { database } = useDatabase();

  useEffect(() => {
    if (client?.workoutPlan?.weeks && client.workoutPlan.weeks.length > 0) {
      setWeeks(client.workoutPlan.weeks);
      setExpandedWeeks(new Set([client.workoutPlan.weeks[0].number]));
    }
  }, [client]);

  const handleAddWeek = () => {
    const newWeek = createEmptyWeek(weeks.length + 1);
    setWeeks(prev => [...prev, newWeek]);
    setExpandedWeeks(prev => new Set([...prev, newWeek.number]));
  };

  const handleSaveRoutine = async (routine: DailyRoutine) => {
    if (!client?.id) return;

    try {
      const updatedWeeks = weeks.map(week => {
        if (week.number === selectedWeek + 1) {
          return {
            ...week,
            routines: week.routines.map(r => 
              r.day === selectedDay ? { ...routine, day: selectedDay } : r
            )
          };
        }
        return week;
      });

      setWeeks(updatedWeeks);

      const workoutPlan = {
        id: client.workoutPlan?.id || uuidv4(),
        name: `Plan de ${client.profile.name}`,
        weeks: updatedWeeks,
        createdAt: client.workoutPlan?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Update the client with the new workout plan
      const updatedClient = {
        ...client,
        workoutPlan
      };

      await database.updateClient(updatedClient);
      setIsDialogOpen(false);
      setEditingRoutine(null);
    } catch (error) {
      console.error('Error saving workout plan:', error);
      alert('Error al guardar la rutina. Por favor, intente nuevamente.');
    }
  };

  const toggleWeekExpansion = (weekNumber: number) => {
    setExpandedWeeks(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(weekNumber)) {
        newExpanded.delete(weekNumber);
      } else {
        newExpanded.add(weekNumber);
      }
      return newExpanded;
    });
  };

  if (!client) {
    return (
      <div className="p-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-400 hover:text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white">Error: Cliente no encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-400 hover:text-white" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Planificador de Rutinas</h2>
            <p className="text-gray-400">Cliente: {client.profile.name}</p>
          </div>
        </div>
        <button
          onClick={handleAddWeek}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Semana
        </button>
      </div>

      <div className="space-y-6">
        {weeks.map((week) => (
          <div
            key={week.id}
            className="bg-gray-800 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleWeekExpansion(week.number)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white">
                Semana {week.number}
              </h3>
              {expandedWeeks.has(week.number) ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedWeeks.has(week.number) && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {week.routines.map((routine) => (
                  <motion.div
                    key={routine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-white font-medium">{routine.day}</h4>
                        <p className="text-sm text-gray-400">{routine.title}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedWeek(week.number - 1);
                          setSelectedDay(routine.day);
                          setEditingRoutine(routine);
                          setIsDialogOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-teal-400 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {routine.exercises && routine.exercises.length > 0 ? (
                      <ul className="space-y-2">
                        {routine.exercises.map((exercise: Exercise) => (
                          <li
                            key={exercise.id}
                            className="text-sm text-gray-300 flex items-center"
                          >
                            <span className="w-2 h-2 bg-teal-400 rounded-full mr-2" />
                            {exercise.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No hay ejercicios programados
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <EditRoutineDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingRoutine(null);
        }}
        onSave={handleSaveRoutine}
        initialRoutine={editingRoutine}
      />
    </div>
  );
};