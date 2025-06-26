// Configuration for all API keys and environment variables
export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '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',
  },
  
  // Blockchain Configuration
  blockchain: {
    rpcUrl: import.meta.env.VITE_RPC_URL || 'https://rpc.sepolia.org',
    privateKey: import.meta.env.VITE_PRIVATE_KEY || '0x75dd4dfb50773f1bb5929f1e7690bdef4bd184023e9161b6d5c82009d72643b8',
    network: 'sepolia',
    chainId: 11155111, // Sepolia testnet
  },
  
  // AgentKit Configuration
  agentKit: {
    network: import.meta.env.VITE_CDP_AGENT_KIT_NETWORK || 'base-mainnet',
    apiKeyName: import.meta.env.VITE_CDP_API_KEY_NAME || 'e38ded88-93d7-43ab-b06d-78900b71715f',
    apiKeySecret: import.meta.env.VITE_CDP_API_KEY_SECRET_KEY || 'fCmw3nTyQ5pnmb9x25gIaBPXIq5JirJJQ8ZJFi/HIvyz96tnvB39RrdDE72mYmDYlh8/P2ioDDLCJVN/oOZjKw==',
  },
  
  // Crypto API Configuration
  crypto: {
    coingeckoApiKey: import.meta.env.VITE_COINGECKO_API_KEY || '',
    cryptocompareApiKey: import.meta.env.VITE_CRYPTOCOMPARE_API_KEY || '',
  },
  
  // Feature Flags
  features: {
    aiEnabled: true, // Always enabled with provided key
    blockchainEnabled: true, // Always enabled with provided RPC
    agentKitEnabled: true, // Always enabled with provided keys
    walletConnectEnabled: true,
  }
}; 