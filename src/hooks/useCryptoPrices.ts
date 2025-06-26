import { useQuery } from '@tanstack/react-query';

// Mock crypto data for fallback
const mockCryptoData = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 43250.67,
    change24h: 2.34,
    marketCap: 850000000000,
    volume: 25000000000,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2650.45,
    change24h: -1.23,
    marketCap: 320000000000,
    volume: 18000000000,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
  },
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    price: 315.78,
    change24h: 0.87,
    marketCap: 48000000000,
    volume: 1200000000,
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501750',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 98.45,
    change24h: 5.67,
    marketCap: 42000000000,
    volume: 2800000000,
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1696504756',
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.52,
    change24h: -0.45,
    marketCap: 18000000000,
    volume: 450000000,
    image: 'https://assets.coingecko.com/coins/images/975/large/Cardano.png?1696502090',
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    price: 0.58,
    change24h: 1.23,
    marketCap: 32000000000,
    volume: 1200000000,
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501447',
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    price: 7.23,
    change24h: -2.15,
    marketCap: 9000000000,
    volume: 280000000,
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot_new_logo.png?1696512458',
  },
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.085,
    change24h: 3.45,
    marketCap: 12000000000,
    volume: 450000000,
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1696501409',
  },
  {
    id: 'avalanche-2',
    name: 'Avalanche',
    symbol: 'AVAX',
    price: 35.67,
    change24h: 4.12,
    marketCap: 13000000000,
    volume: 680000000,
    image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1696512369',
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    price: 15.89,
    change24h: -0.78,
    marketCap: 9000000000,
    volume: 420000000,
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink.png?1696502009',
  },
];

const fetchCryptoPrices = async () => {
  try {
    // Try to fetch from CoinGecko API first
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&locale=en'
    );

    if (response.ok) {
      const data = await response.json();
      return data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        image: coin.image,
      }));
    } else {
      console.warn('CoinGecko API failed, using mock data');
      return mockCryptoData;
    }
  } catch (error) {
    console.warn('Error fetching crypto prices, using mock data:', error);
    return mockCryptoData;
  }
};

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
    retry: 3, // Retry 3 times on failure
    retryDelay: 1000, // Wait 1 second between retries
  });
};
