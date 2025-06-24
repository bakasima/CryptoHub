
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, level } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Create comprehensive educational content about ${topic} for ${level} level learners in the cryptocurrency and blockchain space.

Structure the content as follows:

**${topic} - ${level} Guide**

**Overview:**
[Clear explanation of the concept and why it matters]

**Key Concepts:**
[3-4 fundamental concepts broken down simply]

**Real-World Applications:**
[Practical examples and current use cases]

**Popular Protocols/Platforms:**
[List 3-4 specific protocols or platforms with brief descriptions]

**Getting Started:**
[Step-by-step guide for beginners to start learning/using]

**Resources for Further Learning:**
[Recommended next steps and resources]

Make it engaging, practical, and appropriate for the ${level} level. Include specific examples and avoid overly technical jargon unless necessary.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert blockchain educator who creates clear, comprehensive, and engaging educational content. You excel at breaking down complex concepts into digestible, practical lessons that help people learn and apply blockchain technology.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating learning content:', error);
    
    // Provide fallback content
    const fallbackContent = `**${topic} - ${level} Guide**

**Overview:**
${topic} is a fundamental concept in blockchain technology that enables decentralized applications and smart contracts. Understanding this technology is crucial for anyone looking to participate in the decentralized economy.

**Key Concepts:**
1. Decentralization - Removing single points of failure
2. Smart Contracts - Self-executing contracts with code
3. Tokenization - Digital representation of assets
4. Consensus Mechanisms - How networks agree on state

**Real-World Applications:**
- Decentralized Finance (DeFi) protocols
- Non-Fungible Tokens (NFTs)
- Supply chain tracking
- Digital identity solutions

**Popular Protocols/Platforms:**
1. Ethereum - Leading smart contract platform
2. Uniswap - Decentralized exchange protocol
3. Compound - Lending and borrowing protocol
4. OpenSea - NFT marketplace

**Getting Started:**
1. Set up a crypto wallet (MetaMask recommended)
2. Get familiar with basic concepts through online courses
3. Start with small amounts on testnet
4. Join communities and Discord servers
5. Practice with simple transactions

**Resources for Further Learning:**
- Official documentation of major protocols
- YouTube educational channels
- Discord communities
- Practice on testnets before mainnet`;
    
    return new Response(JSON.stringify({ content: fallbackContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
