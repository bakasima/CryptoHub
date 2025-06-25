
import React, { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface AddEventFormProps {
  onEventAdded: () => void;
}

export const AddEventForm = ({ onEventAdded }: AddEventFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
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
  const [cryptoInput, setCryptoInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const eventTypes = [
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'meetup', label: 'Meetup' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'hackathon', label: 'Hackathon' }
  ];

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

  const addCryptoFocus = () => {
    if (cryptoInput.trim() && !formData.crypto_focus.includes(cryptoInput.trim())) {
      setFormData(prev => ({
        ...prev,
        crypto_focus: [...prev.crypto_focus, cryptoInput.trim()]
      }));
      setCryptoInput('');
    }
  };

  const removeCryptoFocus = (crypto: string) => {
    setFormData(prev => ({
      ...prev,
      crypto_focus: prev.crypto_focus.filter(c => c !== crypto)
    }));
  };

  const uploadImage = async (file: File) => {
    if (!user) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: data.publicUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        uploadImage(file);
      } else {
        alert('Please upload an image file');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        uploadImage(file);
      } else {
        alert('Please upload an image file');
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image_url: ''
    }));
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Event Type</label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-slate-800">
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="City, State or Address"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Expected Attendees</label>
            <input
              type="number"
              name="attendees"
              value={formData.attendees}
              onChange={handleInputChange}
              min="0"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe your event..."
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-white font-medium mb-2">Event Image</label>
          {!formData.image_url ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {uploadingImage ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-2"></div>
                  <p className="text-white">Uploading image...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-white mb-2">Drag and drop an image here, or</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Choose Image
                  </button>
                  <p className="text-gray-400 text-sm mt-2">Supports: JPG, PNG, GIF (Max 5MB)</p>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <img
                src={formData.image_url}
                alt="Event preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Crypto Focus</label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={cryptoInput}
              onChange={(e) => setCryptoInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCryptoFocus())}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add cryptocurrency (e.g., Bitcoin, Ethereum)"
            />
            <button
              type="button"
              onClick={addCryptoFocus}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.crypto_focus.map((crypto) => (
              <span
                key={crypto}
                className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{crypto}</span>
                <button
                  type="button"
                  onClick={() => removeCryptoFocus(crypto)}
                  className="text-purple-300 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

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
