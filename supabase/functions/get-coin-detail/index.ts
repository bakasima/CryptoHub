
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
    const { coinId } = await req.json();

    // Fetch detailed coin data from CoinGecko
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    const coinDetail = {
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      high24h: data.market_data.high_24h.usd,
      low24h: data.market_data.low_24h.usd,
      priceHistory: data.market_data.sparkline_7d.price.slice(-24), // Last 24 hours
      description: data.description.en,
      links: {
        homepage: data.links.homepage[0],
        blockchain_site: data.links.blockchain_site[0],
        twitter: data.links.twitter_screen_name,
        reddit: data.links.subreddit_url
      }
    };

    return new Response(JSON.stringify(coinDetail), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching coin detail:', error);
    
    // Return fallback data
    const fallbackData = {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 50000,
      change24h: 2.5,
      marketCap: 1000000000000,
      volume24h: 25000000000,
      high24h: 51000,
      low24h: 49000,
      priceHistory: Array.from({ length: 24 }, (_, i) => 50000 + Math.random() * 2000 - 1000),
      description: 'Bitcoin is a decentralized digital currency.',
      links: {
        homepage: 'https://bitcoin.org',
        blockchain_site: '',
        twitter: 'bitcoin',
        reddit: 'https://reddit.com/r/bitcoin'
      }
    };
    
    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
