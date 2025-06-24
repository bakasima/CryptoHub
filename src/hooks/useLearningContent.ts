
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useLearningContent = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');

  const generateContent = async (topic: string, level: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-learning-content', {
        body: { topic, level }
      });

      if (error) throw error;
      
      setContent(data.content);
    } catch (error) {
      console.error('Error generating content:', error);
      setContent('Unable to generate content at this time.');
    } finally {
      setLoading(false);
    }
  };

  return { content, loading, generateContent };
};
