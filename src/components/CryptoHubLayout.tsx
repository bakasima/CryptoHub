
import React, { useState } from 'react';
import { MapView } from '@/components/MapView';
import { CryptoPrices } from '@/components/CryptoPrices';
import { LearningHub } from '@/components/LearningHub';
import { AdminPanel } from '@/components/AdminPanel';
import { AuthPage } from '@/components/AuthPage';
import { EventDetails } from '@/components/EventDetails';
import { BlogList } from '@/components/BlogList';
import { AIChat } from '@/components/AIChat';
import { CoinDetail } from '@/components/CoinDetail';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { BlockchainHub } from './BlockchainHub';

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

export const CryptoHubLayout = () => {
  const { user, isLoading, profile } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<{ id: string; name: string } | null>(null);
  const [currentView, setCurrentView] = useState<'map' | 'prices' | 'learning' | 'blockchain' | 'admin' | 'blogs' | 'chat'>('map');

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCoinSelect = (coinId: string, coinName: string) => {
    setSelectedCoin({ id: coinId, name: coinName });
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

  const renderContent = () => {
    if (currentView === 'admin') {
      if (!user || !profile?.is_admin) {
        return <AuthPage />;
      }
      return <AdminPanel />;
    }

    if (selectedEvent) {
      return <EventDetails event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
    }

    if (selectedCoin) {
      return (
        <CoinDetail
          coinId={selectedCoin.id}
          coinName={selectedCoin.name}
          onBack={() => setSelectedCoin(null)}
        />
      );
    }

    switch (currentView) {
      case 'map':
        return <MapView onEventSelect={handleEventSelect} />;
      case 'prices':
        return <CryptoPrices onCoinSelect={handleCoinSelect} />;
      case 'learning':
        return <LearningHub />;
      case 'blockchain':
        return <BlockchainHub />;
      case 'blogs':
        return (
          <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
                <p className="text-gray-300">Latest insights and updates from the crypto community</p>
              </div>
              <BlogList />
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="h-full p-6 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="max-w-4xl mx-auto h-full">
              <AIChat />
            </div>
          </div>
        );
      default:
        return <MapView onEventSelect={handleEventSelect} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};
