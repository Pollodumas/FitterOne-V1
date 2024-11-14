export interface User {
  id: string;
  email: string;
  type: 'client' | 'trainer';
  createdAt: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  userType: 'client' | 'trainer' | null;
  userId: string | null;
  userEmail: string | null;
}