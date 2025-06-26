import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TransactionHistoryProps {
  onClose?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onClose }) => {
  const { wallet, pendingTransactions } = useWallet();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  const copyToClipboard = async (text: string, hash: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const openExplorer = (hash: string) => {
    window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toFixed(4);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const isOutgoing = (transaction: any) => {
    return transaction.from.toLowerCase() === wallet?.address?.toLowerCase();
  };

  const transactions = wallet?.transactions || [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20">
        <CardHeader className="border-b border-white/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-white">
              Transaction History
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>
          {pendingTransactions.length > 0 && (
            <div className="mt-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm">
                  {pendingTransactions.length} transaction{pendingTransactions.length > 1 ? 's' : ''} pending confirmation
                </span>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="max-h-[60vh] overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <ArrowUpRight className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <h3 className="text-white font-medium mb-2">No transactions yet</h3>
                <p className="text-gray-400 text-sm">
                  Your transaction history will appear here once you make your first transaction.
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {transactions.map((tx, index) => {
                  const outgoing = isOutgoing(tx);
                  const isExpanded = expandedTx === tx.hash;
                  
                  return (
                    <div
                      key={tx.hash}
                      className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
                    >
                      {/* Transaction Header */}
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedTx(isExpanded ? null : tx.hash)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              outgoing ? 'bg-red-500/20' : 'bg-green-500/20'
                            }`}>
                              {outgoing ? (
                                <ArrowUpRight className="w-4 h-4 text-red-400" />
                              ) : (
                                <ArrowDownLeft className="w-4 h-4 text-green-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {outgoing ? 'Sent' : 'Received'} {formatAmount(tx.value)} ETH
                              </div>
                              <div className="text-gray-400 text-sm">
                                {formatTimestamp(tx.timestamp)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(tx.status)}>
                              {getStatusIcon(tx.status)}
                              <span className="ml-1 capitalize">{tx.status}</span>
                            </Badge>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-white/10 p-4 bg-white/5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Transaction Hash</span>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-white font-mono">
                                  {formatAddress(tx.hash)}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(tx.hash, tx.hash)}
                                  className="text-gray-400 hover:text-white"
                                  title="Copy hash"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => openExplorer(tx.hash)}
                                  className="text-gray-400 hover:text-white"
                                  title="View on Etherscan"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                              {copiedHash === tx.hash && (
                                <span className="text-green-400 text-xs">Copied!</span>
                              )}
                            </div>
                            
                            <div>
                              <span className="text-gray-400">Amount</span>
                              <div className="text-white font-medium">
                                {formatAmount(tx.value)} ETH
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-gray-400">From</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-mono">
                                  {formatAddress(tx.from)}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(tx.from, `from-${tx.hash}`)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-gray-400">To</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-mono">
                                  {formatAddress(tx.to)}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(tx.to, `to-${tx.hash}`)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-gray-400">Gas Used</span>
                              <div className="text-white">
                                {parseInt(tx.gasUsed).toLocaleString()}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-gray-400">Gas Price</span>
                              <div className="text-white">
                                {parseInt(tx.gasPrice) / 1e9} Gwei
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 