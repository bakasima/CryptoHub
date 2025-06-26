import React, { useState, useEffect } from 'react';
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
import { WalletConnect } from '@/components/WalletConnect';
import { AITradingAssistant } from '@/components/AITradingAssistant';
import { CryptoPriceWidget } from '@/components/CryptoPriceWidget';
import { UserTickets } from '@/components/UserTickets';
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
  const { user, isLoading, profile, error } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<{ id: string; name: string } | null>(null);
  const [currentView, setCurrentView] = useState<'map' | 'prices' | 'learning' | 'blockchain' | 'admin' | 'blogs' | 'chat' | 'wallet' | 'ai-trading' | 'tickets'>('map');
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Authentication state is working properly
    } catch (err) {
      console.error('Error in CryptoHubLayout useEffect:', err);
      setRenderError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [user, profile, isLoading, error, currentView]);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCoinSelect = (coinId: string, coinName: string) => {
    setSelectedCoin({ id: coinId, name: coinName });
  };

  if (renderError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-red-400 mb-2">Layout Error</h2>
            <p className="text-red-300 text-sm">{renderError}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

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
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Application</h2>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (currentView === 'admin') {
      if (!profile?.is_admin) {
        setCurrentView('map');
        return <MapView onEventSelect={handleEventSelect} />;
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
      case 'wallet':
        return (
          <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Wallet & Portfolio Dashboard</h1>
                <p className="text-gray-300 text-sm sm:text-base">Connect your wallet and manage your crypto portfolio</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Wallet Section - Takes 2/3 of the width */}
                <div className="lg:col-span-2">
                  <WalletConnect />
                </div>
                
                {/* Crypto Prices Section - Takes 1/3 of the width */}
                <div className="lg:col-span-1">
                  <CryptoPriceWidget />
                </div>
              </div>
            </div>
          </div>
        );
      case 'ai-trading':
        return (
          <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">AI Trading Assistant</h1>
                <p className="text-gray-300 text-sm sm:text-base">Get AI-powered trading insights and recommendations</p>
              </div>
              <AITradingAssistant />
            </div>
          </div>
        );
      case 'blogs':
        return (
          <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Blog Posts</h1>
                <p className="text-gray-300 text-sm sm:text-base">Latest insights and updates from the crypto community</p>
              </div>
              <BlogList />
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="h-full p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="max-w-4xl mx-auto h-full">
              <AIChat />
            </div>
          </div>
        );
      case 'tickets':
        return <UserTickets />;
      default:
        return <MapView onEventSelect={handleEventSelect} />;
    }
  };

  try {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    );
  } catch (err) {
    console.error('Error rendering CryptoHubLayout:', err);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-red-400 mb-2">Rendering Error</h2>
            <p className="text-red-300 text-sm">{err instanceof Error ? err.message : 'Unknown rendering error'}</p>
            <p className="text-red-300 text-sm mt-2">Stack: {err instanceof Error ? err.stack : 'No stack trace'}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};
