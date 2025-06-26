import React, { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Wallet } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { useWallet } from '@/hooks/useWallet';

export const AITradingAssistant = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'analysis'>('insights');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { insights, loading, generateInsights, generateTradingInsights } = useAIInsights();
  const { data: cryptoPrices } = useCryptoPrices();
  const { wallet } = useWallet();

  const handleGenerateInsights = async () => {
    if (!cryptoPrices) return;
    
    setIsGenerating(true);
    try {
      await generateInsights(
        'Crypto market analysis and trading opportunities',
        ['Bitcoin', 'Ethereum', 'DeFi', 'NFT'],
        cryptoPrices,
        wallet ? {
          totalValue: wallet.totalValue,
          assets: wallet.balances.map(b => ({ symbol: b.symbol, value: b.usdValue }))
        } : undefined
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTradingRecommendations = async () => {
    if (!cryptoPrices || !wallet) return;
    
    setIsGenerating(true);
    try {
      const portfolio = wallet.balances.map(b => ({
        symbol: b.symbol,
        value: b.usdValue,
        allocation: (b.usdValue / wallet.totalValue) * 100
      }));
      
      const marketData = cryptoPrices.slice(0, 10).map(c => ({
        symbol: c.symbol,
        price: c.price,
        change24h: c.change24h,
        marketCap: c.marketCap
      }));
      
      const recommendations = await generateTradingInsights(portfolio, marketData);
      console.log('Trading recommendations:', recommendations);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-white font-semibold text-lg">AI Trading Assistant</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              activeTab === 'insights' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              activeTab === 'recommendations' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              activeTab === 'analysis' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            Analysis
          </button>
        </div>
      </div>

      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Market Insights</h4>
            <button
              onClick={handleGenerateInsights}
              disabled={loading || isGenerating}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm flex items-center space-x-2"
            >
              {loading || isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4" />
                  <span>Generate Insights</span>
                </>
              )}
            </button>
          </div>

          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.slice(0, 5).map((insight) => (
                <div key={insight.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {insight.type === 'trading' && <Target className="w-4 h-4 text-blue-400" />}
                      {insight.type === 'market' && <TrendingUp className="w-4 h-4 text-green-400" />}
                      {insight.type === 'portfolio' && <TrendingDown className="w-4 h-4 text-yellow-400" />}
                      {insight.type === 'event' && <Lightbulb className="w-4 h-4 text-purple-400" />}
                      <span className="text-white font-medium text-sm capitalize">{insight.type}</span>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {(insight.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                  <h5 className="text-white font-medium mb-2">{insight.title}</h5>
                  <p className="text-gray-300 text-sm mb-3">{insight.content}</p>
                  {insight.actionable && insight.action && (
                    <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">Actionable</span>
                      </div>
                      <p className="text-blue-300 text-sm">{insight.action}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-sm">
                Click "Generate Insights" to get AI-powered market analysis and trading opportunities.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Trading Recommendations</h4>
            <button
              onClick={handleGenerateTradingRecommendations}
              disabled={!wallet || loading || isGenerating}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm flex items-center space-x-2"
            >
              {loading || isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  <span>Get Recommendations</span>
                </>
              )}
            </button>
          </div>

          {!wallet ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-sm">
                Connect your wallet to get personalized trading recommendations based on your portfolio.
              </p>
            </div>
          ) : (
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Disclaimer</span>
              </div>
              <p className="text-blue-300 text-sm">
                AI trading recommendations are for informational purposes only and should not be considered as financial advice. 
                Always do your own research and consider consulting with a financial advisor before making investment decisions.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-4">
          <h4 className="text-white font-medium">Market Analysis</h4>
          
          {cryptoPrices && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h5 className="text-white font-medium mb-3">Top Gainers (24h)</h5>
                <div className="space-y-2">
                  {cryptoPrices
                    .filter(c => c.change24h > 0)
                    .sort((a, b) => b.change24h - a.change24h)
                    .slice(0, 3)
                    .map((crypto) => (
                      <div key={crypto.symbol} className="flex items-center justify-between">
                        <span className="text-white text-sm">{crypto.symbol}</span>
                        <span className="text-green-400 text-sm">+{crypto.change24h.toFixed(2)}%</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h5 className="text-white font-medium mb-3">Top Losers (24h)</h5>
                <div className="space-y-2">
                  {cryptoPrices
                    .filter(c => c.change24h < 0)
                    .sort((a, b) => a.change24h - b.change24h)
                    .slice(0, 3)
                    .map((crypto) => (
                      <div key={crypto.symbol} className="flex items-center justify-between">
                        <span className="text-white text-sm">{crypto.symbol}</span>
                        <span className="text-red-400 text-sm">{crypto.change24h.toFixed(2)}%</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Risk Management</span>
            </div>
            <ul className="text-yellow-300 text-sm space-y-1">
              <li>• Never invest more than you can afford to lose</li>
              <li>• Diversify your portfolio across different assets</li>
              <li>• Set stop-loss orders to limit potential losses</li>
              <li>• Keep track of your trading performance</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}; 