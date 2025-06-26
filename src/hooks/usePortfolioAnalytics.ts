import { useState, useEffect } from 'react';
import { config } from '@/lib/config';

interface PortfolioAsset {
  symbol: string;
  amount: number;
  price: number;
  value: number;
  allocation: number;
  change24h: number;
  change7d: number;
}

interface PortfolioMetrics {
  totalValue: number;
  totalChange24h: number;
  totalChange7d: number;
  sharpeRatio: number;
  volatility: number;
  beta: number;
  maxDrawdown: number;
  correlation: number;
}

interface PortfolioAnalytics {
  assets: PortfolioAsset[];
  metrics: PortfolioMetrics;
  allocation: { [key: string]: number };
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  recommendations: string[];
}

export const usePortfolioAnalytics = () => {
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePortfolioAnalytics = async (portfolioData: any[], marketData: any[]) => {
    setLoading(true);
    setError(null);

    try {
      // Calculate basic portfolio metrics
      const assets: PortfolioAsset[] = portfolioData.map(asset => {
        const marketAsset = marketData.find(m => m.symbol === asset.symbol);
        const value = asset.amount * (marketAsset?.price || asset.price);
        const change24h = marketAsset?.change24h || 0;
        const change7d = marketAsset?.change7d || 0;

        return {
          symbol: asset.symbol,
          amount: asset.amount,
          price: marketAsset?.price || asset.price,
          value,
          allocation: 0, // Will be calculated below
          change24h,
          change7d,
        };
      });

      const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

      // Calculate allocations
      assets.forEach(asset => {
        asset.allocation = (asset.value / totalValue) * 100;
      });

      // Calculate portfolio metrics
      const totalChange24h = assets.reduce((sum, asset) => 
        sum + (asset.value * asset.change24h / 100), 0);
      const totalChange7d = assets.reduce((sum, asset) => 
        sum + (asset.value * asset.change7d / 100), 0);

      // Mock advanced metrics (in production, these would be calculated from historical data)
      const metrics: PortfolioMetrics = {
        totalValue,
        totalChange24h,
        totalChange7d,
        sharpeRatio: 1.2, // Mock value
        volatility: 0.15, // Mock value
        beta: 0.8, // Mock value
        maxDrawdown: -0.12, // Mock value
        correlation: 0.65, // Mock value
      };

      // Calculate allocation by category
      const allocation: { [key: string]: number } = {
        'Large Cap': 40,
        'Mid Cap': 30,
        'Small Cap': 20,
        'DeFi': 10,
      };

      // Determine risk profile
      let riskProfile: 'conservative' | 'moderate' | 'aggressive' = 'moderate';
      if (metrics.volatility < 0.1) riskProfile = 'conservative';
      else if (metrics.volatility > 0.2) riskProfile = 'aggressive';

      // Generate recommendations
      const recommendations = generateRecommendations(assets, metrics, riskProfile);

      setAnalytics({
        assets,
        metrics,
        allocation,
        riskProfile,
        recommendations,
      });

    } catch (err: any) {
      setError('Failed to calculate portfolio analytics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (
    assets: PortfolioAsset[], 
    metrics: PortfolioMetrics, 
    riskProfile: string
  ): string[] => {
    const recommendations: string[] = [];

    // Diversification recommendations
    if (assets.length < 5) {
      recommendations.push('Consider diversifying your portfolio with more assets to reduce risk.');
    }

    // Concentration risk
    const maxAllocation = Math.max(...assets.map(a => a.allocation));
    if (maxAllocation > 50) {
      recommendations.push('Your portfolio is heavily concentrated in one asset. Consider rebalancing.');
    }

    // Performance recommendations
    if (metrics.totalChange24h < -5) {
      recommendations.push('Your portfolio has declined significantly. Review your positions.');
    }

    if (metrics.sharpeRatio < 1) {
      recommendations.push('Consider optimizing your portfolio for better risk-adjusted returns.');
    }

    // Risk profile recommendations
    if (riskProfile === 'aggressive' && metrics.volatility > 0.25) {
      recommendations.push('Your portfolio is very volatile. Consider adding stable assets like USDC.');
    }

    if (riskProfile === 'conservative' && metrics.totalChange7d < -2) {
      recommendations.push('Even conservative portfolios can decline. Stay focused on long-term goals.');
    }

    return recommendations;
  };

  const rebalancePortfolio = async (targetAllocations: { [key: string]: number }) => {
    if (!analytics) return null;

    try {
      const rebalanceActions: any[] = [];
      const currentAssets = analytics.assets;

      Object.entries(targetAllocations).forEach(([symbol, targetAllocation]) => {
        const currentAsset = currentAssets.find(a => a.symbol === symbol);
        if (currentAsset) {
          const currentAllocation = currentAsset.allocation;
          const difference = targetAllocation - currentAllocation;

          if (Math.abs(difference) > 5) { // Only rebalance if difference > 5%
            const action = difference > 0 ? 'buy' : 'sell';
            const amount = Math.abs(difference) * analytics.metrics.totalValue / 100 / currentAsset.price;
            
            rebalanceActions.push({
              symbol,
              action,
              amount: amount.toFixed(4),
              reason: `Rebalance to ${targetAllocation.toFixed(1)}% allocation`,
            });
          }
        }
      });

      return rebalanceActions;
    } catch (err: any) {
      setError('Failed to calculate rebalancing actions: ' + err.message);
      return null;
    }
  };

  const calculateTaxLossHarvesting = async (portfolioData: any[]) => {
    try {
      const harvestingOpportunities: any[] = [];

      portfolioData.forEach(asset => {
        if (asset.change7d < -10) { // If asset declined more than 10% in 7 days
          harvestingOpportunities.push({
            symbol: asset.symbol,
            unrealizedLoss: asset.value * Math.abs(asset.change7d) / 100,
            recommendation: `Consider selling ${asset.symbol} to harvest tax losses`,
          });
        }
      });

      return harvestingOpportunities;
    } catch (err: any) {
      setError('Failed to calculate tax loss harvesting: ' + err.message);
      return [];
    }
  };

  return {
    analytics,
    loading,
    error,
    calculatePortfolioAnalytics,
    rebalancePortfolio,
    calculateTaxLossHarvesting,
  };
}; 