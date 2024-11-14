import React, { useState } from 'react';
import { MainMenu } from './MainMenu';
import { WorkoutDay } from './WorkoutDay';
import { CompletedWorkouts } from './CompletedWorkouts';
import { Settings } from './Settings';
import { ClientProfile } from './ClientProfile';
import { TrainerSearchDialog } from './TrainerSearchDialog';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export const ClientDashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTrainerSearch, setShowTrainerSearch] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <MainMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onShowHistory={() => setShowHistory(true)}
        onShowSettings={() => setShowSettings(true)}
        onShowProfile={() => setShowProfile(true)}
        onShowTrainerSearch={() => setShowTrainerSearch(true)}
        onLogout={logout}
      />

      {showProfile ? (
        <ClientProfile 
          onBack={() => setShowProfile(false)}
          theme={currentTheme}
        />
      ) : showHistory ? (
        <CompletedWorkouts 
          completedWorkouts={[]}
          onBack={() => setShowHistory(false)}
        />
      ) : showSettings ? (
        <Settings 
          onBack={() => setShowSettings(false)}
        />
      ) : showTrainerSearch ? (
        <TrainerSearchDialog 
          onBack={() => setShowTrainerSearch(false)}
          theme={currentTheme}
        />
      ) : (
        <>
          <header className="bg-gradient-to-r from-teal-600 to-teal-800 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-teal-700 rounded-lg transition-colors"
              >
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-white">CutiFit</h1>
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <WorkoutDay 
              exercises={[]}
              onEdit={() => {}}
              onDelete={() => {}}
              theme={currentTheme}
            />
          </main>
        </>
      )}
    </div>
  );
};