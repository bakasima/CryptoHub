
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, ArrowUp, ArrowDown, ArrowLeft } from 'lucide-react';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { useAIInsights } from '@/hooks/useAIInsights';

interface EventDetailsProps {
  event: any;
  compact?: boolean;
  onBack?: () => void;
}

export const EventDetails = ({ event, compact = false, onBack }: EventDetailsProps) => {
  const { data: allCryptoPrices } = useCryptoPrices();
  const { insights, loading: aiLoading, generateInsights } = useAIInsights();

  // Filter crypto prices for event-related cryptocurrencies
  const cryptoPrices = allCryptoPrices?.filter(crypto => 
    event?.cryptoFocus?.some((focus: string) => 
      crypto.name.toLowerCase().includes(focus.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(focus.toLowerCase())
    )
  );

  useEffect(() => {
    if (event && !compact && event.cryptoFocus) {
      generateInsights(event.title, event.cryptoFocus, allCryptoPrices);
    }
  }, [event, compact, allCryptoPrices]);

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
        {cryptoPrices && cryptoPrices.length > 0 && (
          <div className="mt-3 flex space-x-2">
            {cryptoPrices.slice(0, 2).map((crypto: any) => (
              <div key={crypto.name} className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full flex items-center space-x-1">
                <span>{crypto.symbol}</span>
                <span>${crypto.price.toLocaleString()}</span>
                {crypto.change24h > 0 ? (
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
            {event.cryptoFocus?.map((crypto: string) => (
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
        {cryptoPrices && cryptoPrices.length > 0 && (
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Related Crypto Prices (Live)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cryptoPrices.map((crypto: any) => (
                <div key={crypto.name} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{crypto.name}</span>
                    <div className="flex items-center space-x-2">
                      {crypto.change24h > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className={crypto.change24h > 0 ? 'text-green-400' : 'text-red-400'}>
                        {crypto.change24h > 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
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
          <h2 className="text-xl font-semibold text-white mb-4">AI Market Insights</h2>
          {aiLoading ? (
            <div className="flex items-center space-x-3 text-gray-400">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
              <span>Generating personalized insights with OpenAI...</span>
            </div>
          ) : (
            <p className="text-gray-300 leading-relaxed">
              {insights || 'AI insights will appear here once generated.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
