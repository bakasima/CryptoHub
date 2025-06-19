
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  description: string;
  lat: number;
  lng: number;
  cryptoFocus: string[];
}

interface MapViewProps {
  onEventSelect: (event: Event) => void;
}

export const MapView = ({ onEventSelect }: MapViewProps) => {
  const [selectedCity, setSelectedCity] = useState('San Francisco');
  const [events, setEvents] = useState<Event[]>([]);

  // Mock events data - in real app this would come from Google Maps API
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'DeFi Fundamentals Workshop',
      type: 'Workshop',
      date: '2024-12-20',
      time: '6:00 PM',
      location: 'TechHub SF, 123 Market St',
      attendees: 45,
      description: 'Learn the basics of Decentralized Finance and how to get started.',
      lat: 37.7749,
      lng: -122.4194,
      cryptoFocus: ['DeFi', 'Ethereum', 'Uniswap']
    },
    {
      id: '2',
      title: 'Bitcoin Trading Strategies',
      type: 'Meetup',
      date: '2024-12-22',
      time: '7:30 PM',
      location: 'Crypto Café, 456 Mission St',
      attendees: 32,
      description: 'Advanced trading strategies and market analysis techniques.',
      lat: 37.7849,
      lng: -122.4094,
      cryptoFocus: ['Bitcoin', 'Trading', 'Technical Analysis']
    },
    {
      id: '3',
      title: 'NFT Art Exhibition',
      type: 'Exhibition',
      date: '2024-12-25',
      time: '3:00 PM',
      location: 'Digital Gallery, 789 Folsom St',
      attendees: 78,
      description: 'Showcasing the latest NFT artworks from local creators.',
      lat: 37.7649,
      lng: -122.4294,
      cryptoFocus: ['NFT', 'Art', 'Ethereum']
    }
  ];

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

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
        {/* Map placeholder - would integrate Google Maps API here */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Interactive Map Loading...</p>
            <p className="text-sm">Google Maps integration will show event locations here</p>
          </div>
        </div>

        {/* Event pins overlay */}
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
                      {event.type}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date} at {event.time}</span>
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

                <div className="mt-3 flex flex-wrap gap-1">
                  {event.cryptoFocus.map((crypto) => (
                    <span
                      key={crypto}
                      className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full"
                    >
                      {crypto}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
