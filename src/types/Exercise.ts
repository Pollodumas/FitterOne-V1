export interface Exercise {
  id: string;
  name: string;
  series: number;
  reps: string;
  pause: string;
  weight: number;
  videoUrl?: string;
  notes?: string;
}