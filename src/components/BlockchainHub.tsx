
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Blocks, 
  Shield, 
  Zap, 
  Globe, 
  TrendingUp, 
  Lock,
  Database,
  Network
} from 'lucide-react';

export const BlockchainHub = () => {
  const blockchainFeatures = [
    {
      icon: <Blocks className="w-8 h-8" />,
      title: "Decentralized Networks",
      description: "Understanding how blockchain creates trustless, distributed systems",
      color: "bg-blue-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Smart Contracts",
      description: "Self-executing contracts with terms directly written into code",
      color: "bg-green-500"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Cryptographic Security",
      description: "Advanced encryption methods securing blockchain transactions",
      color: "bg-purple-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Distributed Ledgers",
      description: "Immutable record-keeping across multiple nodes",
      color: "bg-orange-500"
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Consensus Mechanisms",
      description: "Proof of Work, Proof of Stake, and other validation methods",
      color: "bg-red-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "DeFi Protocols",
      description: "Decentralized Finance revolutionizing traditional banking",
      color: "bg-yellow-500"
    }
  ];

  const popularBlockchains = [
    { name: "Ethereum", symbol: "ETH", type: "Smart Contract Platform" },
    { name: "Bitcoin", symbol: "BTC", type: "Digital Currency" },
    { name: "Binance Smart Chain", symbol: "BSC", type: "Fast & Low Cost" },
    { name: "Polygon", symbol: "MATIC", type: "Layer 2 Scaling" },
    { name: "Solana", symbol: "SOL", type: "High Performance" },
    { name: "Cardano", symbol: "ADA", type: "Research-Based" }
  ];

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-800 to-slate-900 min-h-full">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Blocks className="w-10 h-10 text-purple-400" />
          Blockchain Technology Hub
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Explore the revolutionary world of blockchain technology, from basic concepts to advanced implementations
        </p>
      </div>

      {/* Blockchain Features */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-400" />
          Core Blockchain Technologies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blockchainFeatures.map((feature, index) => (
            <Card key={index} className="bg-black/40 backdrop-blur-xl border-white/20 hover:bg-black/60 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-white mb-3`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Blockchains */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-400" />
          Popular Blockchain Networks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularBlockchains.map((blockchain, index) => (
            <Card key={index} className="bg-black/40 backdrop-blur-xl border-white/20 hover:bg-black/60 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{blockchain.name}</h3>
                  <Badge variant="outline" className="text-purple-400 border-purple-400">
                    {blockchain.symbol}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm">{blockchain.type}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Educational Resources */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">Educational Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Beginner Guides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-gray-300 text-sm space-y-1">
                <p>• What is Blockchain Technology?</p>
                <p>• Understanding Cryptocurrency Basics</p>
                <p>• How to Set Up Your First Wallet</p>
                <p>• Introduction to DeFi</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Advanced Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-gray-300 text-sm space-y-1">
                <p>• Smart Contract Development</p>
                <p>• Blockchain Security Best Practices</p>
                <p>• NFT Creation and Trading</p>
                <p>• Layer 2 Scaling Solutions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
