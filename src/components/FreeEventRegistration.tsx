import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../hooks/useAuth';
import { useTickets } from '../hooks/useTickets';
import { TicketComponent } from './Ticket';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface FreeEventRegistrationProps {
  event: Event;
  onClose: () => void;
}

export const FreeEventRegistration: React.FC<FreeEventRegistrationProps> = ({ event, onClose }) => {
  const { user } = useAuth();
  const { createTicket, loading, error } = useTickets();
  const [attendeeName, setAttendeeName] = useState(user?.user_metadata?.full_name || '');
  const [attendeeEmail, setAttendeeEmail] = useState(user?.email || '');
  const [showTicket, setShowTicket] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<any>(null);

  const handleRegistration = async () => {
    if (!user) {
      alert('Please log in to register for events');
      return;
    }

    if (!attendeeName.trim() || !attendeeEmail.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const ticket = await createTicket(
        event.id,
        user.id,
        attendeeName,
        attendeeEmail,
        {
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location
        }
      );

      if (ticket) {
        setCreatedTicket(ticket);
        setShowTicket(true);
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  if (showTicket && createdTicket) {
    return (
      <TicketComponent 
        ticket={createdTicket} 
        onClose={() => {
          setShowTicket(false);
          onClose();
        }}
        onBack={() => {
          setShowTicket(false);
          setCreatedTicket(null);
          onClose();
        }}
        showBackButton={true}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Register for Free Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Event Details */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📅 {new Date(event.date).toLocaleDateString()}</p>
              <p>🕒 {event.time}</p>
              <p>📍 {event.location}</p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegistration}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Registering...' : 'Register for Free'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 