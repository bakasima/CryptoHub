import React from 'react';

interface EventFormData {
  title: string;
  event_type: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  description: string;
  is_paid: boolean;
  price: number;
  payment_currency: string;
  admin_wallet_address: string;
}

interface EventFormFieldsProps {
  formData: EventFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const EventFormFields = ({ formData, onInputChange }: EventFormFieldsProps) => {
  const eventTypes = [
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'meetup', label: 'Meetup' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'hackathon', label: 'Hackathon' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'ETH', label: 'ETH (Ξ)' },
    { value: 'BTC', label: 'BTC (₿)' },
    { value: 'USDC', label: 'USDC' },
    { value: 'USDT', label: 'USDT' }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white font-medium mb-2">Event Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Event Type</label>
          <select
            name="event_type"
            value={formData.event_type}
            onChange={onInputChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-slate-800">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onInputChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={onInputChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onInputChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="City, State or Address"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Expected Attendees</label>
          <input
            type="number"
            name="attendees"
            value={formData.attendees}
            onChange={onInputChange}
            min="0"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Payment Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="is_paid"
              name="is_paid"
              checked={formData.is_paid}
              onChange={(e) => {
                const event = {
                  target: {
                    name: 'is_paid',
                    value: e.target.checked.toString()
                  }
                } as React.ChangeEvent<HTMLInputElement>;
                onInputChange(event);
              }}
              className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label htmlFor="is_paid" className="text-white font-medium">
              Paid Event
            </label>
          </div>

          {formData.is_paid && (
            <>
              <div>
                <label className="block text-white font-medium mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={onInputChange}
                  min="0"
                  step="0.01"
                  required={formData.is_paid}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Currency</label>
                <select
                  name="payment_currency"
                  value={formData.payment_currency}
                  onChange={onInputChange}
                  required={formData.is_paid}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value} className="bg-slate-800">
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {formData.is_paid && (
          <div className="mt-6">
            <label className="block text-white font-medium mb-2">Admin Wallet Address (for receiving payments)</label>
            <input
              type="text"
              name="admin_wallet_address"
              value={formData.admin_wallet_address}
              onChange={onInputChange}
              required={formData.is_paid}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0x..."
            />
            <p className="text-gray-400 text-sm mt-1">
              This is the wallet address where event payments will be sent
            </p>
          </div>
        )}

        {formData.is_paid && (
          <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-purple-300 text-sm">
              💳 Attendees will be able to pay for this event using their connected wallet
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onInputChange}
          rows={4}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Describe your event..."
        />
      </div>
    </>
  );
};
