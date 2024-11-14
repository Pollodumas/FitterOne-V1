import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, UserCircleIcon, PencilIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../services/database';
import { Client } from '../types/Client';

interface ClientProfileProps {
  onBack: () => void;
  theme: string;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({ onBack, theme }) => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Client | null>(null);
  const [newGoal, setNewGoal] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;
      
      try {
        const clientData = await database.getClientById(userId);
        if (clientData) {
          setProfile(clientData);
          setEditedProfile(clientData);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      await database.updateClient(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al guardar los cambios');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setError(null);
  };

  const handleAddGoal = () => {
    if (!editedProfile) return;
    
    if (newGoal.trim() && !editedProfile.objectives?.includes(newGoal.trim())) {
      setEditedProfile({
        ...editedProfile,
        objectives: [...(editedProfile.objectives || []), newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (goalToRemove: string) => {
    if (!editedProfile) return;
    
    setEditedProfile({
      ...editedProfile,
      objectives: editedProfile.objectives?.filter(goal => goal !== goalToRemove) || []
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedProfile) return;
    
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (!editedProfile) return;
        
        const result = reader.result as string;
        setEditedProfile({
          ...editedProfile,
          profile: {
            ...editedProfile.profile,
            photoUrl: result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!profile || !editedProfile) {
    return <div className="text-center p-8">No se encontró el perfil</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="bg-gray-800 rounded-t-xl p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-300 hover:text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-teal-400 hover:text-teal-300"
          >
            <PencilIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Editar</span>
          </button>
        )}
      </div>

      {/* Rest of the component remains the same */}
    </div>
  );
};