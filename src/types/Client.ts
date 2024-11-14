export interface Client {
  id: string;
  email: string;
  profile: {
    name: string;
    email: string;
    weight: number;
    height: number;
    photoUrl?: string;
  };
  objectives: string[];
  status: 'new' | 'active' | 'inactive';
  trainer: {
    id: string | null;
    status: 'pending' | 'accepted' | 'rejected' | null;
    planId: string | null;
  };
  progress: any[];
  workoutPlan?: any;
  createdAt: string;
  updatedAt: string;
}