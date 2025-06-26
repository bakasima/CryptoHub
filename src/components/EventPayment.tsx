import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../hooks/useAuth';
import { useWallet } from '../hooks/useWallet';
import { useTickets } from '../hooks/useTickets';
import { TicketComponent } from './Ticket';
import { supabase } from '../integrations/supabase/client';

interface EventPaymentProps {
  eventId: string;
  price: number;
  currency: string;
  adminWalletAddress: string;
  eventData: {
    title: string;
    date: string;
    time: string;
    location: string;
  };
  onClose: () => void;
}

export const EventPayment: React.FC<EventPaymentProps> = ({
  eventId,
  price,
  currency,
  adminWalletAddress,
  eventData,
  onClose
}) => {
  const { user } = useAuth();
  const { wallet, isConnected, isConnecting, error: walletError, connectWallet, sendTransaction } = useWallet();
  const { createTicket } = useTickets();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<any>(null);

  // Handle wallet errors
  useEffect(() => {
    if (walletError) {
      setError(walletError);
    }
  }, [walletError]);

  const handleConnectWallet = async () => {
    try {
      setError(null);
      await connectWallet();
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet. Please try again.');
    }
  };

  const getWalletBalance = (curr: string) => {
    if (!wallet) return 0;
    const balance = wallet.balances.find(b => b.symbol === curr);
    return balance ? parseFloat(balance.balance) : 0;
  };

  const handlePayment = async () => {
    if (!user) {
      setError('Please log in to make a payment');
      return;
    }

    if (!isConnected || !wallet) {
      setError('Please connect your wallet first');
      return;
    }

    const currentBalance = getWalletBalance(currency);
    if (currentBalance < price) {
      setError(`Insufficient ${currency} balance. You need ${price} ${currency}, but have ${currentBalance} ${currency}`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Convert price to wei if it's ETH
      let amountInWei = price;
      if (currency === 'ETH') {
        amountInWei = price * 1e18; // Convert to wei
      }

      // Send the transaction to the admin's wallet
      const txHash = await sendTransaction(adminWalletAddress, amountInWei.toString());
      
      setTransactionHash(txHash);

      // Record the payment in the database
      try {
        const { error: dbError } = await supabase
          .from('event_registrations')
          .insert({
            event_id: eventId,
            user_id: user.id,
            payment_amount: price,
            payment_currency: currency,
            payment_status: 'completed',
            transaction_hash: txHash,
            wallet_address: wallet.address
          });

        if (dbError) {
          console.error('Database error:', dbError);
        }
      } catch (dbError) {
        console.error('Failed to record payment:', dbError);
      }

      // Create ticket after successful payment
      try {
        const ticket = await createTicket(
          eventId,
          user.id,
          user.user_metadata?.full_name || user.email || 'Unknown',
          user.email || '',
          eventData,
          price,
          currency
        );

        if (ticket) {
          setCreatedTicket(ticket);
          setShowTicket(true);
        }
      } catch (ticketError) {
        console.error('Failed to create ticket:', ticketError);
        // Still show success even if ticket creation fails
        setSuccess(true);
      }

    } catch (error: any) {
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showTicket && createdTicket) {
    return (
      <TicketComponent 
        ticket={{
          ...createdTicket,
          transaction_hash: transactionHash
        }}
        onClose={() => {
          setShowTicket(false);
          onClose();
        }}
        onBack={() => {
          setShowTicket(false);
          setCreatedTicket(null);
          setTransactionHash(null);
          onClose(); // Close the payment modal and return to events
        }}
        showBackButton={true}
      />
    );
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Your payment of {price} {currency} has been processed successfully.
              </p>
              {transactionHash && (
                <p className="text-sm text-gray-500">
                  Transaction: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                </p>
              )}
            </div>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Event Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Event Details */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{eventData.title}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📅 {new Date(eventData.date).toLocaleDateString()}</p>
              <p>🕒 {eventData.time}</p>
              <p>📍 {eventData.location}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Event Price:</span>
              <Badge variant="outline" className="text-lg">
                {price} {currency}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              Payment will be sent to: {adminWalletAddress.slice(0, 10)}...{adminWalletAddress.slice(-8)}
            </div>
          </div>

          {/* Wallet Status */}
          {!isConnected ? (
            <div className="space-y-3">
              <div className="text-center text-gray-600">
                Please connect your wallet first
              </div>
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wallet Connected</span>
                  <Badge variant="secondary" className="text-xs">✅</Badge>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Address: {wallet?.address ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-8)}` : 'Loading...'}
                </div>
                <div className="text-sm text-gray-600">
                  {currency} Balance: {getWalletBalance(currency).toFixed(4)} {currency}
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing || getWalletBalance(currency) < price}
                className="w-full"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ${price} ${currency}`}
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Close Button */}
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}; 