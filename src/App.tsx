import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { TrainerDashboard } from './components/backoffice/TrainerDashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { isAuthenticated, userType } = useAuth();
  const [view, setView] = useState<'landing' | 'login' | 'register'>('landing');
  const [isTrainerFlow, setIsTrainerFlow] = useState(false);

  // If authenticated, show the appropriate dashboard
  if (isAuthenticated) {
    if (userType === 'trainer') {
      return <TrainerDashboard />;
    }
    return <ClientDashboard />;
  }

  // If not authenticated, handle landing/login/register flow
  switch (view) {
    case 'landing':
      return (
        <LandingPage 
          onClientLogin={() => {
            setIsTrainerFlow(false);
            setView('login');
          }}
          onTrainerLogin={() => {
            setIsTrainerFlow(true);
            setView('login');
          }}
          onClientRegister={() => {
            setIsTrainerFlow(false);
            setView('register');
          }}
          onTrainerRegister={() => {
            setIsTrainerFlow(true);
            setView('register');
          }}
        />
      );
    case 'login':
      return (
        <LoginForm 
          isTrainer={isTrainerFlow}
          onBack={() => setView('landing')}
        />
      );
    case 'register':
      return (
        <RegisterForm 
          isTrainer={isTrainerFlow}
          onBack={() => setView('landing')}
        />
      );
    default:
      return null;
  }
};

export default App;