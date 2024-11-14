import { useState, useCallback } from 'react';
import { database } from '../services/database';
import { Client } from '../types/Client';
import { Trainer, ClientPlan } from '../types/Trainer';
import { User } from '../types/Auth';

// Demo data initialization
export const initializeDemoData = async () => {
  try {
    // Clear existing data
    await database.clearDatabase();

    // Initialize demo users
    await database.saveUser({
      id: 'trainer-demo',
      email: 'trainer@demo.com',
      password: 'demo123',
      type: 'trainer',
      createdAt: new Date().toISOString()
    });

    await database.saveUser({
      id: 'client-demo',
      email: 'client@demo.com',
      password: 'demo123',
      type: 'client',
      createdAt: new Date().toISOString()
    });

    // Initialize demo trainer
    await database.saveTrainer({
      id: 'trainer-demo',
      username: 'trainer@demo.com',
      name: 'Trainer Demo',
      email: 'trainer@demo.com',
      specialty: 'Entrenamiento Funcional',
      rating: 4.8,
      clients: 5,
      certifications: ['Certificación en Entrenamiento Funcional', 'Nutrición Deportiva'],
      bio: 'Entrenador profesional con más de 5 años de experiencia'
    });

    // Initialize demo client
    await database.saveClient({
      id: 'client-demo',
      email: 'client@demo.com',
      profile: {
        name: 'Cliente Demo',
        email: 'client@demo.com',
        weight: 75,
        height: 175
      },
      objectives: ['Pérdida de peso', 'Tonificación'],
      status: 'active',
      trainer: 'trainer-demo',
      progress: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error initializing demo data:', error);
    throw error;
  }
};

export function useDatabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserByEmail = useCallback(async (email: string): Promise<User | undefined> => {
    setLoading(true);
    setError(null);
    try {
      return await database.getUserByEmail(email);
    } catch (err) {
      setError('Error getting user');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUser = useCallback(async (user: User): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await database.saveUser(user);
    } catch (err) {
      setError('Error saving user');
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientsByTrainer = useCallback(async (trainerId: string): Promise<Client[]> => {
    setLoading(true);
    setError(null);
    try {
      return await database.getClientsByTrainer(trainerId);
    } catch (err) {
      setError('Error loading clients');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientByEmail = useCallback(async (email: string): Promise<Client | undefined> => {
    setLoading(true);
    setError(null);
    try {
      return await database.getClientByEmail(email);
    } catch (err) {
      setError('Error getting client');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveClient = useCallback(async (client: Client): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await database.saveClient(client);
    } catch (err) {
      setError('Error saving client');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrainerByEmail = useCallback(async (email: string): Promise<Trainer | undefined> => {
    setLoading(true);
    setError(null);
    try {
      return await database.getTrainerByEmail(email);
    } catch (err) {
      setError('Error getting trainer');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTrainer = useCallback(async (trainer: Trainer): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await database.saveTrainer(trainer);
    } catch (err) {
      setError('Error saving trainer');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchTrainers = useCallback(async (query: string): Promise<Trainer[]> => {
    setLoading(true);
    setError(null);
    try {
      return await database.searchTrainers(query);
    } catch (err) {
      setError('Error searching trainers');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllPlans = useCallback(async (): Promise<ClientPlan[]> => {
    setLoading(true);
    setError(null);
    try {
      return await database.getAllPlans();
    } catch (err) {
      setError('Error loading plans');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlansByTrainer = useCallback(async (trainerId: string): Promise<ClientPlan[]> => {
    setLoading(true);
    setError(null);
    try {
      return await database.getPlansByTrainer(trainerId);
    } catch (err) {
      setError('Error loading trainer plans');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const savePlan = useCallback(async (plan: ClientPlan): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await database.savePlan(plan);
    } catch (err) {
      setError('Error saving plan');
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientWorkout = useCallback(async (clientId: string): Promise<any | undefined> => {
    setLoading(true);
    setError(null);
    try {
      return await database.getClientWorkout(clientId);
    } catch (err) {
      setError('Error loading workout');
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveClientWorkout = useCallback(async (workout: any): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await database.saveClientWorkout(workout);
    } catch (err) {
      setError('Error saving workout');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    database,
    getUserByEmail,
    saveUser,
    getClientsByTrainer,
    getClientByEmail,
    saveClient,
    getTrainerByEmail,
    saveTrainer,
    searchTrainers,
    getAllPlans,
    getPlansByTrainer,
    savePlan,
    getClientWorkout,
    saveClientWorkout
  };
}