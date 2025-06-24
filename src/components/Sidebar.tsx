import React from 'react';
import { MapPin, TrendingUp, BookOpen, Settings, Blocks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

type ViewType = 'map' | 'events' | 'learning' | 'prices' | 'admin';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isAdmin?: boolean;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'map', label: 'Events Map', icon: MapPin },
    { id: 'prices', label: 'Crypto Prices', icon: TrendingUp },
    { id: 'learning', label: 'Learning Hub', icon: BookOpen },
    { id: 'blockchain', label: 'Blockchain Tech', icon: Blocks },
    { id: 'admin', label: 'Admin Panel', icon: Settings },
  ];

  return (
    <div className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Blocks className="w-8 h-8 text-purple-400" />
          CryptoHub
        </h1>
        <p className="text-gray-400 text-sm mt-1">Blockchain Community</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as any)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="mt-8 pt-4 border-t border-white/10">
          <div className="text-sm text-gray-400">
            <p>Logged in as:</p>
            <p className="text-white font-medium truncate">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};
