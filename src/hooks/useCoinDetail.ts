import { useQuery } from '@tanstack/react-query';

// Mock coin detail data for fallback
const mockCoinDetail = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
  current_price: 43250.67,
  market_cap: 850000000000,
  market_cap_rank: 1,
  fully_diluted_valuation: 910000000000,
  total_volume: 25000000000,
  high_24h: 44500.00,
  low_24h: 42000.00,
  price_change_24h: 1234.56,
  price_change_percentage_24h: 2.34,
  market_cap_change_24h: 20000000000,
  market_cap_change_percentage_24h: 2.41,
  circulating_supply: 19600000,
  total_supply: 21000000,
  max_supply: 21000000,
  ath: 69045,
  ath_change_percentage: -37.34,
  ath_date: '2021-11-10T14:24:11.849Z',
  atl: 67.81,
  atl_change_percentage: 63729.23,
  atl_date: '2013-07-06T00:00:00.000Z',
  price_history: [
    { date: '2024-01-01', price: 42000 },
    { date: '2024-01-02', price: 42500 },
    { date: '2024-01-03', price: 41800 },
    { date: '2024-01-04', price: 43250 },
    { date: '2024-01-05', price: 44000 },
    { date: '2024-01-06', price: 43500 },
    { date: '2024-01-07', price: 43250 },
  ]
};

const fetchCoinDetail = async (coinId: string) => {
  try {
    // Try to fetch from CoinGecko API first
    const [coinResponse, historyResponse] = await Promise.all([
      fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`),
      fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`)
    ]);

    if (coinResponse.ok && historyResponse.ok) {
      const coinData = await coinResponse.json();
      const historyData = await historyResponse.json();
      
      // Transform price history data
      const priceHistory = historyData.prices.map(([timestamp, price]: [number, number]) => ({
        date: new Date(timestamp).toISOString(),
        price: price
      }));

      return {
        id: coinData.id,
        name: coinData.name,
        symbol: coinData.symbol,
        image: coinData.image?.large,
        current_price: coinData.market_data?.current_price?.usd,
        market_cap: coinData.market_data?.market_cap?.usd,
        market_cap_rank: coinData.market_cap_rank,
        fully_diluted_valuation: coinData.market_data?.fully_diluted_valuation?.usd,
        total_volume: coinData.market_data?.total_volume?.usd,
        high_24h: coinData.market_data?.high_24h?.usd,
        low_24h: coinData.market_data?.low_24h?.usd,
        price_change_24h: coinData.market_data?.price_change_24h,
        price_change_percentage_24h: coinData.market_data?.price_change_percentage_24h,
        market_cap_change_24h: coinData.market_data?.market_cap_change_24h,
        market_cap_change_percentage_24h: coinData.market_data?.market_cap_change_percentage_24h,
        circulating_supply: coinData.market_data?.circulating_supply,
        total_supply: coinData.market_data?.total_supply,
        max_supply: coinData.market_data?.max_supply,
        ath: coinData.market_data?.ath?.usd,
        ath_change_percentage: coinData.market_data?.ath_change_percentage?.usd,
        ath_date: coinData.market_data?.ath_date?.usd,
        atl: coinData.market_data?.atl?.usd,
        atl_change_percentage: coinData.market_data?.atl_change_percentage?.usd,
        atl_date: coinData.market_data?.atl_date?.usd,
        price_history: priceHistory
      };
    } else {
      console.warn('CoinGecko API failed, using mock data');
      return mockCoinDetail;
    }
  } catch (error) {
    console.warn('Error fetching coin detail, using mock data:', error);
    return mockCoinDetail;
  }
};

export const useCoinDetail = (coinId: string) => {
  return useQuery({
    queryKey: ['coinDetail', coinId],
    queryFn: () => fetchCoinDetail(coinId),
    enabled: !!coinId,
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};
