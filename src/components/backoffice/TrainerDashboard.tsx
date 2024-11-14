import React, { useState } from 'react';
import { ClientList } from './ClientList';
import { WorkoutPlanner } from './WorkoutPlanner';
import { ClientProgress } from './ClientProgress';
import { PlanManager } from './PlanManager';
import { TrainerProfile } from './TrainerProfile';
import { Client } from '../../types/Trainer';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

type ViewType = 'clients' | 'planner' | 'progress' | 'plans' | 'profile';

export const TrainerDashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const { logout } = useAuth();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('clients');

  const menuItems = [
    {
      id: 'profile',
      label: 'Mi Perfil',
      icon: UserCircleIcon,
      show: true
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: UserGroupIcon,
      show: true
    },
    {
      id: 'planner',
      label: 'Planificador',
      icon: ClipboardDocumentListIcon,
      show: !!selectedClient
    },
    {
      id: 'progress',
      label: 'Progreso',
      icon: ChartBarIcon,
      show: !!selectedClient
    },
    {
      id: 'plans',
      label: 'Planes',
      icon: CurrencyDollarIcon,
      show: true
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return (
          <TrainerProfile
            onBack={() => setActiveView('clients')}
            theme={currentTheme}
          />
        );
      case 'clients':
        return (
          <ClientList
            onClientSelect={(client) => {
              setSelectedClient(client);
              setActiveView('planner');
            }}
          />
        );
      case 'planner':
        return selectedClient && (
          <WorkoutPlanner 
            client={selectedClient}
            onBack={() => setActiveView('clients')}
          />
        );
      case 'progress':
        return selectedClient && (
          <ClientProgress 
            client={selectedClient}
          />
        );
      case 'plans':
        return <PlanManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Panel de Entrenador</h1>
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            Salir
          </button>
        </div>
      </header>

      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            {menuItems
              .filter(item => item.show)
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewType)}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    activeView === item.id
                      ? 'text-white border-b-2 border-blue-400 bg-gray-700/50'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/30'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.label}
                </button>
              ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};