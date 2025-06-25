
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get data from CoinGecko API
    const coingeckoResponse = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h'
    );

    let cryptoData = [];

    if (coingeckoResponse.ok) {
      const coingeckoData = await coingeckoResponse.json();
      
      cryptoData = coingeckoData.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        current_price: coin.current_price || 0,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        total_volume: coin.total_volume || 0,
        market_cap: coin.market_cap || 0,
        circulating_supply: coin.circulating_supply || 0,
        total_supply: coin.total_supply || 0,
        ath: coin.ath || 0,
        atl: coin.atl || 0
      }));
    }

    // Fallback to mock data if API fails
    if (cryptoData.length === 0) {
      cryptoData = [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'btc',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          current_price: 43250 + Math.random() * 5000 - 2500,
          price_change_percentage_24h: Math.random() * 10 - 5,
          total_volume: 25000000000 + Math.random() * 10000000000,
          market_cap: 850000000000 + Math.random() * 100000000000,
          circulating_supply: 19500000,
          total_supply: 21000000,
          ath: 69000,
          atl: 67.81
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'eth',
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          current_price: 2650 + Math.random() * 500 - 250,
          price_change_percentage_24h: Math.random() * 10 - 5,
          total_volume: 15000000000 + Math.random() * 5000000000,
          market_cap: 320000000000 + Math.random() * 50000000000,
          circulating_supply: 120000000,
          total_supply: null,
          ath: 4878,
          atl: 0.432979
        },
        {
          id: 'solana',
          name: 'Solana',
          symbol: 'sol',
          image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
          current_price: 98.45 + Math.random() * 20 - 10,
          price_change_percentage_24h: Math.random() * 15 - 7.5,
          total_volume: 2000000000 + Math.random() * 1000000000,
          market_cap: 45000000000 + Math.random() * 10000000000,
          circulating_supply: 450000000,
          total_supply: 508000000,
          ath: 260,
          atl: 0.500801
        },
        {
          id: 'cardano',
          name: 'Cardano',
          symbol: 'ada',
          image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
          current_price: 0.5234 + Math.random() * 0.2 - 0.1,
          price_change_percentage_24h: Math.random() * 12 - 6,
          total_volume: 800000000 + Math.random() * 400000000,
          market_cap: 18000000000 + Math.random() * 5000000000,
          circulating_supply: 35000000000,
          total_supply: 45000000000,
          ath: 3.09,
          atl: 0.01925275
        },
        {
          id: 'binancecoin',
          name: 'BNB',
          symbol: 'bnb',
          image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
          current_price: 315.67 + Math.random() * 50 - 25,
          price_change_percentage_24h: Math.random() * 8 - 4,
          total_volume: 1200000000 + Math.random() * 600000000,
          market_cap: 47000000000 + Math.random() * 8000000000,
          circulating_supply: 150000000,
          total_supply: 200000000,
          ath: 686.31,
          atl: 0.0398177
        },
        {
          id: 'ripple',
          name: 'XRP',
          symbol: 'xrp',
          image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
          current_price: 0.6123 + Math.random() * 0.1 - 0.05,
          price_change_percentage_24h: Math.random() * 10 - 5,
          total_volume: 1500000000 + Math.random() * 700000000,
          market_cap: 33000000000 + Math.random() * 7000000000,
          circulating_supply: 54000000000,
          total_supply: 100000000000,
          ath: 3.4,
          atl: 0.00268621
        }
      ];
    }

    return new Response(JSON.stringify(cryptoData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    
    // Return fallback data on error
    const fallbackData = [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'btc',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 43250,
        price_change_percentage_24h: 2.5,
        total_volume: 25000000000,
        market_cap: 850000000000,
        circulating_supply: 19500000,
        total_supply: 21000000,
        ath: 69000,
        atl: 67.81
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'eth',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 2650,
        price_change_percentage_24h: -1.2,
        total_volume: 15000000000,
        market_cap: 320000000000,
        circulating_supply: 120000000,
        total_supply: null,
        ath: 4878,
        atl: 0.432979
      }
    ];

    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
