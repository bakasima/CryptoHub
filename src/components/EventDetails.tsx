
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface EventDetailsProps {
  event: any;
  compact?: boolean;
  onBack?: () => void;
}

export const EventDetails = ({ event, compact = false, onBack }: EventDetailsProps) => {
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch crypto prices for event-related cryptocurrencies
  const { data: cryptoPrices } = useQuery({
    queryKey: ['cryptoPrices', event?.cryptoFocus],
    queryFn: async () => {
      if (!event?.cryptoFocus) return null;
      
      // Mock Coinbase API call - in real app would use actual Coinbase API
      const mockPrices = {
        'Bitcoin': { price: 43250, change: 2.3 },
        'Ethereum': { price: 2650, change: -1.2 },
        'DeFi': { price: 1250, change: 4.1 },
        'NFT': { price: 850, change: -0.8 },
        'Uniswap': { price: 6.75, change: 1.9 }
      };
      
      return event.cryptoFocus.map((crypto: string) => ({
        name: crypto,
        ...mockPrices[crypto as keyof typeof mockPrices] || { price: 100, change: 0 }
      }));
    },
    enabled: !!event?.cryptoFocus
  });

  const generateAIInsights = async () => {
    if (!event) return;
    
    setLoading(true);
    try {
      // Mock OpenAI API call - in real app would use actual OpenAI API
      setTimeout(() => {
        const insights = `Based on the current market conditions, ${event.title} is particularly relevant as ${event.cryptoFocus.join(', ')} have shown interesting trends recently. This event will provide valuable insights into market movements and practical applications of these technologies.`;
        setAiInsights(insights);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (event && !compact) {
      generateAIInsights();
    }
  }, [event, compact]);

  if (!event) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Select an event to view details</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-4">
        <h3 className="text-white font-semibold text-lg mb-2">{event.title}</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>
        {cryptoPrices && (
          <div className="mt-3 flex space-x-2">
            {cryptoPrices.slice(0, 2).map((crypto: any) => (
              <div key={crypto.name} className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full flex items-center space-x-1">
                <span>{crypto.name}</span>
                <span>${crypto.price.toLocaleString()}</span>
                {crypto.change > 0 ? (
                  <ArrowUp className="w-3 h-3 text-green-400" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </button>
        )}
        
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-white mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-3 text-gray-300">
              <Calendar className="w-5 h-5" />
              <div>
                <div className="font-medium">{event.date}</div>
                <div className="text-sm">{event.time}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <MapPin className="w-5 h-5" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm">{event.location}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Users className="w-5 h-5" />
              <div>
                <div className="font-medium">{event.attendees} Attending</div>
                <div className="text-sm">Join the community</div>
              </div>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed">{event.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {event.cryptoFocus.map((crypto: string) => (
              <span
                key={crypto}
                className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full text-sm"
              >
                {crypto}
              </span>
            ))}
          </div>
        </div>

        {/* Real-time Crypto Prices */}
        {cryptoPrices && (
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Related Crypto Prices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cryptoPrices.map((crypto: any) => (
                <div key={crypto.name} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{crypto.name}</span>
                    <div className="flex items-center space-x-2">
                      {crypto.change > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className={crypto.change > 0 ? 'text-green-400' : 'text-red-400'}>
                        {crypto.change > 0 ? '+' : ''}{crypto.change}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white mt-1">
                    ${crypto.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI-Generated Insights */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">AI Insights</h2>
          {loading ? (
            <div className="flex items-center space-x-3 text-gray-400">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
              <span>Generating personalized insights...</span>
            </div>
          ) : (
            <p className="text-gray-300 leading-relaxed">{aiInsights}</p>
          )}
        </div>
      </div>
    </div>
  );
};
