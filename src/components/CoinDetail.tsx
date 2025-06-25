
import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CoinDetailProps {
  coinId: string;
  coinName: string;
  onBack: () => void;
}

interface CoinData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  priceHistory: number[];
}

export const CoinDetail = ({ coinId, coinName, onBack }: CoinDetailProps) => {
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');

  useEffect(() => {
    fetchCoinDetail();
  }, [coinId]);

  const fetchCoinDetail = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-coin-detail', {
        body: { coinId }
      });

      if (error) throw error;
      setCoinData(data);
    } catch (error) {
      console.error('Error fetching coin detail:', error);
      // Fallback data
      setCoinData({
        name: coinName,
        symbol: coinId.toUpperCase(),
        price: 50000,
        change24h: 2.5,
        marketCap: 1000000000,
        volume24h: 25000000,
        high24h: 51000,
        low24h: 49000,
        priceHistory: Array.from({ length: 24 }, (_, i) => 50000 + Math.random() * 2000 - 1000)
      });
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!coinData?.priceHistory) return null;

    const maxPrice = Math.max(...coinData.priceHistory);
    const minPrice = Math.min(...coinData.priceHistory);
    const range = maxPrice - minPrice;

    if (chartType === 'line') {
      const points = coinData.priceHistory.map((price, index) => {
        const x = (index / (coinData.priceHistory.length - 1)) * 100;
        const y = 100 - ((price - minPrice) / range) * 100;
        return `${x},${y}`;
      }).join(' ');

      return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Price Chart (24h)</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded text-sm ${
                  chartType === 'line'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('candle')}
                className={`px-3 py-1 rounded text-sm ${
                  chartType === 'candle'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                Candle
              </button>
            </div>
          </div>
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={coinData.change24h >= 0 ? "#10B981" : "#EF4444"}
                strokeWidth="0.5"
                points={points}
              />
            </svg>
          </div>
        </div>
      );
    } else {
      // Simplified candlestick chart representation
      return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Candlestick Chart (24h)</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded text-sm ${
                  chartType === 'line'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('candle')}
                className={`px-3 py-1 rounded text-sm ${
                  chartType === 'candle'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                Candle
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end space-x-1">
            {coinData.priceHistory.slice(0, 12).map((price, index) => {
              const height = ((price - minPrice) / range) * 100;
              const isPositive = index === 0 || price > coinData.priceHistory[index - 1];
              return (
                <div key={index} className="flex-1 flex flex-col justify-end">
                  <div
                    className={`w-full ${isPositive ? 'bg-green-500' : 'bg-red-500'} rounded-sm`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Error loading coin data</p>
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
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
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{coinData.name}</h1>
            <p className="text-gray-400">{coinData.symbol}</p>
          </div>
        </div>

        {/* Price Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Current Price</p>
                <p className="text-2xl font-bold text-white">
                  ${coinData.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              {coinData.change24h >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-400" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-400" />
              )}
              <div>
                <p className="text-gray-400 text-sm">24h Change</p>
                <p className={`text-2xl font-bold ${
                  coinData.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {coinData.change24h >= 0 ? '+' : ''}{coinData.change24h.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="text-2xl font-bold text-white">
                  ${(coinData.marketCap / 1e9).toFixed(1)}B
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">24h Volume</p>
                <p className="text-2xl font-bold text-white">
                  ${(coinData.volume24h / 1e6).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">24h Price Range</h3>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Low</p>
              <p className="text-xl font-bold text-red-400">${coinData.low24h.toLocaleString()}</p>
            </div>
            <div className="flex-1 mx-6">
              <div className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full relative">
                <div 
                  className="absolute w-3 h-3 bg-white rounded-full -mt-0.5 border-2 border-purple-500"
                  style={{ 
                    left: `${((coinData.price - coinData.low24h) / (coinData.high24h - coinData.low24h)) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">High</p>
              <p className="text-xl font-bold text-green-400">${coinData.high24h.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        {renderChart()}
      </div>
    </div>
  );
};
