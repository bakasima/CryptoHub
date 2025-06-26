# CryptoHub - Your Complete Crypto Command Center

A comprehensive cryptocurrency platform powered by AI and blockchain technology, featuring event management, portfolio tracking, AI trading assistance, and real-time market analysis.

**Latest Update**: GitHub Actions deployment configured for automatic deployment to GitHub Pages.

## 🚀 Features

### Core Features
- **Events Map**: Discover and manage crypto events worldwide
- **Real-time Crypto Prices**: Live price tracking for 100+ cryptocurrencies
- **Learning Hub**: Educational content and resources
- **Blog System**: Community-driven content and insights
- **AI Chat Assistant**: Intelligent crypto Q&A and support

### 🧠 AI-Powered Features
- **AI Trading Assistant**: Get personalized trading insights and recommendations
- **Smart Event Recommendations**: AI suggests relevant events based on your interests
- **Portfolio Analytics**: Advanced portfolio analysis with AI insights
- **Market Sentiment Analysis**: AI-powered market trend analysis
- **Automated Insights**: Real-time market insights and actionable recommendations

### 💼 Wallet & Portfolio Management
- **Wallet Integration**: Connect MetaMask and other Web3 wallets
- **Portfolio Tracking**: Real-time portfolio value and performance
- **Advanced Analytics**: Sharpe ratio, volatility, risk assessment
- **Rebalancing Tools**: Automated portfolio rebalancing suggestions
- **Tax Loss Harvesting**: Identify tax optimization opportunities

### 🔗 Blockchain Integration
- **Multi-chain Support**: Ethereum, BSC, Polygon, and more
- **Smart Contract Interaction**: DeFi protocol integration
- **Transaction Tracking**: Real-time transaction monitoring
- **Gas Fee Optimization**: Network fee analysis and recommendations

### 🎯 Event Management
- **Event Creation**: Create and manage crypto events
- **Image Upload**: Add event images with drag-and-drop interface
- **Location Mapping**: Interactive map with event locations
- **Crypto Focus Tags**: Tag events with relevant cryptocurrencies
- **Real-time Updates**: Live event updates and notifications

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI GPT-4 Integration
- **Blockchain**: Ethereum RPC, Web3 Integration
- **UI Components**: Shadcn/ui, Lucide Icons
- **Real-time**: Supabase Realtime Subscriptions

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CryptoHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # OpenAI API Key (for AI features)
   VITE_OPENAI_API_KEY=your_openai_api_key

   # Blockchain Configuration
   VITE_RPC_URL=https://sepolia.bse.org

   # AgentKit Configuration (for AI agents)
   VITE_CDP_AGENT_KIT_NETWORK=base-mainnet
   VITE_CDP_API_KEY_NAME=your_agentkit_api_key_name
   VITE_CDP_API_KEY_SECRET_KEY=your_agentkit_api_key_secret

   # Crypto API Keys (optional)
   VITE_COINGECKO_API_KEY=your_coingecko_api_key
   VITE_CRYPTOCOMPARE_API_KEY=your_cryptocompare_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Set up the database tables (see Database Schema below)
   - Configure Storage buckets for event images
   - Set up authentication policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Events Table
```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  attendees INTEGER DEFAULT 0,
  description TEXT,
  lat DECIMAL,
  lng DECIMAL,
  crypto_focus TEXT[],
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Setup
Create a public bucket named `event-images` for storing event images.

## 🎨 Key Components

### AI Features
- **`useAIInsights`**: Hook for generating AI-powered insights
- **`AITradingAssistant`**: Component for trading recommendations
- **`usePortfolioAnalytics`**: Advanced portfolio analysis

### Wallet Integration
- **`useWallet`**: Hook for wallet connection and management
- **`WalletConnect`**: Component for wallet UI
- **`usePortfolioAnalytics`**: Portfolio performance tracking

### Event Management
- **`MapView`**: Interactive event map
- **`AddEventForm`**: Event creation with image upload
- **`EventDetails`**: Detailed event view with AI insights

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Enable Row Level Security (RLS)
3. Set up authentication
4. Create storage buckets
5. Configure real-time subscriptions

### AI Configuration
- OpenAI API key required for AI features
- Configure model parameters in `src/lib/config.ts`
- Set up rate limiting and usage monitoring

### Blockchain Configuration
- RPC URL for blockchain interactions
- MetaMask integration for wallet features
- Network configuration for multi-chain support

## 🚀 Deployment

### GitHub Pages Deployment
1. **Set up GitHub Secrets** (Required for API features):
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VITE_OPENAI_API_KEY`: Your OpenAI API key
     - `VITE_RPC_URL`: Blockchain RPC URL (optional)
     - `VITE_PRIVATE_KEY`: Your private key for blockchain features (optional)
     - `VITE_CDP_AGENT_KIT_NETWORK`: AgentKit network (optional)
     - `VITE_CDP_API_KEY_NAME`: AgentKit API key name (optional)
     - `VITE_CDP_API_KEY_SECRET_KEY`: AgentKit API key secret (optional)
     - `VITE_COINGECKO_API_KEY`: CoinGecko API key (optional)
     - `VITE_CRYPTOCOMPARE_API_KEY`: CryptoCompare API key (optional)

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"
   - The workflow will automatically deploy on push to main branch

3. **Access your site**: `https://yourusername.github.io/CryptoHub`

**Note**: Without API keys, the app will run with limited functionality (wallet connection and basic features will work, but AI features will be disabled).

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run preview
```

## 📱 Usage

### For Event Organizers
1. Navigate to Admin Panel
2. Create new events with images and details
3. Set crypto focus tags
4. Monitor event analytics

### For Users
1. Browse events on the map
2. Connect wallet for portfolio tracking
3. Use AI trading assistant for insights
4. Participate in community discussions

### For Developers
1. Extend AI features with custom prompts
2. Add new blockchain networks
3. Integrate additional DeFi protocols
4. Customize UI components

## 🔒 Security

- Environment variables for sensitive data
- Supabase RLS policies
- Input validation and sanitization
- Rate limiting for API calls
- Secure wallet connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community discussions

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced DeFi integration
- [ ] NFT marketplace
- [ ] Social trading features
- [ ] Advanced AI models
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Institutional features

---

**Built with ❤️ using React, TypeScript, and AI**

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. **Push to GitHub**: The project is configured with GitHub Actions for automatic deployment
2. **Enable GitHub Pages**: 
   - Go to your repository Settings → Pages
   - Set Source to "GitHub Actions"
3. **Update homepage URL**: Edit `package.json` and replace `[your-username]` with your actual GitHub username

### Manual Deployment

```bash
# Install gh-pages globally
npm install -g gh-pages

# Deploy to GitHub Pages
npm run deploy
```

### Configuration

1. **Update homepage URL** in `package.json`:
   ```json
   "homepage": "https://your-username.github.io/CryptoHub"
   ```

2. **Environment Variables**: Set up your environment variables in GitHub repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`

## Environment Setup

Create a `.env.local` file for local development:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── integrations/       # External service integrations
├── lib/                # Utility functions
└── utils/              # Helper utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details 