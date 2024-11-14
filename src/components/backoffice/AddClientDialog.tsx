import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '../../types/Client';
import { useDatabase } from '../../hooks/useDatabase';

interface AddClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  trainerId: string;
  theme: string;
}

export const AddClientDialog: React.FC<AddClientDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  trainerId,
  theme
}) => {
  const { getClientByEmail } = useDatabase();
  const [formData, setFormData] = useState<Partial<Client>>({
    id: uuidv4(),
    profile: {
      name: '',
      email: '',
      weight: 0,
      height: 0
    },
    objectives: [],
    status: 'active',
    trainer: {
      id: trainerId,
      status: 'accepted',
      planId: null
    },
    progress: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profile?.email) return;

    try {
      // Check if client already exists
      const existingClient = await getClientByEmail(formData.profile.email);
      
      if (existingClient) {
        // Update existing client with trainer info
        const updatedClient = {
          ...existingClient,
          trainer: {
            id: trainerId,
            status: 'accepted',
            planId: null
          },
          status: 'active',
          updatedAt: new Date().toISOString()
        };
        onSave(updatedClient as Client);
      } else {
        // Create new client
        onSave(formData as Client);
      }
      
      onClose();
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Error al agregar cliente. Por favor, intente nuevamente.');
    }
  };

  // Rest of the component remains the same...
}