import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Clock, Activity } from 'lucide-react';
import { useCoinDetail } from '@/hooks/useCoinDetail';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface CoinDetailProps {
  coinId: string;
  coinName: string;
  onBack: () => void;
}

type Timeframe = '1D' | '7D' | '30D' | '90D' | '1Y';

export const CoinDetail = ({ coinId, coinName, onBack }: CoinDetailProps) => {
  const { data: coinData, isLoading, error } = useCoinDetail(coinId);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('7D');

  const timeframes: Timeframe[] = ['1D', '7D', '30D', '90D', '1Y'];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading {coinName} data...</p>
        </div>
      </div>
    );
  }

  if (error || !coinData) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading coin data</p>
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="bg-black/40 backdrop-blur-xl border border-white/20 text-white p-2 rounded-lg hover:bg-white/10 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={coinData.image || `https://api.coingecko.com/api/v3/coins/${coinId}/image`}
                alt={coinData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center hidden">
                <span className="text-white font-bold text-sm">{coinData.symbol?.charAt(0) || 'C'}</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{coinData.name}</h1>
              <p className="text-gray-400 text-sm sm:text-base">{coinData.symbol?.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Price Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6">
            <h3 className="text-gray-400 text-sm mb-2">Current Price</h3>
            <div className="flex items-center space-x-2">
              <p className="text-2xl sm:text-3xl font-bold text-white">
                ${coinData.current_price?.toLocaleString() || 'N/A'}
              </p>
              <div className={`flex items-center space-x-1 ${
                (coinData.price_change_percentage_24h || 0) >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                {(coinData.price_change_percentage_24h || 0) >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium text-sm">
                  {Math.abs(coinData.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6">
            <h3 className="text-gray-400 text-sm mb-2">Market Cap</h3>
            <p className="text-xl sm:text-2xl font-bold text-white">
              ${((coinData.market_cap || 0) / 1e9).toFixed(1)}B
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6">
            <h3 className="text-gray-400 text-sm mb-2">24h Volume</h3>
            <p className="text-xl sm:text-2xl font-bold text-white">
              ${((coinData.total_volume || 0) / 1e6).toFixed(1)}M
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Price Chart</h2>
            </div>
            
            {/* Timeframe Selector */}
            <div className="flex bg-black/40 rounded-lg p-1">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={coinData.price_history || []}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => {
                    if (selectedTimeframe === '1D') {
                      return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                    return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Price']}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Price Statistics */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Price Statistics</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">All Time High</span>
                <span className="text-white font-medium">
                  ${coinData.ath?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">All Time Low</span>
                <span className="text-white font-medium">
                  ${coinData.atl?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Circulating Supply</span>
                <span className="text-white font-medium">
                  {coinData.circulating_supply?.toLocaleString() || 'N/A'} {coinData.symbol?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Supply</span>
                <span className="text-white font-medium">
                  {coinData.total_supply?.toLocaleString() || 'N/A'} {coinData.symbol?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Market Data</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Market Cap Rank</span>
                <span className="text-white font-medium">
                  #{coinData.market_cap_rank || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fully Diluted Valuation</span>
                <span className="text-white font-medium">
                  ${((coinData.fully_diluted_valuation || 0) / 1e9).toFixed(1)}B
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Max Supply</span>
                <span className="text-white font-medium">
                  {coinData.max_supply?.toLocaleString() || 'N/A'} {coinData.symbol?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Market Cap Change 24h</span>
                <span className={`font-medium ${
                  (coinData.market_cap_change_percentage_24h || 0) >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {Math.abs(coinData.market_cap_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
