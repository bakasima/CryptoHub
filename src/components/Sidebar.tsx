
import React from 'react';
import { MapPin, Calendar, BookOpen, TrendingUp, Shield } from 'lucide-react';

type ViewType = 'map' | 'events' | 'learning' | 'prices' | 'admin';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isAdmin?: boolean;
}

export const Sidebar = ({ currentView, onViewChange, isAdmin = false }: SidebarProps) => {
  const menuItems = [
    { id: 'map', label: 'Event Map', icon: MapPin },
    { id: 'events', label: 'Event Details', icon: Calendar },
    { id: 'learning', label: 'Learning Hub', icon: BookOpen },
    { id: 'prices', label: 'Market Data', icon: TrendingUp },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield });
  }

  return (
    <div className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">CryptoHub</h1>
        <p className="text-gray-400 text-sm">Discover • Learn • Connect</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-purple-600/30 text-white border border-purple-500/50'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-8 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
        <h3 className="text-white font-medium mb-2">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-300">
            <span>Events Today</span>
            <span className="text-purple-400">-</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Community Size</span>
            <span className="text-blue-400">-</span>
          </div>
        </div>
      </div>
    </div>
  );
};
