import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import { database } from '../../services/database';
import { Trainer } from '../../types/Trainer';

interface TrainerProfileProps {
  onBack: () => void;
  theme: string;
}

export const TrainerProfile: React.FC<TrainerProfileProps> = ({ onBack, theme }) => {
  const { userId, userEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Trainer>({
    id: userId || '',
    username: userEmail || '',
    name: userEmail?.split('@')[0] || '',
    email: userEmail || '',
    specialty: '',
    rating: 0,
    clients: 0,
    photoUrl: '',
    bio: '',
    certifications: []
  });
  const [editedProfile, setEditedProfile] = useState<Trainer>(profile);
  const [newCertification, setNewCertification] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      try {
        const trainerData = await database.getTrainerById(userId);
        
        if (trainerData) {
          setProfile(trainerData);
          setEditedProfile(trainerData);
        } else {
          // Initialize with default profile
          const defaultProfile = {
            id: userId,
            username: userEmail || '',
            name: userEmail?.split('@')[0] || '',
            email: userEmail || '',
            specialty: '',
            rating: 0,
            clients: 0,
            photoUrl: '',
            bio: '',
            certifications: []
          };
          
          await database.saveTrainer(defaultProfile);
          setProfile(defaultProfile);
          setEditedProfile(defaultProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Error al cargar el perfil. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId, userEmail]);

  const handleSave = async () => {
    setError(null);
    try {
      await database.updateTrainerProfile(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al guardar los cambios. Por favor, intente nuevamente.');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setError(null);
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && !editedProfile.certifications?.includes(newCertification.trim())) {
      setEditedProfile({
        ...editedProfile,
        certifications: [...(editedProfile.certifications || []), newCertification.trim()]
      });
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (certToRemove: string) => {
    setEditedProfile({
      ...editedProfile,
      certifications: editedProfile.certifications?.filter(cert => cert !== certToRemove) || []
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditedProfile({ ...editedProfile, photoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
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
          <h2 className="text-2xl font-bold text-white">Mi Perfil de Trainer</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-blue-400 hover:text-blue-300"
          >
            <PencilIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Editar</span>
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-b-xl p-8 shadow-xl"
      >
        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Foto de Perfil
              </label>
              <div className="flex items-center space-x-4">
                {editedProfile.photoUrl ? (
                  <img
                    src={editedProfile.photoUrl}
                    alt={editedProfile.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl text-gray-400">
                      {editedProfile.name.charAt(0)}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cambiar foto
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Especialidad
              </label>
              <input
                type="text"
                value={editedProfile.specialty}
                onChange={(e) => setEditedProfile({ ...editedProfile, specialty: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Biografía
              </label>
              <textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Certificaciones
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Agregar certificación..."
                  />
                  <button
                    onClick={handleAddCertification}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editedProfile.certifications?.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-700 text-white"
                    >
                      {cert}
                      <button
                        onClick={() => handleRemoveCertification(cert)}
                        className="ml-2 text-gray-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">
                    {profile.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
                <p className="text-gray-400">{profile.email}</p>
              </div>
            </div>

            {profile.specialty && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Especialidad</h4>
                <p className="text-white">{profile.specialty}</p>
              </div>
            )}

            {profile.bio && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Biografía</h4>
                <p className="text-white">{profile.bio}</p>
              </div>
            )}

            {profile.certifications && profile.certifications.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Certificaciones</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-gray-700 text-white"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};