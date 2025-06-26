import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../hooks/useAuth';
import { useTickets } from '../hooks/useTickets';
import { TicketComponent } from './Ticket';
import { formatDate, formatTime } from '../lib/utils';
import { Calendar, Clock, MapPin, User, CreditCard, Ticket as TicketIcon, Eye } from 'lucide-react';

export const UserTickets: React.FC = () => {
  const { user } = useAuth();
  const { tickets, loading, error, fetchUserTickets } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserTickets(user.id);
    }
  }, [user]);

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-gray-300">Please log in to view your tickets</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Tickets</h2>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTicket) {
    return (
      <TicketComponent 
        ticket={selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Tickets</h2>
            <p className="text-gray-300">Manage and view your event tickets</p>
          </div>
          <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
            {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
          </Badge>
        </div>

        {tickets.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-xl border border-white/20">
            <CardContent className="text-center py-12">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <TicketIcon className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Tickets Yet</h3>
              <p className="text-gray-300 mb-4">You don't have any tickets yet</p>
              <p className="text-sm text-gray-400">
                Register for events to get your tickets here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <Card 
                key={ticket.id} 
                className="group relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1"
              >
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/10 rounded-full translate-y-8 -translate-x-8"></div>
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                        <TicketIcon className="w-4 h-4 text-white" />
                      </div>
                      <Badge 
                        variant={ticket.payment_amount ? "default" : "secondary"}
                        className={`${ticket.payment_amount 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {ticket.payment_amount ? 'Paid' : 'Free'}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {ticket.event_title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">{formatDate(ticket.event_date)}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{formatTime(ticket.event_time)}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-sm line-clamp-1">{ticket.event_location}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Ticket:</span>
                      <span className="font-mono text-xs text-white bg-white/10 px-2 py-1 rounded">
                        {ticket.ticket_number}
                      </span>
                    </div>
                    {ticket.payment_amount && (
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-400">Paid:</span>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-3 h-3 text-green-400" />
                          <span className="text-green-300 font-medium">
                            {ticket.payment_amount} {ticket.payment_currency}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => handleViewTicket(ticket)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200 hover:shadow-lg group-hover:shadow-purple-500/25"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Ticket
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 