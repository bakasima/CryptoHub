
import React, { useState } from 'react';

interface CryptoFocusTagsProps {
  cryptoFocus: string[];
  onCryptoFocusChange: (cryptoFocus: string[]) => void;
  className?: string;
}

export const CryptoFocusTags = ({ cryptoFocus, onCryptoFocusChange, className = "" }: CryptoFocusTagsProps) => {
  const [cryptoInput, setCryptoInput] = useState('');

  const addCryptoFocus = () => {
    if (cryptoInput.trim() && !cryptoFocus.includes(cryptoInput.trim())) {
      onCryptoFocusChange([...cryptoFocus, cryptoInput.trim()]);
      setCryptoInput('');
    }
  };

  const removeCryptoFocus = (crypto: string) => {
    onCryptoFocusChange(cryptoFocus.filter(c => c !== crypto));
  };

  return (
    <div className={className}>
      <label className="block text-white font-medium mb-2">Crypto Focus</label>
      <div className="flex space-x-2 mb-3">
        <input
          type="text"
          value={cryptoInput}
          onChange={(e) => setCryptoInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCryptoFocus())}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Add cryptocurrency (e.g., Bitcoin, Ethereum)"
        />
        <button
          type="button"
          onClick={addCryptoFocus}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {cryptoFocus.map((crypto) => (
          <span
            key={crypto}
            className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
          >
            <span>{crypto}</span>
            <button
              type="button"
              onClick={() => removeCryptoFocus(crypto)}
              className="text-purple-300 hover:text-white"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
