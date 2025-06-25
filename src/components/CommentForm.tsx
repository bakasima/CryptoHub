
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CommentFormProps {
  eventId?: string;
  blogPostId?: string;
  onCommentAdded: () => void;
  onCancel: () => void;
}

export const CommentForm = ({ eventId, blogPostId, onCommentAdded, onCancel }: CommentFormProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: content.trim(),
          author_id: user.id,
          event_id: eventId || null,
          blog_post_id: blogPostId || null
        });

      if (error) throw error;

      setContent('');
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white/5 rounded-lg p-4 text-center">
        <p className="text-gray-400">Please log in to add comments</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 rounded-lg p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        rows={3}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
      <div className="flex items-center justify-end space-x-2 mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Comment'}
        </button>
      </div>
    </form>
  );
};
