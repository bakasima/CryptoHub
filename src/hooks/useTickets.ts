import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { generateTicketNumber, generateQRCodeData } from '../lib/utils';

interface Ticket {
  id: string;
  event_id: string;
  user_id: string;
  ticket_number: string;
  attendee_name: string;
  attendee_email: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_location: string;
  payment_amount: number | null;
  payment_currency: string | null;
  qr_code: string;
  created_at: string;
  is_valid: boolean;
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new ticket
  const createTicket = async (
    eventId: string,
    userId: string,
    attendeeName: string,
    attendeeEmail: string,
    eventData: {
      title: string;
      date: string;
      time: string;
      location: string;
    },
    paymentAmount?: number,
    paymentCurrency?: string
  ): Promise<Ticket | null> => {
    try {
      setLoading(true);
      setError(null);

      const ticketNumber = generateTicketNumber();
      const qrCode = generateQRCodeData('temp-id', eventId, ticketNumber);

      const ticketData = {
        event_id: eventId,
        user_id: userId,
        ticket_number: ticketNumber,
        attendee_name: attendeeName,
        attendee_email: attendeeEmail,
        event_title: eventData.title,
        event_date: eventData.date,
        event_time: eventData.time,
        event_location: eventData.location,
        payment_amount: paymentAmount || null,
        payment_currency: paymentCurrency || null,
        qr_code: qrCode,
        is_valid: true
      };

      const { data, error: insertError } = await supabase
        .from('tickets')
        .insert(ticketData)
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Update the QR code with the actual ticket ID
      const updatedQrCode = generateQRCodeData(data.id, eventId, ticketNumber);
      
      const { data: updatedTicket, error: updateError } = await supabase
        .from('tickets')
        .update({ qr_code: updatedQrCode })
        .eq('id', data.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Add to local state
      setTickets(prev => [...prev, updatedTicket]);

      return updatedTicket;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's tickets
  const fetchUserTickets = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setTickets(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get ticket by ID
  const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Validate ticket
  const validateTicket = async (ticketId: string): Promise<boolean> => {
    try {
      const ticket = await getTicketById(ticketId);
      return ticket?.is_valid || false;
    } catch {
      return false;
    }
  };

  return {
    tickets,
    loading,
    error,
    createTicket,
    fetchUserTickets,
    getTicketById,
    validateTicket
  };
}; 