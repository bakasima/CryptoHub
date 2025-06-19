
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MapView } from './MapView';
import { EventDetails } from './EventDetails';
import { LearningHub } from './LearningHub';
import { CryptoPrices } from './CryptoPrices';
import { AdminPanel } from './AdminPanel';
import { AuthPage } from './AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

type ViewType = 'map' | 'events' | 'learning' | 'prices' | 'admin';

export const CryptoHubLayout = () => {
  const [currentView, setCurrentView] = useState<ViewType>('map');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthPage />;
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'map':
        return <MapView onEventSelect={setSelectedEvent} />;
      case 'events':
        return <EventDetails event={selectedEvent} />;
      case 'learning':
        return <LearningHub />;
      case 'prices':
        return <CryptoPrices />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <MapView onEventSelect={setSelectedEvent} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isAdmin={profile?.is_admin || false}
      />
      <main className="flex-1 relative overflow-hidden">
        {!user && currentView !== 'map' && currentView !== 'learning' && currentView !== 'prices' ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
              <p className="text-gray-300 mb-6">Please sign in to access this feature.</p>
              <Button
                onClick={() => setShowAuth(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        ) : (
          renderMainContent()
        )}
        
        {selectedEvent && currentView === 'map' && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96">
            <EventDetails event={selectedEvent} compact />
          </div>
        )}
        
        {!user && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setShowAuth(true)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Admin Login
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
