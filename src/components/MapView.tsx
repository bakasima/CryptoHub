
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  title: string;
  event_type: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  description: string | null;
  lat: number | null;
  lng: number | null;
  crypto_focus: string[];
}

interface MapViewProps {
  onEventSelect: (event: Event) => void;
}

export const MapView = ({ onEventSelect }: MapViewProps) => {
  const [selectedCity, setSelectedCity] = useState('San Francisco');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Crypto Events Near You</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="San Francisco">San Francisco, CA</option>
            <option value="New York">New York, NY</option>
            <option value="Los Angeles">Los Angeles, CA</option>
            <option value="Austin">Austin, TX</option>
          </select>
          <div className="text-gray-300 text-sm">
            Found {events.length} events
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-gradient-to-br from-slate-800 to-slate-900">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-lg">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No events found</p>
              <p className="text-sm">Check back later for new events!</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-full overflow-y-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventSelect(event)}
                  className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 cursor-pointer hover:bg-black/60 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{event.title}</h3>
                      <span className="text-purple-400 text-sm bg-purple-900/30 px-2 py-1 rounded-full">
                        {event.event_type}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  {event.crypto_focus && event.crypto_focus.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {event.crypto_focus.map((crypto) => (
                        <span
                          key={crypto}
                          className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full"
                        >
                          {crypto}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
