import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventDetails } from '@/components/EventDetails';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { fetchEventById, Event } from '@/lib/events';

export const EventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, isLoading, profile, error } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'map' | 'prices' | 'learning' | 'blockchain' | 'admin' | 'blogs' | 'chat' | 'wallet' | 'ai-trading' | 'tickets'>('map');

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        setEventError('No event ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setEventError(null);
        
        const eventData = await fetchEventById(eventId);
        
        if (!eventData) {
          setEventError('Event not found');
          setLoading(false);
          return;
        }

        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching event:', err);
        setEventError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const handleBack = () => {
    navigate('/');
  };

  const handleViewChange = (view: 'map' | 'prices' | 'learning' | 'blockchain' | 'admin' | 'blogs' | 'chat' | 'wallet' | 'ai-trading' | 'tickets') => {
    setCurrentView(view);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-red-400 mb-2">Authentication Error</h2>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button 
            onClick={handleBack}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Event</h2>
            <p className="text-red-300 text-sm">{eventError}</p>
          </div>
          <button 
            onClick={handleBack}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">Event Not Found</h2>
            <p className="text-yellow-300 text-sm">The event you're looking for doesn't exist or has been removed.</p>
          </div>
          <button 
            onClick={handleBack}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex h-screen">
        <Sidebar currentView={currentView} onViewChange={handleViewChange} />
        <div className="flex-1 overflow-hidden">
          <EventDetails event={event} onBack={handleBack} />
        </div>
      </div>
    </div>
  );
}; 