export interface Trainer {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  specialty: string;
  rating: number;
  clients: number;
  photoUrl?: string;
  bio?: string;
  certifications?: string[];
}

// Rest of the file remains unchanged...