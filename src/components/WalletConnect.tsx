import React, { useState, useEffect } from 'react';
import { Wallet, LogOut, RefreshCw, TrendingUp, AlertCircle, Copy, ExternalLink, ChevronDown, ChevronUp, Send, History } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { usePortfolioAnalytics } from '@/hooks/usePortfolioAnalytics';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { SendTransaction } from './SendTransaction';
import { TransactionHistory } from './TransactionHistory';

export const WalletConnect = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  const { 
    wallet, 
    isConnected, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet,
    pendingTransactions
  } = useWallet();
  
  const { analytics, calculatePortfolioAnalytics, loading: analyticsLoading } = usePortfolioAnalytics();
  const { data: cryptoPrices } = useCryptoPrices();

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleAnalyzePortfolio = async () => {
    if (wallet && cryptoPrices) {
      const portfolioData = wallet.balances.map(balance => ({
        symbol: balance.symbol,
        amount: parseFloat(balance.balance),
        price: balance.price,
      }));
      
      await calculatePortfolioAnalytics(portfolioData, cryptoPrices);
    }
  };

  const copyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (wallet?.address) {
      window.open(`https://sepolia.etherscan.io/address/${wallet.address}`, '_blank');
    }
  };

  useEffect(() => {
    if (wallet && cryptoPrices) {
      handleAnalyzePortfolio();
    }
  }, [wallet, cryptoPrices]);

  // Debug logging for wallet state
  useEffect(() => {
    console.log('WalletConnect Debug:', {
      isConnected,
      wallet,
      walletAddress: wallet?.address,
      walletBalances: wallet?.balances,
      error
    });
  }, [isConnected, wallet, error]);

  if (!isConnected) {
    return (
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">Connect Your Wallet</h3>
          <p className="text-gray-300 text-sm mb-6">
            Connect your wallet to view your portfolio, track transactions, and get personalized insights.
          </p>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            </div>
          )}
          
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2 mx-auto"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg">Wallet Connected</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-gray-300 text-sm">
                {wallet?.address?.slice(0, 6)}...{wallet?.address?.slice(-4)}
              </span>
              <button
                onClick={copyAddress}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={openExplorer}
                className="text-gray-400 hover:text-white transition-colors"
                title="View on Etherscan"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <span className="text-green-400 text-xs">Address copied!</span>
            )}
          </div>
          <button
            onClick={disconnectWallet}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Network Info */}
        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-300 text-sm">Network</span>
              <div className="text-white font-medium">{wallet?.network}</div>
            </div>
            <div className="text-right">
              <span className="text-gray-300 text-sm">Chain ID</span>
              <div className="text-white font-medium">{wallet?.chainId}</div>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Total Portfolio Value</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-white font-bold text-2xl">
            ${wallet?.totalValue?.toLocaleString() || '0'}
          </div>
        </div>

        {/* Pending Transactions Alert */}
        {pendingTransactions.length > 0 && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mt-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
              <span className="text-yellow-400 text-sm">
                {pendingTransactions.length} transaction{pendingTransactions.length > 1 ? 's' : ''} pending confirmation
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Asset Balances */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold text-lg">Your Assets</h4>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="space-y-3">
          {wallet?.balances.map((balance, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{balance.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{balance.symbol}</div>
                    <div className="text-gray-400 text-sm">{balance.balance} {balance.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">${balance.usdValue.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">${balance.price.toLocaleString()}</div>
                </div>
              </div>
              
              {showDetails && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Balance:</span>
                      <div className="text-white">{balance.balance} {balance.symbol}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Price:</span>
                      <div className="text-white">${balance.price.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Value:</span>
                      <div className="text-white">${balance.usdValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Allocation:</span>
                      <div className="text-white">{((balance.usdValue / (wallet?.totalValue || 1)) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Analytics */}
      {analytics && (
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h4 className="text-white font-semibold text-lg mb-4">Portfolio Analytics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Risk Profile</div>
              <div className="text-white font-semibold capitalize">{analytics.riskProfile}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Sharpe Ratio</div>
              <div className="text-white font-semibold">{analytics.metrics.sharpeRatio.toFixed(2)}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Volatility</div>
              <div className="text-white font-semibold">{(analytics.metrics.volatility * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-400 text-sm">24h Change</div>
              <div className={`font-semibold ${analytics.metrics.totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analytics.metrics.totalChange24h >= 0 ? '+' : ''}{analytics.metrics.totalChange24h.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analytics?.recommendations && analytics.recommendations.length > 0 && (
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6">
          <h4 className="text-blue-400 font-semibold text-lg mb-3">AI Recommendations</h4>
          <div className="space-y-2">
            {analytics.recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-blue-300 text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => setShowSendModal(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>Send ETH</span>
        </button>
        
        <button
          onClick={() => setShowHistoryModal(true)}
          className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
        >
          <History className="w-4 h-4" />
          <span>Transaction History</span>
        </button>
        
        <button
          onClick={handleAnalyzePortfolio}
          disabled={analyticsLoading}
          className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {analyticsLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              <span>Refresh Analytics</span>
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      {showSendModal && (
        <SendTransaction onClose={() => setShowSendModal(false)} />
      )}
      
      {showHistoryModal && (
        <TransactionHistory onClose={() => setShowHistoryModal(false)} />
      )}
    </div>
  );
}; 