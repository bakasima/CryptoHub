
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MapView } from './MapView';
import { EventDetails } from './EventDetails';
import { LearningHub } from './LearningHub';
import { CryptoPrices } from './CryptoPrices';

type ViewType = 'map' | 'events' | 'learning' | 'prices';

export const CryptoHubLayout = () => {
  const [currentView, setCurrentView] = useState<ViewType>('map');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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
      default:
        return <MapView onEventSelect={setSelectedEvent} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 relative overflow-hidden">
        {renderMainContent()}
        {selectedEvent && currentView === 'map' && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96">
            <EventDetails event={selectedEvent} compact />
          </div>
        )}
      </main>
    </div>
  );
};
