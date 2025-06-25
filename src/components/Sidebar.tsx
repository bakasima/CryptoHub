
import React, { useState } from 'react';
import { MapPin, TrendingUp, BookOpen, Settings, Blocks, FileText, MessageSquare, User, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from './AuthPage';

type ViewType = 'map' | 'prices' | 'learning' | 'blockchain' | 'admin' | 'blogs' | 'chat';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isAdmin?: boolean;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const menuItems = [
    { id: 'map', label: 'Events Map', icon: MapPin },
    { id: 'prices', label: 'Crypto Prices', icon: TrendingUp },
    { id: 'learning', label: 'Learning Hub', icon: BookOpen },
    { id: 'blockchain', label: 'Blockchain Tech', icon: Blocks },
    { id: 'blogs', label: 'Blog Posts', icon: FileText },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    ...(profile?.is_admin ? [{ id: 'admin', label: 'Admin Panel', icon: Settings }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
  };

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
              onClick={() => onViewChange(item.id as ViewType)}
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

      {/* Admin Login/Logout Section */}
      <div className="mt-8 pt-4 border-t border-white/10">
        {user ? (
          <div>
            <div className="text-sm text-gray-400 mb-4">
              <p>Logged in as:</p>
              <p className="text-white font-medium truncate">{user.email}</p>
              {profile?.is_admin && (
                <p className="text-purple-400 text-xs">Admin</p>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 transition-all duration-200"
          >
            <LogIn className="w-5 h-5" />
            <span className="font-medium">Admin Login</span>
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && !user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Admin Login</h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="relative">
                <AuthPage />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
