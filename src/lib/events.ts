import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  event_type: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  description: string | null;
  lat: number | null;
  lng: number | null;
  crypto_focus: string[];
  is_paid: boolean;
  price?: number;
  payment_currency?: string;
  admin_wallet_address?: string;
  created_at: string;
  updated_at: string;
}

// Get access token from localStorage
const getAccessToken = (): string | null => {
  return localStorage.getItem('cryptohub_access_token');
};

export const fetchEventById = async (eventId: string): Promise<Event | null> => {
  try {
    console.log('Fetching event by ID:', eventId);
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      
      // If it's an auth error, try to refresh the token
      if (error.code === 'PGRST301' || error.code === 'PGRST302') {
        console.log('Auth error, attempting to refresh token...');
        const { data: refreshData } = await supabase.auth.refreshSession();
        
        if (refreshData.session) {
          // Retry the request with new token
          const { data: retryData, error: retryError } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();
            
          if (retryError) {
            console.error('Error after token refresh:', retryError);
            return null;
          }
          
          return retryData as Event;
        }
      }
      
      return null;
    }

    console.log('Event fetched successfully:', data);
    return data as Event;
  } catch (error) {
    console.error('Error in fetchEventById:', error);
    return null;
  }
};

export const fetchAllEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching all events...');
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      
      // If it's an auth error, try to refresh the token
      if (error.code === 'PGRST301' || error.code === 'PGRST302') {
        console.log('Auth error, attempting to refresh token...');
        const { data: refreshData } = await supabase.auth.refreshSession();
        
        if (refreshData.session) {
          // Retry the request with new token
          const { data: retryData, error: retryError } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (retryError) {
            console.error('Error after token refresh:', retryError);
            return [];
          }
          
          return retryData as Event[];
        }
      }
      
      return [];
    }

    console.log('Events fetched successfully:', data?.length || 0, 'events');
    return data as Event[];
  } catch (error) {
    console.error('Error in fetchAllEvents:', error);
    return [];
  }
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event | null> => {
  try {
    console.log('Creating new event:', eventData);
    
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return null;
    }

    console.log('Event created successfully:', data);
    return data as Event;
  } catch (error) {
    console.error('Error in createEvent:', error);
    return null;
  }
};

export const updateEvent = async (eventId: string, updates: Partial<Event>): Promise<Event | null> => {
  try {
    console.log('Updating event:', eventId, updates);
    
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return null;
    }

    console.log('Event updated successfully:', data);
    return data as Event;
  } catch (error) {
    console.error('Error in updateEvent:', error);
    return null;
  }
};

export const deleteEvent = async (eventId: string): Promise<boolean> => {
  try {
    console.log('Deleting event:', eventId);
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
      return false;
    }

    console.log('Event deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    return false;
  }
}; 