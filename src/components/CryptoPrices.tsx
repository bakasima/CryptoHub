
import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Search, Users } from 'lucide-react';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';

export const CryptoPrices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: cryptoData, isLoading, error } = useCryptoPrices();

  const filteredData = cryptoData?.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number, isPrice = false) => {
    if (isPrice && num < 1) {
      return `$${num.toFixed(4)}`;
    }
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-400">
        <div className="text-center">
          <p className="text-xl mb-2">Failed to load crypto data</p>
          <p className="text-sm text-gray-400">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Real-Time Crypto Prices</h1>
            <p className="text-gray-300">Live market data powered by Coinbase API</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-80"
            />
          </div>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Market Cap</h3>
            <p className="text-2xl font-bold text-white">
              {cryptoData ? formatNumber(cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0)) : '$1.7T'}
            </p>
            <div className="flex items-center space-x-1 mt-2">
              <ArrowUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">+2.1%</span>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">24h Volume</h3>
            <p className="text-2xl font-bold text-white">
              {cryptoData ? formatNumber(cryptoData.reduce((sum, crypto) => sum + crypto.volume, 0)) : '$89.2B'}
            </p>
            <div className="flex items-center space-x-1 mt-2">
              <ArrowDown className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">-5.3%</span>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Active Events</h3>
            <p className="text-2xl font-bold text-white">
              {cryptoData ? cryptoData.reduce((sum, crypto) => sum + crypto.events, 0) : '22'}
            </p>
            <div className="flex items-center space-x-1 mt-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm">This week</span>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">BTC Dominance</h3>
            <p className="text-2xl font-bold text-white">
              {cryptoData && cryptoData[0] ? 
                ((cryptoData[0].marketCap / cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0)) * 100).toFixed(1) + '%' 
                : '51.2%'}
            </p>
            <div className="flex items-center space-x-1 mt-2">
              <ArrowUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">+0.8%</span>
            </div>
          </div>
        </div>

        {/* Crypto Price Table */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Market Overview</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Asset</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Price</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">24h Change</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Volume</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Market Cap</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-medium">Events</th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((crypto) => (
                  <tr key={crypto.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{crypto.symbol[0]}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{crypto.name}</div>
                          <div className="text-gray-400 text-sm">{crypto.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-white font-medium text-lg">
                        {formatNumber(crypto.price, true)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className={`flex items-center justify-end space-x-1 ${
                        crypto.change24h > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {crypto.change24h > 0 ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {crypto.change24h > 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-300">
                      {formatNumber(crypto.volume)}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-300">
                      {formatNumber(crypto.marketCap)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded-full text-sm">
                        {crypto.events} events
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading real-time crypto data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
