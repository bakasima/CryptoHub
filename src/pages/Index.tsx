import React, { useEffect } from 'react';
import { CryptoHubLayout } from '@/components/CryptoHubLayout';

const Index = () => {
  useEffect(() => {
    console.log('Index component mounted');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <CryptoHubLayout />
    </div>
  );
};

export default Index;
