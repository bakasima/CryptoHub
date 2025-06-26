import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Search, Eye } from 'lucide-react';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';

interface CryptoPricesProps {
  onCoinSelect?: (coinId: string, coinName: string) => void;
}

export const CryptoPrices = ({ onCoinSelect }: CryptoPricesProps) => {
  const { data: cryptoData, isLoading, error } = useCryptoPrices();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCrypto = cryptoData?.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading crypto prices</p>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Cryptocurrency Prices</h1>
          <p className="text-gray-300 text-sm sm:text-base">Real-time crypto market data</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-lg pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-medium">#</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Name</th>
                    <th className="text-right p-4 text-gray-300 font-medium">Price</th>
                    <th className="text-right p-4 text-gray-300 font-medium">24h %</th>
                    <th className="text-right p-4 text-gray-300 font-medium">Market Cap</th>
                    <th className="text-right p-4 text-gray-300 font-medium">Volume (24h)</th>
                    <th className="text-center p-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrypto.map((crypto, index) => (
                    <tr key={crypto.id} className="border-t border-white/10 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onCoinSelect?.(crypto.id, crypto.name)}>
                      <td className="p-4 text-gray-400">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
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
                            <p className="text-white font-medium">{crypto.name}</p>
                            <p className="text-gray-400 text-sm">{crypto.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right text-white font-medium">
                        ${crypto.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className={`flex items-center justify-end space-x-1 ${
                          crypto.change24h >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          {crypto.change24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-medium">
                            {Math.abs(crypto.change24h).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-white">
                        ${(crypto.marketCap / 1e9).toFixed(1)}B
                      </td>
                      <td className="p-4 text-right text-white">
                        ${(crypto.volume / 1e6).toFixed(1)}M
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCoinSelect?.(crypto.id, crypto.name);
                          }}
                          className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              <div className="p-4 space-y-4">
                {filteredCrypto.map((crypto, index) => (
                  <div
                    key={crypto.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => onCoinSelect?.(crypto.id, crypto.name)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
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
                            <span className="text-white font-bold text-sm">{crypto.symbol.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{crypto.name}</p>
                          <p className="text-gray-400 text-sm">{crypto.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium text-lg">${crypto.price.toLocaleString()}</p>
                        <div className={`flex items-center justify-end space-x-1 ${
                          crypto.change24h >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          {crypto.change24h >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span className="text-sm font-medium">
                            {Math.abs(crypto.change24h).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Market Cap</p>
                        <p className="text-white">${(crypto.marketCap / 1e9).toFixed(1)}B</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Volume (24h)</p>
                        <p className="text-white">${(crypto.volume / 1e6).toFixed(1)}M</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCoinSelect?.(crypto.id, crypto.name);
                        }}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Chart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
