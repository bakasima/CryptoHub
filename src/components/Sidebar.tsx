
import React from 'react';
import { MapPin, Users, Search, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'map' | 'events' | 'learning' | 'prices') => void;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const navItems = [
    { id: 'map', icon: MapPin, label: 'Event Map', description: 'Discover local crypto events' },
    { id: 'learning', icon: Search, label: 'Learning Hub', description: 'AI-powered crypto education' },
    { id: 'prices', icon: Youtube, label: 'Market Data', description: 'Real-time crypto prices' },
  ];

  return (
    <div className="w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">CoinHub</h1>
        <p className="text-gray-300 text-sm">Local crypto community & learning</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as any)}
              className={cn(
                "w-full p-4 rounded-xl text-left transition-all duration-200 group",
                currentView === item.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/20">
        <h3 className="text-white font-medium mb-2">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-300">
            <span>Active Events</span>
            <span className="text-purple-400">12</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Community Members</span>
            <span className="text-blue-400">1,247</span>
          </div>
        </div>
      </div>
    </div>
  );
};
