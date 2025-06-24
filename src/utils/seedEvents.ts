
import { supabase } from '@/integrations/supabase/client';

export const defaultEvents = [
  {
    title: "Bitcoin Conference 2024",
    description: "The largest Bitcoin conference featuring industry leaders, developers, and enthusiasts discussing the future of digital currency.",
    event_type: "Conference",
    date: "2024-07-15",
    time: "09:00:00",
    location: "Miami, FL",
    lat: 25.7617,
    lng: -80.1918,
    attendees: 500,
    crypto_focus: ["Bitcoin", "Lightning Network", "Mining"]
  },
  {
    title: "Ethereum Developer Meetup",
    description: "Monthly meetup for Ethereum developers to share knowledge, network, and discuss latest updates in the ecosystem.",
    event_type: "Meetup",
    date: "2024-06-28",
    time: "18:30:00",
    location: "San Francisco, CA",
    lat: 37.7749,
    lng: -122.4194,
    attendees: 75,
    crypto_focus: ["Ethereum", "Smart Contracts", "DApps"]
  },
  {
    title: "DeFi Workshop: Getting Started",
    description: "Hands-on workshop covering DeFi basics, yield farming, liquidity provision, and risk management strategies.",
    event_type: "Workshop",
    date: "2024-07-02",
    time: "14:00:00",
    location: "New York, NY",
    lat: 40.7128,
    lng: -74.0060,
    attendees: 30,
    crypto_focus: ["DeFi", "Yield Farming", "Uniswap", "Compound"]
  },
  {
    title: "NFT Art Gallery Opening",
    description: "Exclusive opening of digital art gallery featuring NFTs from emerging and established crypto artists.",
    event_type: "Exhibition",
    date: "2024-07-10",
    time: "19:00:00",
    location: "Los Angeles, CA",
    lat: 34.0522,
    lng: -118.2437,
    attendees: 150,
    crypto_focus: ["NFTs", "Digital Art", "OpenSea", "Ethereum"]
  },
  {
    title: "Blockchain Security Summit",
    description: "Technical summit focusing on blockchain security, smart contract auditing, and best practices for developers.",
    event_type: "Summit",
    date: "2024-07-20",
    time: "10:00:00",
    location: "Austin, TX",
    lat: 30.2672,
    lng: -97.7431,
    attendees: 200,
    crypto_focus: ["Security", "Smart Contracts", "Auditing", "Best Practices"]
  },
  {
    title: "Crypto Trading Bootcamp",
    description: "Intensive 2-day bootcamp covering cryptocurrency trading strategies, technical analysis, and risk management.",
    event_type: "Bootcamp",
    date: "2024-07-05",
    time: "09:00:00",
    location: "Chicago, IL",
    lat: 41.8781,
    lng: -87.6298,
    attendees: 45,
    crypto_focus: ["Trading", "Technical Analysis", "Bitcoin", "Altcoins"]
  }
];

export const seedDefaultEvents = async (adminUserId: string) => {
  console.log('Seeding default events for admin:', adminUserId);
  
  try {
    const eventsWithAdmin = defaultEvents.map(event => ({
      ...event,
      created_by: adminUserId
    }));

    const { data, error } = await supabase
      .from('events')
      .insert(eventsWithAdmin)
      .select();

    if (error) {
      console.error('Error seeding events:', error);
      return { success: false, error };
    }

    console.log('Successfully seeded events:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in seedDefaultEvents:', error);
    return { success: false, error };
  }
};
