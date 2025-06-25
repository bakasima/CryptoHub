
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
      <div className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading crypto prices</p>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cryptocurrency Prices</h1>
          <p className="text-gray-300">Real-time crypto market data</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
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
                    <tr key={crypto.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-400">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-white font-medium">{crypto.name}</p>
                            <p className="text-gray-400 text-sm">{crypto.symbol.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right text-white font-medium">
                        ${crypto.current_price.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className={`flex items-center justify-end space-x-1 ${
                          crypto.price_change_percentage_24h >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          {crypto.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-medium">
                            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-white">
                        ${(crypto.market_cap / 1e9).toFixed(1)}B
                      </td>
                      <td className="p-4 text-right text-white">
                        ${(crypto.total_volume / 1e6).toFixed(1)}M
                      </td>
                      <td className="p-4 text-center">
                        {onCoinSelect && (
                          <button
                            onClick={() => onCoinSelect(crypto.id, crypto.name)}
                            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
