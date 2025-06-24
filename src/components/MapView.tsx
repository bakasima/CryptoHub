
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { EventDetails } from './EventDetails';

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
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setEvents(data);
      } else {
        // Create sample events if none exist
        await createSampleEvents();
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleEvents = async () => {
    const sampleEvents = [
      {
        title: 'Bitcoin Conference 2024',
        event_type: 'conference',
        date: '2024-07-15',
        time: '09:00:00',
        location: 'Miami, FL',
        attendees: 2500,
        description: 'The largest Bitcoin conference bringing together industry leaders, developers, and enthusiasts.',
        lat: 25.7617,
        lng: -80.1918,
        crypto_focus: ['Bitcoin', 'Lightning Network']
      },
      {
        title: 'Ethereum DevCon',
        event_type: 'workshop',
        date: '2024-08-22',
        time: '10:00:00',
        location: 'San Francisco, CA',
        attendees: 1800,
        description: 'Developer conference focused on Ethereum ecosystem and smart contract development.',
        lat: 37.7749,
        lng: -122.4194,
        crypto_focus: ['Ethereum', 'DeFi', 'Smart Contracts']
      },
      {
        title: 'DeFi Summit',
        event_type: 'meetup',
        date: '2024-09-10',
        time: '14:00:00',
        location: 'New York, NY',
        attendees: 800,
        description: 'Exploring the future of decentralized finance and yield farming strategies.',
        lat: 40.7128,
        lng: -74.0060,
        crypto_focus: ['DeFi', 'Yield Farming', 'Uniswap']
      },
      {
        title: 'NFT Art Expo',
        event_type: 'exhibition',
        date: '2024-10-05',
        time: '11:00:00',
        location: 'Los Angeles, CA',
        attendees: 1200,
        description: 'Showcase of digital art and NFT collections from renowned artists.',
        lat: 34.0522,
        lng: -118.2437,
        crypto_focus: ['NFT', 'Digital Art', 'OpenSea']
      }
    ];

    try {
      const { data, error } = await supabase
        .from('events')
        .insert(sampleEvents)
        .select();

      if (error) throw error;
      if (data) setEvents(data);
    } catch (error) {
      console.error('Error creating sample events:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.crypto_focus.some(crypto => crypto.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || event.event_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    onEventSelect(event);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Crypto Events Map</h1>
            <p className="text-gray-300">Discover blockchain events happening around the world</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="conference">Conferences</option>
              <option value="workshop">Workshops</option>
              <option value="meetup">Meetups</option>
              <option value="exhibition">Exhibitions</option>
            </select>

            <button
              onClick={() => setShowMap(!showMap)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{showMap ? 'List View' : 'Map View'}</span>
            </button>
          </div>
        </div>

        {showMap ? (
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-8 mb-6">
            <div className="text-center text-gray-400">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Interactive Map Coming Soon</p>
              <p className="text-sm">Map integration with real-time event locations</p>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                      <div className="flex items-center space-x-4 text-gray-300 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                    <span className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full text-sm capitalize">
                      {event.event_type}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {event.crypto_focus.map((crypto) => (
                      <span
                        key={crypto}
                        className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full text-xs"
                      >
                        {crypto}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedEvent ? (
              <EventDetails event={selectedEvent} compact={true} />
            ) : (
              <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                <div className="text-center text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Select an Event</p>
                  <p className="text-sm">Click on an event to view details and related crypto prices</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
