
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAIInsights = () => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string>('');

  const generateInsights = async (eventTitle: string, cryptoFocus: string[], marketData?: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-insights', {
        body: { eventTitle, cryptoFocus, marketData }
      });

      if (error) throw error;
      
      setInsights(data.insight);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Unable to generate insights at this time.');
    } finally {
      setLoading(false);
    }
  };

  return { insights, loading, generateInsights };
};
