
import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Users, Zap, Globe, Shield } from 'lucide-react';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';

export const BlockchainHub = () => {
  const { data: cryptoData } = useCryptoPrices();
  const [blockchainStats, setBlockchainStats] = useState({
    totalTransactions: 0,
    activeNodes: 0,
    networkHashrate: 0,
    avgBlockTime: 0
  });

  useEffect(() => {
    // Simulate real blockchain data
    const interval = setInterval(() => {
      setBlockchainStats({
        totalTransactions: Math.floor(Math.random() * 1000000) + 850000000,
        activeNodes: Math.floor(Math.random() * 1000) + 15000,
        networkHashrate: Math.floor(Math.random() * 100) + 400,
        avgBlockTime: Math.floor(Math.random() * 5) + 10
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const blockchainNetworks = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      status: 'Active',
      tps: '7',
      consensus: 'Proof of Work',
      nodes: '15,000+',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      status: 'Active',
      tps: '15',
      consensus: 'Proof of Stake',
      nodes: '8,000+',
      color: 'from-blue-500 to-purple-500'
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      status: 'Active',
      tps: '3,000',
      consensus: 'Proof of History',
      nodes: '2,000+',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Cardano',
      symbol: 'ADA',
      status: 'Active',
      tps: '250',
      consensus: 'Proof of Stake',
      nodes: '3,000+',
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  const recentBlocks = [
    { height: 820145, hash: '0x1a2b3c...', txCount: 2847, timestamp: '2 min ago', size: '1.2 MB' },
    { height: 820144, hash: '0x4d5e6f...', txCount: 3156, timestamp: '4 min ago', size: '1.4 MB' },
    { height: 820143, hash: '0x7g8h9i...', txCount: 2934, timestamp: '6 min ago', size: '1.1 MB' },
    { height: 820142, hash: '0xjklmno...', txCount: 3287, timestamp: '8 min ago', size: '1.5 MB' },
    { height: 820141, hash: '0xpqrstu...', txCount: 2456, timestamp: '10 min ago', size: '0.9 MB' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Blockchain Technology Hub</h1>
          <p className="text-gray-300">Real-time blockchain network data and analytics</p>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-8 h-8 text-green-400" />
              <h3 className="text-white font-semibold">Total Transactions</h3>
            </div>
            <p className="text-3xl font-bold text-white">{formatNumber(blockchainStats.totalTransactions)}</p>
            <p className="text-green-400 text-sm mt-2">+2.4% from yesterday</p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <h3 className="text-white font-semibold">Active Nodes</h3>
            </div>
            <p className="text-3xl font-bold text-white">{formatNumber(blockchainStats.activeNodes)}</p>
            <p className="text-blue-400 text-sm mt-2">+0.8% network growth</p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-8 h-8 text-yellow-400" />
              <h3 className="text-white font-semibold">Network Hashrate</h3>
            </div>
            <p className="text-3xl font-bold text-white">{blockchainStats.networkHashrate} EH/s</p>
            <p className="text-yellow-400 text-sm mt-2">Mining power increasing</p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-8 h-8 text-purple-400" />
              <h3 className="text-white font-semibold">Avg Block Time</h3>
            </div>
            <p className="text-3xl font-bold text-white">{blockchainStats.avgBlockTime}m</p>
            <p className="text-purple-400 text-sm mt-2">Network stable</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Blockchain Networks */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Blockchain Networks</h2>
            <div className="space-y-4">
              {blockchainNetworks.map((network) => (
                <div key={network.symbol} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${network.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{network.symbol[0]}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{network.name}</h3>
                        <p className="text-gray-400 text-sm">{network.symbol}</p>
                      </div>
                    </div>
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs">
                      {network.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">TPS</p>
                      <p className="text-white font-medium">{network.tps}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Consensus</p>
                      <p className="text-white font-medium text-xs">{network.consensus}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Nodes</p>
                      <p className="text-white font-medium">{network.nodes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Blocks */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Blocks</h2>
            <div className="space-y-3">
              {recentBlocks.map((block) => (
                <div key={block.height} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">#{block.height}</span>
                    <span className="text-gray-400 text-sm">{block.timestamp}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-400">Hash</p>
                      <p className="text-blue-400 font-mono">{block.hash}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Transactions</p>
                      <p className="text-white">{block.txCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Size</p>
                      <p className="text-white">{block.size}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Contract Analytics */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Smart Contract Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Contract Security</h3>
              <p className="text-gray-300 text-sm">Advanced security auditing and vulnerability detection</p>
              <div className="mt-4 bg-green-900/30 text-green-400 px-4 py-2 rounded-lg text-sm">
                98.7% Security Score
              </div>
            </div>
            
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Gas Optimization</h3>
              <p className="text-gray-300 text-sm">Real-time gas price tracking and optimization suggestions</p>
              <div className="mt-4 bg-blue-900/30 text-blue-400 px-4 py-2 rounded-lg text-sm">
                35 Gwei Average
              </div>
            </div>
            
            <div className="text-center">
              <Activity className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Network Activity</h3>
              <p className="text-gray-300 text-sm">Live monitoring of network congestion and performance</p>
              <div className="mt-4 bg-purple-900/30 text-purple-400 px-4 py-2 rounded-lg text-sm">
                High Activity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
