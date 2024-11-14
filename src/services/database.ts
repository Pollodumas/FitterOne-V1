import { User } from '../types/Auth';
import { Client } from '../types/Client';
import { Trainer, ClientPlan } from '../types/Trainer';

export class Database {
  private storage = localStorage;
  private prefix = 'fitterone_';

  private getKey(collection: string, id?: string): string {
    return id ? `${this.prefix}${collection}_${id}` : `${this.prefix}${collection}`;
  }

  private saveToStorage<T>(collection: string, id: string, data: T): void {
    const key = this.getKey(collection, id);
    this.storage.setItem(key, JSON.stringify(data));
    
    // Update collection index
    const indexKey = this.getKey(collection);
    const index = JSON.parse(this.storage.getItem(indexKey) || '[]');
    if (!index.includes(id)) {
      index.push(id);
      this.storage.setItem(indexKey, JSON.stringify(index));
    }
  }

  private getFromStorage<T>(collection: string, id: string): T | undefined {
    const key = this.getKey(collection, id);
    const data = this.storage.getItem(key);
    return data ? JSON.parse(data) : undefined;
  }

  private getAllFromStorage<T>(collection: string): T[] {
    const indexKey = this.getKey(collection);
    const index = JSON.parse(this.storage.getItem(indexKey) || '[]');
    return index.map((id: string) => this.getFromStorage<T>(collection, id)).filter(Boolean);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = this.getAllFromStorage<User>('users');
    return users.find(user => user.email === email);
  }

  async saveUser(user: User): Promise<void> {
    this.saveToStorage('users', user.id, user);
  }

  async getClientsByTrainer(trainerId: string): Promise<Client[]> {
    const clients = this.getAllFromStorage<Client>('clients');
    return clients.filter(client => client.trainer?.id === trainerId);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const clients = this.getAllFromStorage<Client>('clients');
    return clients.find(client => client.profile.email === email);
  }

  async saveClient(client: Client): Promise<void> {
    this.saveToStorage('clients', client.id, client);
  }

  async updateClient(client: Client): Promise<void> {
    const existingClient = await this.getClientByEmail(client.profile.email);
    if (existingClient) {
      this.saveToStorage('clients', existingClient.id, {
        ...existingClient,
        ...client,
        id: existingClient.id // Ensure we keep the original ID
      });
    } else {
      this.saveToStorage('clients', client.id, client);
    }
  }

  async getTrainerByEmail(email: string): Promise<Trainer | undefined> {
    const trainers = this.getAllFromStorage<Trainer>('trainers');
    return trainers.find(trainer => trainer.email === email);
  }

  async saveTrainer(trainer: Trainer): Promise<void> {
    this.saveToStorage('trainers', trainer.id, trainer);
  }

  async searchTrainers(query: string): Promise<Trainer[]> {
    const trainers = this.getAllFromStorage<Trainer>('trainers');
    if (!query) return trainers;
    
    const searchTerm = query.toLowerCase();
    return trainers.filter(trainer => 
      trainer.name.toLowerCase().includes(searchTerm) ||
      trainer.specialty.toLowerCase().includes(searchTerm)
    );
  }

  async getAllPlans(): Promise<ClientPlan[]> {
    return this.getAllFromStorage<ClientPlan>('plans');
  }

  async getPlansByTrainer(trainerId: string): Promise<ClientPlan[]> {
    const plans = this.getAllFromStorage<ClientPlan>('plans');
    return plans.filter(plan => plan.trainerId === trainerId);
  }

  async savePlan(plan: ClientPlan): Promise<void> {
    this.saveToStorage('plans', plan.id, plan);
  }

  async getClientWorkout(clientId: string): Promise<any | undefined> {
    return this.getFromStorage('workouts', clientId);
  }

  async saveClientWorkout(workout: any): Promise<void> {
    this.saveToStorage('workouts', workout.clientId, workout);
  }

  async clearDatabase(): Promise<void> {
    const collections = ['users', 'clients', 'trainers', 'plans', 'workouts'];
    collections.forEach(collection => {
      const indexKey = this.getKey(collection);
      const index = JSON.parse(this.storage.getItem(indexKey) || '[]');
      
      // Remove all items in collection
      index.forEach((id: string) => {
        const key = this.getKey(collection, id);
        this.storage.removeItem(key);
      });
      
      // Remove index
      this.storage.removeItem(indexKey);
    });
  }
}

export const database = new Database();