
import React from 'react';
import { CryptoHubLayout } from '@/components/CryptoHubLayout';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <AuthProvider>
      <CryptoHubLayout />
      <Toaster />
    </AuthProvider>
  );
};

export default Index;
