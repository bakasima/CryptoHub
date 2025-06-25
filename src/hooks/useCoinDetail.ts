
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCoinDetail = (coinId: string) => {
  return useQuery({
    queryKey: ['coinDetail', coinId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-coin-detail', {
        body: { coinId }
      });
      
      if (error) {
        console.error('Error fetching coin detail:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!coinId,
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};
