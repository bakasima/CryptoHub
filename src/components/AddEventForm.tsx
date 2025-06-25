
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EventFormFields } from './EventFormFields';
import { ImageUpload } from './ImageUpload';
import { CryptoFocusTags } from './CryptoFocusTags';

interface AddEventFormProps {
  onEventAdded: () => void;
}

export const AddEventForm = ({ onEventAdded }: AddEventFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'conference',
    date: '',
    time: '',
    location: '',
    attendees: 0,
    description: '',
    lat: null as number | null,
    lng: null as number | null,
    crypto_focus: [] as string[],
    image_url: '' as string
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...formData,
          created_by: user.id,
          attendees: Number(formData.attendees)
        }])
        .select();

      if (error) throw error;

      console.log('Event created:', data);
      onEventAdded();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageUrl
    }));
  };

  const handleCryptoFocusChange = (cryptoFocus: string[]) => {
    setFormData(prev => ({
      ...prev,
      crypto_focus: cryptoFocus
    }));
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <EventFormFields 
          formData={formData}
          onInputChange={handleInputChange}
        />

        <ImageUpload 
          imageUrl={formData.image_url}
          onImageChange={handleImageChange}
        />

        <CryptoFocusTags 
          cryptoFocus={formData.crypto_focus}
          onCryptoFocusChange={handleCryptoFocusChange}
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onEventAdded}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};
