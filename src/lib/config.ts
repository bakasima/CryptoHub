// Configuration for all API keys and environment variables
export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  },
  
  // Blockchain Configuration
  blockchain: {
    rpcUrl: import.meta.env.VITE_RPC_URL || 'https://rpc.sepolia.org',
    privateKey: import.meta.env.VITE_PRIVATE_KEY || '',
    network: 'sepolia',
    chainId: 11155111, // Sepolia testnet
  },
  
  // AgentKit Configuration
  agentKit: {
    network: import.meta.env.VITE_CDP_AGENT_KIT_NETWORK || 'base-mainnet',
    apiKeyName: import.meta.env.VITE_CDP_API_KEY_NAME || '',
    apiKeySecret: import.meta.env.VITE_CDP_API_KEY_SECRET_KEY || '',
  },
  
  // Crypto API Configuration
  crypto: {
    coingeckoApiKey: import.meta.env.VITE_COINGECKO_API_KEY || '',
    cryptocompareApiKey: import.meta.env.VITE_CRYPTOCOMPARE_API_KEY || '',
  },
  
  // Feature Flags - Enable features only if API keys are available
  features: {
    aiEnabled: !!import.meta.env.VITE_OPENAI_API_KEY,
    blockchainEnabled: !!import.meta.env.VITE_PRIVATE_KEY,
    agentKitEnabled: !!(import.meta.env.VITE_CDP_API_KEY_NAME && import.meta.env.VITE_CDP_API_KEY_SECRET_KEY),
    walletConnectEnabled: true, // Always enabled as it doesn't require API keys
  }
};

// Helper function to check if features are available
export const isFeatureEnabled = (feature: keyof typeof config.features) => {
  return config.features[feature];
};

// Helper function to get API key with warning
export const getApiKey = (service: 'openai' | 'blockchain' | 'agentkit' | 'crypto') => {
  switch (service) {
    case 'openai':
      return config.openai.apiKey;
    case 'blockchain':
      return config.blockchain.privateKey;
    case 'agentkit':
      return { name: config.agentKit.apiKeyName, secret: config.agentKit.apiKeySecret };
    case 'crypto':
      return { coingecko: config.crypto.coingeckoApiKey, cryptocompare: config.crypto.cryptocompareApiKey };
    default:
      return '';
  }
}; 