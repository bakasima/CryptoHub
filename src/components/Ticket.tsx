import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { QRCode } from './ui/qr-code';
import { Button } from './ui/button';
import { formatDate, formatTime } from '../lib/utils';
import { Calendar, Clock, MapPin, User, Mail, CreditCard, X, Ticket as TicketIcon, ArrowLeft, ExternalLink } from 'lucide-react';

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
  transaction_hash?: string;
}

interface TicketProps {
  ticket: Ticket;
  onClose?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const TicketComponent: React.FC<TicketProps> = ({ 
  ticket, 
  onClose, 
  onBack,
  showBackButton = false 
}) => {
  // Enhanced ticket data for blockchain QR code
  const blockchainTicketData = {
    ticketId: ticket.id,
    eventId: ticket.event_id,
    ticketNumber: ticket.ticket_number,
    attendeeName: ticket.attendee_name,
    attendeeEmail: ticket.attendee_email,
    eventTitle: ticket.event_title,
    eventDate: ticket.event_date,
    eventTime: ticket.event_time,
    eventLocation: ticket.event_location,
    paymentAmount: ticket.payment_amount,
    paymentCurrency: ticket.payment_currency,
    transactionHash: ticket.transaction_hash,
    timestamp: Date.now()
  };

  const handleBackToEvents = () => {
    if (onBack) {
      onBack();
    } else if (onClose) {
      onClose();
    }
  };

  const handleViewOnBlockchain = () => {
    if (ticket.transaction_hash) {
      window.open(`https://etherscan.io/tx/${ticket.transaction_hash}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-sm">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-0 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/20 rounded-full translate-y-8 -translate-x-8"></div>
          
          <CardHeader className="relative text-center border-b border-white/20 pb-4">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-full">
                <TicketIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-white mb-2">
              Event Ticket
            </CardTitle>
            <Badge 
              variant={ticket.payment_amount ? "default" : "secondary"} 
              className={`mt-2 ${ticket.payment_amount 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}
            >
              {ticket.payment_amount ? 'Paid Event' : 'Free Event'}
            </Badge>
          </CardHeader>
          
          <CardContent className="relative p-4 space-y-4">
            {/* QR Code Section */}
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-lg shadow-lg">
                <QRCode data={blockchainTicketData} size={100} showBlockchainInfo={true} />
              </div>
            </div>
            
            {/* Ticket Number */}
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Ticket Number</p>
              <p className="text-sm font-mono font-bold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/20">
                {ticket.ticket_number}
              </p>
            </div>
            
            {/* Event Details */}
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">
                  {ticket.event_title}
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="w-3 h-3 text-purple-400" />
                    <span className="text-xs">{formatDate(ticket.event_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span className="text-xs">{formatTime(ticket.event_time)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MapPin className="w-3 h-3 text-green-400" />
                    <span className="text-xs line-clamp-1">{ticket.event_location}</span>
                  </div>
                </div>
              </div>
              
              {/* Attendee Details */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <h4 className="font-semibold text-white mb-2 flex items-center text-sm">
                  <User className="w-3 h-3 mr-2 text-purple-400" />
                  Attendee
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User className="w-3 h-3 text-purple-400" />
                    <span className="text-xs">{ticket.attendee_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Mail className="w-3 h-3 text-blue-400" />
                    <span className="text-xs">{ticket.attendee_email}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Details (if paid event) */}
              {ticket.payment_amount && (
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                  <h4 className="font-semibold text-green-300 mb-2 flex items-center text-sm">
                    <CreditCard className="w-3 h-3 mr-2" />
                    Payment
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-green-200">
                      <CreditCard className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        {ticket.payment_amount} {ticket.payment_currency}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-200">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                      <span className="text-xs">Payment Confirmed</span>
                    </div>
                    {ticket.transaction_hash && (
                      <div className="flex items-center space-x-2 text-green-200">
                        <ExternalLink className="w-3 h-3" />
                        <button 
                          onClick={handleViewOnBlockchain}
                          className="text-xs underline hover:text-green-100 transition-colors"
                        >
                          View on Blockchain
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-white/20 pt-3 text-center">
              <p className="text-xs text-gray-400 mb-1">
                Present this ticket at the event entrance
              </p>
              <p className="text-xs text-gray-400">
                Valid until event date
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              {showBackButton && (
                <Button
                  onClick={handleBackToEvents}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 transition-all duration-200 text-sm py-2"
                >
                  <ArrowLeft className="w-3 h-3 mr-2" />
                  Back to Events
                </Button>
              )}
              
              {onClose && (
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200 hover:shadow-lg text-sm"
                >
                  Close
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 