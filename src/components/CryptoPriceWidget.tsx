import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';

export const CryptoPriceWidget = () => {
  const { data: cryptoPrices, isLoading, error } = useCryptoPrices();

  if (isLoading) {
    return (
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-purple-400" />
          <span className="text-gray-300 text-sm sm:text-base">Loading crypto prices...</span>
        </div>
      </div>
    );
  }

  if (error || !cryptoPrices || cryptoPrices.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-red-400 text-lg sm:text-xl">!</span>
          </div>
          <h4 className="text-red-400 font-medium mb-2 text-sm sm:text-base">Unable to Load Prices</h4>
          <p className="text-gray-400 text-xs sm:text-sm">Using fallback data</p>
        </div>
      </div>
    );
  }

  const topCryptos = cryptoPrices.slice(0, 6);

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6">
      <h4 className="text-white font-semibold text-base sm:text-lg mb-4">Live Crypto Prices</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {topCryptos.map((crypto) => (
          <div key={crypto.id} className="bg-white/5 rounded-lg p-3 sm:p-4 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={crypto.image || `https://api.coingecko.com/api/v3/coins/${crypto.id}/image`}
                    alt={crypto.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center hidden">
                    <span className="text-white font-bold text-xs">{crypto.symbol.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-medium text-sm sm:text-base">{crypto.name}</div>
                  <div className="text-gray-400 text-xs">{crypto.symbol}</div>
                </div>
              </div>
              <div className={`flex items-center space-x-1 text-xs sm:text-sm ${
                crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {crypto.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(crypto.change24h).toFixed(2)}%</span>
              </div>
            </div>
            
            <div className="text-white font-bold text-base sm:text-lg">
              ${crypto.price.toLocaleString()}
            </div>
            
            <div className="text-gray-400 text-xs mt-1">
              Market Cap: ${(crypto.marketCap / 1e9).toFixed(2)}B
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-400">Last updated:</span>
          <span className="text-white">{new Date().toLocaleTimeString()}</span>
        </div>
        <div className="text-center mt-2">
          <span className="text-green-400 text-xs">✓ Live data from CoinGecko</span>
        </div>
      </div>
    </div>
  );
}; 