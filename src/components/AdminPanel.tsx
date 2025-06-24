
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AddEventForm } from './AddEventForm';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, Database } from 'lucide-react';
import { seedDefaultEvents } from '@/utils/seedEvents';
import { useToast } from '@/hooks/use-toast';

export const AdminPanel = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const { profile, signOut } = useAuth();
  const { toast } = useToast();

  if (!profile?.is_admin) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p>You don't have admin permissions to access this panel.</p>
        </div>
      </div>
    );
  }

  const handleEventAdded = () => {
    setShowAddForm(false);
  };

  const handleSeedEvents = async () => {
    if (!profile?.id) return;
    
    setIsSeeding(true);
    try {
      const result = await seedDefaultEvents(profile.id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Default events have been added to the database.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to seed events. They may already exist.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error seeding events:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while seeding events.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="h-full p-6 bg-gradient-to-br from-slate-900 to-slate-800 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-300">Welcome, {profile.full_name || profile.email}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSeedEvents}
              disabled={isSeeding}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Database className="w-4 h-4 mr-2" />
              {isSeeding ? 'Adding...' : 'Seed Events'}
            </Button>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
            <Button
              onClick={signOut}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {showAddForm ? (
          <div className="flex justify-center">
            <AddEventForm
              onEventAdded={handleEventAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Event Management</h2>
            <p className="text-gray-300 mb-4">
              Manage crypto events for the community. Use "Seed Events" to add sample blockchain events, or create custom events with "Add Event".
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white">Total Events</h3>
                <p className="text-2xl font-bold text-purple-400">-</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white">This Month</h3>
                <p className="text-2xl font-bold text-blue-400">-</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white">Upcoming</h3>
                <p className="text-2xl font-bold text-green-400">-</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
