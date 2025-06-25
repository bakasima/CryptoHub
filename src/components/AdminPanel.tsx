
import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Calendar, Settings, Plus, Edit, Trash2, Eye, MessageSquare, FileText, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AddEventForm } from './AddEventForm';
import { BlogPostForm } from './BlogPostForm';
import { CommentsView } from './CommentsView';

interface Event {
  id: string;
  title: string;
  event_type: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  description: string | null;
  crypto_focus: string[];
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  author_id: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  event_id: string | null;
  blog_post_id: string | null;
  profiles: {
    full_name: string | null;
    email: string;
  };
  events?: {
    title: string;
  };
  blog_posts?: {
    title: string;
  };
}

export const AdminPanel = () => {
  const { user, signOut } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'blogs' | 'comments'>('overview');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBlogs: 0,
    totalComments: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;
      if (eventsData) {
        setEvents(eventsData);
      }

      // Fetch blog posts
      const { data: blogsData, error: blogsError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (blogsError) throw blogsError;
      if (blogsData) {
        setBlogPosts(blogsData);
      }

      // Fetch comments with related data
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!comments_author_id_fkey(full_name, email),
          events(title),
          blog_posts(title)
        `)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      if (commentsData) {
        setComments(commentsData);
      }

      // Calculate stats
      const upcomingEvents = eventsData?.filter(event => new Date(event.date) > new Date()).length || 0;
      
      setStats({
        totalEvents: eventsData?.length || 0,
        totalBlogs: blogsData?.length || 0,
        totalComments: commentsData?.length || 0,
        upcomingEvents
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', blogId);

      if (error) throw error;
      
      setBlogPosts(blogPosts.filter(blog => blog.id !== blogId));
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const handleTogglePublish = async (blogId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !currentStatus })
        .eq('id', blogId);

      if (error) throw error;
      
      setBlogPosts(blogPosts.map(blog => 
        blog.id === blogId ? { ...blog, published: !currentStatus } : blog
      ));
    } catch (error) {
      console.error('Error updating blog post:', error);
    }
  };

  const handleEventAdded = () => {
    setShowAddEvent(false);
    fetchAdminData();
  };

  const handleBlogAdded = () => {
    setShowAddBlog(false);
    setEditingBlog(null);
    fetchAdminData();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (showAddEvent) {
    return (
      <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Add New Event</h1>
            <button
              onClick={() => setShowAddEvent(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
          <AddEventForm onEventAdded={handleEventAdded} />
        </div>
      </div>
    );
  }

  if (showAddBlog || editingBlog) {
    return (
      <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">
              {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <button
              onClick={() => {
                setShowAddBlog(false);
                setEditingBlog(null);
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
          <BlogPostForm blogPost={editingBlog} onBlogAdded={handleBlogAdded} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage events, blog posts, and user interactions</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Blog Posts</p>
                <p className="text-2xl font-bold text-white">{stats.totalBlogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Comments</p>
                <p className="text-2xl font-bold text-white">{stats.totalComments}</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-gray-400 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-white">{stats.upcomingEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            { key: 'overview', label: 'Overview', icon: Settings },
            { key: 'events', label: 'Events', icon: Calendar },
            { key: 'blogs', label: 'Blog Posts', icon: FileText },
            { key: 'comments', label: 'Comments', icon: MessageSquare }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAddEvent(true)}
                  className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Event</span>
                </button>
                <button
                  onClick={() => setShowAddBlog(true)}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Blog Post</span>
                </button>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {comments.slice(0, 5).map((comment) => (
                  <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                    <p className="text-white text-sm">{comment.content.substring(0, 100)}...</p>
                    <p className="text-gray-400 text-xs mt-1">
                      By {comment.profiles?.full_name || comment.profiles?.email} • {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Event Management</h2>
              <button
                onClick={() => setShowAddEvent(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div key={event.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{event.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>📅 {event.date} at {event.time}</p>
                    <p>📍 {event.location}</p>
                    <p>👥 {event.attendees} attendees</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.crypto_focus.map((crypto) => (
                      <span
                        key={crypto}
                        className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded-full text-xs"
                      >
                        {crypto}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Blog Management</h2>
              <button
                onClick={() => setShowAddBlog(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {blogPosts.map((blog) => (
                <div key={blog.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-white font-medium">{blog.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        blog.published 
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleTogglePublish(blog.id, blog.published)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingBlog(blog)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{blog.excerpt || blog.content.substring(0, 150)}...</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Created: {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <CommentsView comments={comments} />
        )}
      </div>
    </div>
  );
};
