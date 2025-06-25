
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useCoinDetail } from '@/hooks/useCoinDetail';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, CandlestickChart } from 'recharts';

interface CoinDetailProps {
  coinId: string;
  coinName: string;
  onBack: () => void;
}

export const CoinDetail = ({ coinId, coinName, onBack }: CoinDetailProps) => {
  const { data: coinData, isLoading, error } = useCoinDetail(coinId);
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');

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
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transaction-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="bg-black/40 backdrop-blur-xl border border-white/20 text-white p-2 rounded-lg hover:bg-white/10 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-4">
            <img
              src={coinData.image}
              alt={coinData.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">{coinData.name}</h1>
              <p className="text-gray-400">{coinData.symbol.toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Current Price</h3>
            <div className="flex items-center space-x-2">
              <p className="text-3xl font-bold text-white">
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
                <span className="font-medium">
                  {Math.abs(coinData.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Market Cap</h3>
            <p className="text-2xl font-bold text-white">
              ${((coinData.market_cap || 0) / 1e9).toFixed(1)}B
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">24h Volume</h3>
            <p className="text-2xl font-bold text-white">
              ${((coinData.total_volume || 0) / 1e6).toFixed(1)}M
            </p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Price Chart</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  chartType === 'line'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Line Chart
              </button>
              <button
                onClick={() => setChartType('candle')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  chartType === 'candle'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Candlestick
              </button>
            </div>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={coinData.price_history || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
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
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">About {coinData.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-400 text-sm mb-2">All Time High</h3>
              <p className="text-white font-medium">
                ${coinData.ath?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm mb-2">All Time Low</h3>
              <p className="text-white font-medium">
                ${coinData.atl?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm mb-2">Circulating Supply</h3>
              <p className="text-white font-medium">
                {coinData.circulating_supply?.toLocaleString() || 'N/A'} {coinData.symbol.toUpperCase()}
              </p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm mb-2">Total Supply</h3>
              <p className="text-white font-medium">
                {coinData.total_supply?.toLocaleString() || 'N/A'} {coinData.symbol.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
