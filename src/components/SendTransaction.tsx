import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useWallet } from '@/hooks/useWallet';
import { Send, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface SendTransactionProps {
  onClose?: () => void;
}

export const SendTransaction: React.FC<SendTransactionProps> = ({ onClose }) => {
  const { wallet, sendTransaction, pendingTransactions } = useWallet();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const validateAmount = (amount: string): boolean => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  };

  const getEthBalance = (): number => {
    const ethBalance = wallet?.balances.find(b => b.symbol === 'ETH');
    return ethBalance ? parseFloat(ethBalance.balance) : 0;
  };

  const handleSend = async () => {
    if (!wallet) {
      setError('Wallet not connected');
      return;
    }

    // Validate inputs
    if (!validateAddress(toAddress)) {
      setError('Invalid recipient address');
      return;
    }

    if (!validateAmount(amount)) {
      setError('Invalid amount');
      return;
    }

    const amountNum = parseFloat(amount);
    const balance = getEthBalance();

    if (amountNum > balance) {
      setError(`Insufficient balance. You have ${balance.toFixed(4)} ETH`);
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      const txHash = await sendTransaction({
        to: toAddress,
        amount: amount,
      });

      setSuccess(`Transaction sent! Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`);
      
      // Clear form
      setToAddress('');
      setAmount('');
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending && onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20">
        <CardHeader className="text-center border-b border-white/20">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
              <Send className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-white">
            Send Transaction
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Send ETH to another address
          </p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {/* Balance Display */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Available Balance</span>
              <span className="text-white font-semibold">{getEthBalance().toFixed(4)} ETH</span>
            </div>
          </div>

          {/* Recipient Address */}
          <div className="space-y-2">
            <Label htmlFor="toAddress" className="text-white">Recipient Address</Label>
            <Input
              id="toAddress"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              disabled={isSending}
            />
            {toAddress && !validateAddress(toAddress) && (
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Invalid Ethereum address</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              disabled={isSending}
            />
            {amount && !validateAmount(amount) && (
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Invalid amount</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">{success}</span>
              </div>
            </div>
          )}

          {/* Pending Transactions */}
          {pendingTransactions.length > 0 && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className="text-yellow-400 text-sm">
                  {pendingTransactions.length} transaction{pendingTransactions.length > 1 ? 's' : ''} pending...
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={
                isSending ||
                !validateAddress(toAddress) ||
                !validateAmount(amount) ||
                parseFloat(amount) > getEthBalance()
              }
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 