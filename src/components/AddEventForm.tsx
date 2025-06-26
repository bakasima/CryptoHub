import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EventFormFields } from './EventFormFields';
import { CryptoFocusTags } from './CryptoFocusTags';
import { generateEventLink, copyToClipboard, shareEvent } from '@/lib/utils';
import { Check, Copy, Share2, ExternalLink } from 'lucide-react';

interface AddEventFormProps {
  onEventAdded: () => void;
}

export const AddEventForm = ({ onEventAdded }: AddEventFormProps) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'conference',
    date: '',
    time: '',
    location: '',
    attendees: 0,
    description: '',
    is_paid: false,
    price: 0,
    payment_currency: 'USD',
    admin_wallet_address: ''
  });
  const [cryptoFocus, setCryptoFocus] = useState<string[]>([]);

  // Add error boundary for component rendering
  React.useEffect(() => {
    try {
      console.log('AddEventForm component mounted');
      console.log('User:', user);
      console.log('Profile:', profile);
    } catch (err) {
      console.error('Error in AddEventForm useEffect:', err);
      setRenderError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [user, profile]);

  // If there's a render error, show it
  if (renderError) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
        <h2 className="text-red-400 font-bold mb-2">Component Error</h2>
        <p className="text-red-300 text-sm">{renderError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    );
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Event title is required');
      return false;
    }
    if (!formData.date) {
      setError('Event date is required');
      return false;
    }
    if (!formData.time) {
      setError('Event time is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Event location is required');
      return false;
    }
    if (formData.is_paid && formData.price <= 0) {
      setError('Price must be greater than 0 for paid events');
      return false;
    }
    if (formData.is_paid && !formData.admin_wallet_address.trim()) {
      setError('Admin wallet address is required for paid events');
      return false;
    }
    if (formData.is_paid && !formData.admin_wallet_address.startsWith('0x')) {
      setError('Admin wallet address must be a valid Ethereum address (starting with 0x)');
      return false;
    }
    if (!profile) {
      setError('Profile not loaded. Please refresh the page.');
      return false;
    }
    if (!profile.is_admin) {
      setError('Only admins can create events. Please contact an administrator to grant you admin privileges.');
      return false;
    }
    return true;
  };

  const testDatabaseConnection = async () => {
    try {
      console.log('Testing database connection...');
      
      // Test basic connection by fetching a single event
      const { data, error } = await supabase
        .from('events')
        .select('id, title')
        .limit(1);
      
      if (error) {
        console.error('Database connection test failed:', error);
        return false;
      }
      
      console.log('Database connection successful:', data);
      return true;
    } catch (error) {
      console.error('Database connection test error:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.log('=== EVENT CREATION DEBUG ===');
    console.log('Form submission started');
    console.log('User:', user);
    console.log('Profile:', profile);
    console.log('Form data:', formData);
    console.log('Crypto focus:', cryptoFocus);
    console.log('User ID:', user?.id);
    console.log('Is Admin:', profile?.is_admin);
    console.log('Is Paid Event:', formData.is_paid);
    console.log('Price:', formData.price);
    console.log('Wallet Address:', formData.admin_wallet_address);
    
    if (!user) {
      console.error('No user found');
      setError('You must be logged in to create events');
      return;
    }

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setLoading(true);
    try {
      // Test database connection first
      console.log('Testing database connection...');
      const isConnected = await testDatabaseConnection();
      if (!isConnected) {
        setError('Cannot connect to database. Please check your connection.');
        return;
      }
      
      // Create event data with payment fields
      const eventData = {
        title: formData.title.trim(),
        event_type: formData.event_type,
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        attendees: Number(formData.attendees) || 0,
        description: formData.description.trim() || null,
        lat: null as number | null,
        lng: null as number | null,
        crypto_focus: cryptoFocus,
        created_by: user.id,
        // Add payment fields
        is_paid: formData.is_paid,
        price: formData.is_paid ? Number(formData.price) : 0,
        payment_currency: formData.is_paid ? formData.payment_currency : 'USD',
        admin_wallet_address: formData.is_paid ? formData.admin_wallet_address : null
      };

      console.log('Sending event data to database:', eventData);

      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();

      if (error) {
        console.error('Database error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Check if it's a schema error
        if (error.message.includes('column') && error.message.includes('does not exist')) {
          setError('Database schema needs to be updated. Please run the migration in your Supabase dashboard first.');
        } else {
          setError(`Database error: ${error.message}`);
        }
        return;
      }

      console.log('Event created successfully:', data);
      
      if (data && data.length > 0) {
        setCreatedEvent(data[0]);
        setSuccess(true);
        onEventAdded();
      }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!createdEvent) return;
    
    const eventLink = generateEventLink(createdEvent.id);
    const success = await copyToClipboard(eventLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (!createdEvent) return;
    shareEvent(createdEvent.id, createdEvent.title);
  };

  const handleViewEvent = () => {
    if (!createdEvent) return;
    window.open(generateEventLink(createdEvent.id), '_blank');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      event_type: 'conference',
      date: '',
      time: '',
      location: '',
      attendees: 0,
      description: '',
      is_paid: false,
      price: 0,
      payment_currency: 'USD',
      admin_wallet_address: ''
    });
    setCryptoFocus([]);
    setSuccess(false);
    setCreatedEvent(null);
    setError(null);
  };

  // Show success state with deep link
  if (success && createdEvent) {
    const eventLink = generateEventLink(createdEvent.id);
    
    return (
      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Event Created Successfully!</h2>
          <p className="text-green-300">Your event "{createdEvent.title}" has been created and is now live.</p>
        </div>

        {/* Event Link Section */}
        <div className="bg-black/20 border border-white/20 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Share Your Event</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={eventLink}
                readOnly
                className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
                title="Copy Link"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleShare}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Event</span>
              </button>
              
              <button
                onClick={handleViewEvent}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Event Details Preview */}
        <div className="bg-black/20 border border-white/20 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Event Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Title:</span>
              <div className="text-white font-medium">{createdEvent.title}</div>
            </div>
            <div>
              <span className="text-gray-400">Date:</span>
              <div className="text-white">{createdEvent.date} at {createdEvent.time}</div>
            </div>
            <div>
              <span className="text-gray-400">Location:</span>
              <div className="text-white">{createdEvent.location}</div>
            </div>
            <div>
              <span className="text-gray-400">Type:</span>
              <div className="text-white capitalize">{createdEvent.event_type}</div>
            </div>
            {createdEvent.is_paid && (
              <div>
                <span className="text-gray-400">Price:</span>
                <div className="text-green-400 font-medium">
                  ${createdEvent.price} {createdEvent.payment_currency}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={resetForm}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Create Another Event
          </button>
          <button
            onClick={() => onEventAdded()}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Back to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCryptoFocusChange = (cryptoFocus: string[]) => {
    setCryptoFocus(cryptoFocus);
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Event</h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <EventFormFields
          formData={formData}
          onInputChange={handleInputChange}
        />
        
        <CryptoFocusTags
          cryptoFocus={cryptoFocus}
          onCryptoFocusChange={handleCryptoFocusChange}
        />

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={() => onEventAdded()}
            className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
