import { useState, useEffect } from 'react';
import { config } from '@/lib/config';

interface WalletBalance {
  symbol: string;
  balance: string;
  usdValue: number;
  price: number;
}

interface WalletTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'send' | 'receive';
}

interface WalletData {
  address: string;
  balances: WalletBalance[];
  transactions: WalletTransaction[];
  totalValue: number;
  network: string;
  chainId: number;
}

interface SendTransactionParams {
  to: string;
  amount: string;
  gasLimit?: string;
  gasPrice?: string;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingTransactions, setPendingTransactions] = useState<string[]>([]);
  const [connectionRequested, setConnectionRequested] = useState(false);

  // Persistent connection check
  useEffect(() => {
    const checkPersistentConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            console.log('Found persistent connection:', accounts[0]);
            setIsConnected(true);
            await fetchWalletData(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking persistent connection:', error);
        }
      }
    };

    checkPersistentConnection();
  }, []);

  const connectWallet = async () => {
    if (!config.features.walletConnectEnabled) {
      setError('Wallet features are disabled');
      return;
    }

    // Prevent duplicate connection requests
    if (isConnecting || connectionRequested) {
      console.log('Connection already in progress, skipping...');
      return;
    }

    setIsConnecting(true);
    setConnectionRequested(true);
    setError(null);

    try {
      console.log('Starting wallet connection process...');
      
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to use wallet features.');
      }

      console.log('MetaMask detected, checking network...');

      // Check if we're on the correct network (Sepolia)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const targetChainId = '0xaa36a7'; // Sepolia chain ID in hex

      console.log('Current chain ID:', chainId, 'Target chain ID:', targetChainId);

      if (chainId !== targetChainId) {
        console.log('Switching to Sepolia network...');
        try {
          // Try to switch to Sepolia network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }],
          });
          console.log('Successfully switched to Sepolia network');
        } catch (switchError: any) {
          console.log('Switch error:', switchError);
          // If the network doesn't exist in MetaMask, add it
          if (switchError.code === 4902) {
            console.log('Adding Sepolia network to MetaMask...');
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: targetChainId,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: [config.blockchain.rpcUrl],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              }],
            });
            console.log('Successfully added Sepolia network');
          } else {
            throw new Error('Failed to switch to Sepolia network. Please switch manually in MetaMask.');
          }
        }
      } else {
        console.log('Already on Sepolia network');
      }

      console.log('Requesting account access...');

      // Check if already connected first
      let accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length === 0) {
        // Only request accounts if not already connected
        console.log('No accounts found, requesting access...');
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
      } else {
        console.log('Already connected to accounts:', accounts);
      }

      console.log('Accounts received:', accounts);

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask and try again.');
      }

      const address = accounts[0];
      console.log('Selected address:', address);
      
      setIsConnected(true);
      
      console.log('MetaMask connected, address:', address);
      console.log('Setting isConnected to true');
      
      // Fetch wallet data
      console.log('Starting to fetch wallet data...');
      await fetchWalletData(address);
      
      console.log('Wallet connected successfully:', address);
      
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      
      // Handle specific MetaMask errors
      if (err.code === -32002) {
        setError('MetaMask connection request already pending. Please check MetaMask and approve the connection.');
      } else if (err.code === 4001) {
        setError('Connection rejected by user. Please try again and approve the connection in MetaMask.');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
      
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
      setConnectionRequested(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setIsConnected(false);
    setError(null);
    setPendingTransactions([]);
    setConnectionRequested(false);
    console.log('Wallet disconnected');
  };

  const sendTransaction = async (params: SendTransactionParams) => {
    if (!wallet || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const { to, amount, gasLimit = '21000', gasPrice } = params;
      
      // Convert amount to wei
      const valueInWei = '0x' + (parseFloat(amount) * 1e18).toString(16);
      
      const transactionParameters: any = {
        to,
        from: wallet.address,
        value: valueInWei,
        gas: gasLimit,
      };

      if (gasPrice) {
        transactionParameters.gasPrice = gasPrice;
      }

      console.log('Sending transaction with parameters:', transactionParameters);

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log('Transaction sent:', txHash);
      
      // Add to pending transactions
      setPendingTransactions(prev => [...prev, txHash]);
      
      // Add transaction to wallet history
      const newTransaction: WalletTransaction = {
        hash: txHash,
        from: wallet.address,
        to,
        value: amount,
        gasUsed: gasLimit,
        gasPrice: gasPrice || '20000000000',
        timestamp: Date.now(),
        status: 'pending',
        type: 'send',
      };

      setWallet(prev => prev ? {
        ...prev,
        transactions: [newTransaction, ...prev.transactions]
      } : null);

      // Wait for confirmation
      await waitForTransactionConfirmation(txHash);
      
      return txHash;
    } catch (err: any) {
      console.error('Transaction failed:', err);
      
      // Handle specific transaction errors
      if (err.code === 4001) {
        throw new Error('Transaction rejected by user');
      } else if (err.code === -32603) {
        throw new Error('Transaction failed: Insufficient funds or gas');
      } else {
        throw new Error('Transaction failed: ' + err.message);
      }
    }
  };

  const waitForTransactionConfirmation = async (txHash: string) => {
    try {
      console.log('Waiting for transaction confirmation:', txHash);
      
      // Wait for transaction to be mined
      let receipt = null;
      while (!receipt) {
        try {
          receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
          });
          
          if (!receipt) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
          }
        } catch (error) {
          console.warn('Error checking transaction receipt:', error);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      console.log('Transaction confirmed:', receipt);
      
      // Update transaction status
      setWallet(prev => prev ? {
        ...prev,
        transactions: prev.transactions.map(tx => 
          tx.hash === txHash ? { ...tx, status: 'confirmed' } : tx
        )
      } : null);
      
      // Remove from pending transactions
      setPendingTransactions(prev => prev.filter(hash => hash !== txHash));
      
      // Refresh wallet data
      if (wallet) {
        await fetchWalletData(wallet.address);
      }
      
    } catch (error) {
      console.error('Error waiting for transaction confirmation:', error);
      
      // Update transaction status to failed
      setWallet(prev => prev ? {
        ...prev,
        transactions: prev.transactions.map(tx => 
          tx.hash === txHash ? { ...tx, status: 'failed' } : tx
        )
      } : null);
      
      // Remove from pending transactions
      setPendingTransactions(prev => prev.filter(hash => hash !== txHash));
    }
  };

  const getTransactionHistory = async (address: string) => {
    try {
      // In a real implementation, you would fetch from a blockchain API
      // For now, we'll use mock data
      const mockTransactions: WalletTransaction[] = [
        {
          hash: '0x123...abc',
          from: '0x456...def',
          to: address,
          value: '0.1',
          gasUsed: '21000',
          gasPrice: '20000000000',
          timestamp: Date.now() - 3600000,
          status: 'confirmed',
          type: 'receive',
        },
        {
          hash: '0x789...ghi',
          from: address,
          to: '0xabc...def',
          value: '0.05',
          gasUsed: '21000',
          gasPrice: '20000000000',
          timestamp: Date.now() - 7200000,
          status: 'confirmed',
          type: 'send',
        },
      ];

      return mockTransactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  };

  const fetchWalletData = async (address: string) => {
    try {
      console.log('Fetching wallet data for address:', address);
      console.log('Using RPC URL:', config.blockchain.rpcUrl);
      
      // Set a basic wallet object immediately to prevent "Not loaded" state
      const basicWalletData: WalletData = {
        address,
        balances: [
          {
            symbol: 'ETH',
            balance: '0.0000',
            usdValue: 0,
            price: 2000,
          }
        ],
        transactions: [],
        totalValue: 0,
        network: 'Sepolia Testnet',
        chainId: config.blockchain.chainId,
      };
      
      // Set the wallet immediately with the address
      setWallet(basicWalletData);
      console.log('Set basic wallet data with address:', address);
      
      // Try to get balance using MetaMask's provider first
      let ethBalance = 0;
      try {
        console.log('Trying to get balance using MetaMask provider...');
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        ethBalance = parseInt(balanceHex, 16) / 1e18;
        console.log('Balance from MetaMask provider:', ethBalance, 'ETH');
      } catch (metamaskError) {
        console.warn('Failed to get balance from MetaMask provider:', metamaskError);
        
        // Fallback to RPC endpoints
        const rpcEndpoints = [
          'https://ethereum-sepolia.publicnode.com',
          'https://sepolia.drpc.org',
          'https://rpc.sepolia.org',
          config.blockchain.rpcUrl
        ];
        
        let balanceData = null;
        let lastError = null;
        
        for (const rpcUrl of rpcEndpoints) {
          try {
            console.log('Trying RPC endpoint:', rpcUrl);
            
            const balanceResponse = await fetch(rpcUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [address, 'latest'],
                id: 1,
              }),
            });

            if (!balanceResponse.ok) {
              throw new Error(`Failed to fetch balance from RPC: ${balanceResponse.status} ${balanceResponse.statusText}`);
            }

            balanceData = await balanceResponse.json();
            
            if (balanceData.error) {
              throw new Error(`RPC Error: ${balanceData.error.message}`);
            }
            
            console.log('Successfully connected to RPC:', rpcUrl);
            console.log('Balance response:', balanceData);
            ethBalance = parseInt(balanceData.result, 16) / 1e18;
            console.log('Balance from RPC:', ethBalance, 'ETH');
            break; // Success, exit the loop
            
          } catch (error) {
            console.warn(`Failed to connect to ${rpcUrl}:`, error);
            lastError = error;
            continue; // Try next endpoint
          }
        }
        
        if (ethBalance === 0 && lastError) {
          console.warn('All RPC endpoints failed, using fallback data');
          console.warn('Last error:', lastError);
          // Keep the basic wallet data we set earlier
          return;
        }
      }

      console.log('Final ETH Balance:', ethBalance);

      // If balance is still 0 and we're in development, use a test balance
      if (ethBalance === 0 && process.env.NODE_ENV === 'development') {
        console.log('Using test balance for development');
        ethBalance = 0.05; // Test balance
      }

      // Mock data for demonstration - in production, you'd fetch real token balances
      const mockBalances: WalletBalance[] = [
        {
          symbol: 'ETH',
          balance: ethBalance.toFixed(4),
          usdValue: ethBalance * 2000, // Mock ETH price
          price: 2000,
        },
        {
          symbol: 'USDC',
          balance: '1000.00',
          usdValue: 1000,
          price: 1,
        },
        {
          symbol: 'UNI',
          balance: '50.00',
          usdValue: 50 * 5, // Mock UNI price
          price: 5,
        },
      ];

      const totalValue = mockBalances.reduce((sum, token) => sum + token.usdValue, 0);

      // Fetch transaction history
      const transactions = await getTransactionHistory(address);

      const walletData: WalletData = {
        address,
        balances: mockBalances,
        transactions,
        totalValue,
        network: 'Sepolia Testnet',
        chainId: config.blockchain.chainId,
      };

      setWallet(walletData);
      console.log('Wallet data fetched successfully:', walletData);
      console.log('Wallet state set with address:', walletData.address);

    } catch (err: any) {
      console.error('Error fetching wallet data:', err);
      setError('Failed to fetch wallet data: ' + err.message);
      
      // Ensure we always have a wallet object with the address
      const fallbackWalletData: WalletData = {
        address,
        balances: [
          {
            symbol: 'ETH',
            balance: '0.0000',
            usdValue: 0,
            price: 2000,
          }
        ],
        transactions: [],
        totalValue: 0,
        network: 'Sepolia Testnet',
        chainId: config.blockchain.chainId,
      };
      
      setWallet(fallbackWalletData);
      console.log('Set fallback wallet data due to RPC error, address:', address);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('Accounts changed:', accounts);
        if (accounts.length === 0) {
          // Only disconnect if user manually disconnected
          // Don't auto-disconnect for network changes
          console.log('User manually disconnected wallet');
        } else {
          console.log('Account changed to:', accounts[0]);
          fetchWalletData(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        console.log('Chain changed:', chainId);
        // Don't reload the page, just update the wallet data
        if (wallet) {
          fetchWalletData(wallet.address);
        }
      };

      const handleConnect = (connectInfo: any) => {
        console.log('Wallet connected:', connectInfo);
        setIsConnected(true);
      };

      const handleDisconnect = (disconnectInfo: any) => {
        console.log('Wallet disconnected:', disconnectInfo);
        // Only disconnect if it's a manual disconnect
        if (disconnectInfo.code === 4001) {
          disconnectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('connect', handleConnect);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', handleConnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [wallet]);

  return {
    wallet,
    isConnected,
    isConnecting,
    error,
    pendingTransactions,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    fetchWalletData,
    getTransactionHistory,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
} 