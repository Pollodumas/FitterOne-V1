import { createContext, ReactNode, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { database } from '../services/database';

interface AuthContextProps {
  isAuthenticated: boolean;
  userType: string | null;
  userId: string | null;
  userEmail: string | null;
  login: (email: string, password: string, type: string) => Promise<boolean>;
  register: (email: string, password: string, type: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState({
    isAuthenticated: false,
    userType: null as string | null,
    userId: null as string | null,
    userEmail: null as string | null,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthChange(session);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthChange = async (session: any) => {
    if (!session) {
      setSession({
        isAuthenticated: false,
        userType: null,
        userId: null,
        userEmail: null,
      });
      return;
    }

    try {
      const dbUser = await database.getUserByEmail(session.user.email);
      
      if (dbUser) {
        setSession({
          isAuthenticated: true,
          userType: dbUser.type,
          userId: session.user.id,
          userEmail: session.user.email,
        });
      } else {
        await supabase.auth.signOut();
        setSession({
          isAuthenticated: false,
          userType: null,
          userId: null,
          userEmail: null,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setSession({
        isAuthenticated: false,
        userType: null,
        userId: null,
        userEmail: null,
      });
    }
  };

  const login = useCallback(async (email: string, password: string, type: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const dbUser = await database.getUserByEmail(email);
      
      if (!dbUser || dbUser.type !== type) {
        await supabase.auth.signOut();
        return false;
      }

      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid login credentials') {
        return false;
      }
      
      if (error.message.includes('Too many requests')) {
        throw new Error('Demasiados intentos. Por favor, intente más tarde.');
      }

      throw new Error('Error de conexión. Por favor, intente más tarde.');
    }
  }, []);

  const register = useCallback(async (email: string, password: string, type: string): Promise<boolean> => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      if (!user) throw new Error('No se pudo crear el usuario');

      // Save user data
      await database.saveUser({
        id: user.id,
        email,
        type,
        createdAt: new Date().toISOString()
      });

      // Initialize trainer/client specific data
      if (type === 'trainer') {
        await database.saveTrainer({
          id: user.id,
          username: email,
          name: email.split('@')[0],
          email,
          specialty: '',
          rating: 0,
          clients: 0,
          photoUrl: '',
          bio: '',
          certifications: []
        });
      }

      // Update session state immediately after successful registration
      setSession({
        isAuthenticated: true,
        userType: type,
        userId: user.id,
        userEmail: user.email
      });

      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Clean up on error
      if (error.message.includes('already registered')) {
        throw new Error('El correo ya está registrado');
      }
      if (error.message.includes('invalid email')) {
        throw new Error('Correo inválido');
      }
      if (error.message.includes('password')) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      throw new Error('Error al crear la cuenta');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setSession({
        isAuthenticated: false,
        userType: null,
        userId: null,
        userEmail: null,
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...session,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};