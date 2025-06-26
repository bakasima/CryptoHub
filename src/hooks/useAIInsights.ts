import { useState, useEffect } from 'react';
import { config } from '@/lib/config';

interface AIInsight {
  id: string;
  type: 'market' | 'portfolio' | 'event' | 'trading';
  title: string;
  content: string;
  confidence: number;
  timestamp: string;
  actionable: boolean;
  action?: string;
}

export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInsights = async (
    context: string, 
    cryptoFocus: string[], 
    cryptoPrices?: any[],
    portfolioData?: any
  ) => {
    if (!config.features.aiEnabled) {
      console.warn('AI features are disabled - no OpenAI API key configured');
      return;
    }

    setLoading(true);
    try {
      const prompt = `
        Analyze the following crypto context and provide actionable insights:
        
        Context: ${context}
        Crypto Focus: ${cryptoFocus.join(', ')}
        Current Prices: ${cryptoPrices ? JSON.stringify(cryptoPrices.slice(0, 5)) : 'Not available'}
        Portfolio: ${portfolioData ? JSON.stringify(portfolioData) : 'Not available'}
        
        Provide 3-5 insights in JSON format:
        {
          "insights": [
            {
              "type": "market|portfolio|event|trading",
              "title": "Insight title",
              "content": "Detailed analysis",
              "confidence": 0.85,
              "actionable": true,
              "action": "Suggested action"
            }
          ]
        }
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openai.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a crypto market analyst providing actionable insights. Respond only with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (content) {
        try {
          const parsed = JSON.parse(content);
          const newInsights = parsed.insights.map((insight: any, index: number) => ({
            id: `insight-${Date.now()}-${index}`,
            ...insight,
            timestamp: new Date().toISOString(),
          }));
          
          setInsights(prev => [...newInsights, ...prev.slice(0, 10)]); // Keep latest 10 insights
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
        }
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEventRecommendations = async (userPreferences: any, upcomingEvents: any[]) => {
    if (!config.features.aiEnabled) return [];

    try {
      const prompt = `
        Based on user preferences and upcoming events, recommend the best events to attend:
        
        User Preferences: ${JSON.stringify(userPreferences)}
        Upcoming Events: ${JSON.stringify(upcomingEvents)}
        
        Return JSON array of recommended event IDs with reasoning:
        {
          "recommendations": [
            {
              "eventId": "event-id",
              "reason": "Why this event is recommended",
              "priority": 1-5
            }
          ]
        }
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openai.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an event recommendation system. Respond only with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return parsed.recommendations || [];
        }
      }
    } catch (error) {
      console.error('Error generating event recommendations:', error);
    }
    
    return [];
  };

  const generateTradingInsights = async (portfolio: any, marketData: any) => {
    if (!config.features.aiEnabled) return [];

    try {
      const prompt = `
        Analyze the portfolio and market data to provide trading insights:
        
        Portfolio: ${JSON.stringify(portfolio)}
        Market Data: ${JSON.stringify(marketData)}
        
        Provide trading recommendations in JSON format:
        {
          "recommendations": [
            {
              "action": "buy|sell|hold",
              "asset": "asset-symbol",
              "reason": "Detailed reasoning",
              "confidence": 0.85,
              "risk": "low|medium|high"
            }
          ]
        }
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openai.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a crypto trading advisor. Provide only general advice and always include risk warnings. Respond only with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return parsed.recommendations || [];
        }
      }
    } catch (error) {
      console.error('Error generating trading insights:', error);
    }
    
    return [];
  };

  return {
    insights,
    loading,
    generateInsights,
    generateEventRecommendations,
    generateTradingInsights,
  };
};
