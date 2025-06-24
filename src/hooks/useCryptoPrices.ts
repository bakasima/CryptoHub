
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-crypto-prices');
      
      if (error) {
        console.error('Error fetching crypto prices:', error);
        throw error;
      }
      
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
};
