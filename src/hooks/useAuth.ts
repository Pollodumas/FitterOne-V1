// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initializeFirebase } from '../config/firebase';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage first
    const cached = localStorage.getItem('authUser');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initAuth = async () => {
      const { auth } = await initializeFirebase();
      
      unsubscribe = auth.onAuthStateChanged((user: User | null) => {
        setUser(user);
        setLoading(false);
        // Cache the auth state
        if (user) {
          localStorage.setItem('authUser', JSON.stringify(user));
        } else {
          localStorage.removeItem('authUser');
        }
      });
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { user, loading };
};

export default useAuth;