import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, ArrowUp, ArrowDown, ArrowLeft, CreditCard, DollarSign, Share2, Copy, Check } from 'lucide-react';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { useAIInsights } from '@/hooks/useAIInsights';
import { EventPayment } from './EventPayment';
import { FreeEventRegistration } from './FreeEventRegistration';
import { generateEventLink, copyToClipboard, shareEvent } from '@/lib/utils';

interface EventDetailsProps {
  event: any;
  compact?: boolean;
  onBack?: () => void;
}

export const EventDetails = ({ event, compact = false, onBack }: EventDetailsProps) => {
  const { data: allCryptoPrices } = useCryptoPrices();
  const { insights, loading: aiLoading, generateInsights } = useAIInsights();
  const [showPayment, setShowPayment] = useState(false);
  const [showFreeRegistration, setShowFreeRegistration] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    console.log('Payment successful for event:', event.id);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handleFreeRegistrationClose = () => {
    setShowFreeRegistration(false);
    if (onBack) {
      onBack();
    }
  };

  const handleShare = () => {
    shareEvent(event.id, event.title);
  };

  const handleCopyLink = async () => {
    const eventLink = generateEventLink(event.id);
    const success = await copyToClipboard(eventLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'ETH': 'Ξ',
      'BTC': '₿',
      'USDC': 'USDC',
      'USDT': 'USDT'
    };
    return symbols[currency] || currency;
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = getCurrencySymbol(currency);
    if (currency === 'USD') {
      return `${symbol}${price.toFixed(2)}`;
    }
    return `${price.toFixed(4)} ${symbol}`;
  };

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
          {event.is_paid && (
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{formatPrice(event.price, event.payment_currency)}</span>
            </div>
          )}
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

  if (showPayment) {
    return (
      <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowPayment(false)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Event Details</span>
          </button>
          
          <EventPayment
            eventId={event.id}
            price={event.price}
            currency={event.payment_currency}
            adminWalletAddress={event.admin_wallet_address}
            eventData={{
              title: event.title,
              date: event.date,
              time: event.time,
              location: event.location
            }}
            onClose={() => {
              setShowPayment(false);
              if (onBack) {
                onBack();
              }
            }}
          />
        </div>
      </div>
    );
  }

  if (showFreeRegistration) {
    return (
      <FreeEventRegistration
        event={{
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location
        }}
        onClose={handleFreeRegistrationClose}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Events</span>
            </button>
            
            {/* Share Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 px-3 py-2 rounded-lg hover:bg-purple-600/30 transition-colors"
                title="Share Event"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-2 bg-gray-600/20 border border-gray-500/30 text-gray-400 px-3 py-2 rounded-lg hover:bg-gray-600/30 transition-colors"
                title="Copy Event Link"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="hidden sm:inline text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">{event.title}</h1>
            
            {event.is_paid && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">
                    {formatPrice(event.price, event.payment_currency)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-3 text-gray-300">
              <Calendar className="w-5 h-5" />
              <div>
                <div className="font-medium text-white">{event.date}</div>
                <div className="text-sm">{event.time}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <MapPin className="w-5 h-5" />
              <div>
                <div className="font-medium text-white">{event.location}</div>
                <div className="text-sm">Location</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <Users className="w-5 h-5" />
              <div>
                <div className="font-medium text-white">{event.attendees || 0}</div>
                <div className="text-sm">Attendees</div>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="mb-6">
              <h3 className="text-white font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>
            </div>
          )}

          {event.cryptoFocus && event.cryptoFocus.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold text-lg mb-3">Crypto Focus</h3>
              <div className="flex flex-wrap gap-2">
                {event.cryptoFocus.map((focus: string, index: number) => (
                  <span
                    key={index}
                    className="bg-purple-600/20 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-full text-sm"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cryptoPrices && cryptoPrices.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold text-lg mb-3">Related Crypto Prices</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cryptoPrices.map((crypto: any) => (
                  <div key={crypto.name} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{crypto.name}</span>
                      <span className="text-gray-400 text-sm">{crypto.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">${crypto.price.toLocaleString()}</span>
                      <div className="flex items-center space-x-1">
                        {crypto.change24h > 0 ? (
                          <ArrowUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${crypto.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {crypto.change24h > 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights && insights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold text-lg mb-3">AI Insights</h3>
              <div className="space-y-3">
                {insights.slice(0, 3).map((insight: any, index: number) => (
                  <div key={insight.id} className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-blue-400 font-medium">{insight.title}</h4>
                      <span className="text-blue-300 text-sm">{insight.confidence * 100}%</span>
                    </div>
                    <p className="text-blue-300 text-sm">{insight.content}</p>
                    {insight.actionable && insight.action && (
                      <div className="mt-2 text-blue-200 text-sm">
                        <strong>Action:</strong> {insight.action}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {event.is_paid ? (
              <button
                onClick={() => setShowPayment(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Buy Ticket - {formatPrice(event.price, event.payment_currency)}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowFreeRegistration(true)}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Register for Free</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
