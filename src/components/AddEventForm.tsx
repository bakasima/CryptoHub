
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

interface AddEventFormProps {
  onEventAdded: () => void;
  onCancel: () => void;
}

export const AddEventForm = ({ onEventAdded, onCancel }: AddEventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: '',
    date: '',
    time: '',
    location: '',
    lat: '',
    lng: '',
  });
  const [cryptoFocus, setCryptoFocus] = useState<string[]>([]);
  const [newCrypto, setNewCrypto] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addCryptoFocus = () => {
    if (newCrypto.trim() && !cryptoFocus.includes(newCrypto.trim())) {
      setCryptoFocus(prev => [...prev, newCrypto.trim()]);
      setNewCrypto('');
    }
  };

  const removeCryptoFocus = (crypto: string) => {
    setCryptoFocus(prev => prev.filter(c => c !== crypto));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        event_type: formData.event_type,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
        crypto_focus: cryptoFocus,
      };

      const { error } = await supabase
        .from('events')
        .insert([eventData]);

      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Success",
          description: "Event created successfully!",
        });
        onEventAdded();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border-white/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-white">Add New Event</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <Textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="event_type"
              placeholder="Event Type (e.g., Workshop, Meetup)"
              value={formData.event_type}
              onChange={handleInputChange}
              required
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
            <Input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="lat"
              type="number"
              step="any"
              placeholder="Latitude (optional)"
              value={formData.lat}
              onChange={handleInputChange}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
            <Input
              name="lng"
              type="number"
              step="any"
              placeholder="Longitude (optional)"
              value={formData.lng}
              onChange={handleInputChange}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          
          <div>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add crypto focus (e.g., Bitcoin, DeFi)"
                value={newCrypto}
                onChange={(e) => setNewCrypto(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCryptoFocus())}
              />
              <Button
                type="button"
                onClick={addCryptoFocus}
                size="icon"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cryptoFocus.map((crypto) => (
                <span
                  key={crypto}
                  className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {crypto}
                  <button
                    type="button"
                    onClick={() => removeCryptoFocus(crypto)}
                    className="text-blue-300 hover:text-blue-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {error && (
            <Alert className="bg-red-900/30 border-red-500/50">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
