import React, { useState } from 'react';
import { Map, TrendingUp, BookOpen, Settings, MessageSquare, FileText, Users, Wallet, Brain, LogIn, LogOut, Menu, X, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from './AuthPage';

type ViewType = 'map' | 'prices' | 'learning' | 'blockchain' | 'admin' | 'blogs' | 'chat' | 'wallet' | 'ai-trading' | 'tickets';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isAdmin?: boolean;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const { user, profile, signOut, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'map', label: 'Events Map', icon: Map },
    { id: 'prices', label: 'Crypto Prices', icon: TrendingUp },
    { id: 'learning', label: 'Learning Hub', icon: BookOpen },
    { id: 'blockchain', label: 'Blockchain Hub', icon: TrendingUp },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'ai-trading', label: 'AI Trading', icon: Brain },
    { id: 'tickets', label: 'My Tickets', icon: Ticket },
    { id: 'blogs', label: 'Blog Posts', icon: FileText },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    ...(profile?.is_admin ? [{ id: 'admin', label: 'Admin Panel', icon: Settings }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const handleViewChange = (view: ViewType) => {
    onViewChange(view);
    setIsMobileMenuOpen(false); // Close mobile menu when item is selected
  };

  const SidebarContent = () => (
    <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white">CryptoHub</h1>
        <p className="text-gray-400 text-xs sm:text-sm">Your Crypto Command Center</p>
      </div>

      {/* Always Visible Login/Logout Button */}
      <div className="mb-4 p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg">
        {user ? (
          <div className="space-y-2">
            <div className="text-xs text-purple-300">
              <p>Logged in as:</p>
              <p className="text-white font-medium truncate">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-all duration-200 text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 text-sm font-medium"
          >
            <LogIn className="w-4 h-4" />
            <span>Login / Register</span>
          </button>
        )}
      </div>

      <nav className="space-y-1 sm:space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id as ViewType)}
              className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-2">Powered by AI & Blockchain</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-purple-400 text-xs">Live</span>
          </div>
        </div>
      </div>

      {/* Debug Section - Remove this after fixing the issue */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-xs text-gray-500 mb-2">Debug Info:</div>
        <div className="text-xs text-gray-400 space-y-1">
          <div>User: {user ? 'Logged In' : 'Not Logged In'}</div>
          <div>Email: {user?.email || 'None'}</div>
          <div>Admin: {profile?.is_admin ? 'Yes' : 'No'}</div>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-black/40 backdrop-blur-xl border border-white/20 text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Floating Login Button for Mobile */}
      <div className="md:hidden fixed top-4 right-4 z-40">
        {user ? (
          <button
            onClick={handleSignOut}
            className="bg-red-600/20 backdrop-blur-xl border border-red-500/30 text-red-300 p-2 rounded-lg hover:bg-red-600/30 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-purple-600 backdrop-blur-xl border border-purple-500/30 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
            title="Login"
          >
            <LogIn className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed md:relative inset-y-0 left-0 z-40 bg-black/40 backdrop-blur-xl border-r border-white/20 transition-transform duration-300 ease-in-out",
        "w-64 p-4 sm:p-6 overflow-y-auto",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <SidebarContent />
      </div>

      {/* Auth Modal */}
      {showAuthModal && !user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white">Admin Login</h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
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
    </>
  );
};
