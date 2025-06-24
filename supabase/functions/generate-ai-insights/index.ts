
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
    const { eventTitle, cryptoFocus, marketData } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a detailed prompt with market context
    const marketContext = marketData ? 
      `Current market data shows: ${marketData.slice(0, 3).map((crypto: any) => 
        `${crypto.name} at $${crypto.price.toLocaleString()} (${crypto.change24h > 0 ? '+' : ''}${crypto.change24h.toFixed(2)}%)`
      ).join(', ')}.` : '';

    const prompt = `As a cryptocurrency market analyst, provide insightful analysis for the event "${eventTitle}" focusing on ${cryptoFocus.join(', ')}. 

${marketContext}

Consider:
1. Current market trends and sentiment
2. How this event might impact the mentioned cryptocurrencies
3. Key opportunities or risks for attendees
4. Actionable insights for investors and developers

Keep the analysis concise but valuable, around 3-4 sentences. Focus on practical, actionable insights rather than general statements.`;

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
            content: 'You are a senior cryptocurrency market analyst with deep expertise in blockchain technology, DeFi, and market dynamics. Provide actionable, data-driven insights that help people make informed decisions.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const insight = data.choices[0].message.content;

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    
    // Provide fallback insights
    const fallbackInsight = "This event presents significant opportunities in the current market environment. With increased institutional adoption and regulatory clarity, participants should focus on networking with key industry players and exploring emerging use cases. Consider the potential impact of upcoming regulatory developments and technological innovations that may be discussed during the event.";
    
    return new Response(JSON.stringify({ insight: fallbackInsight }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
