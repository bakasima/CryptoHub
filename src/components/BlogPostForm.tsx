import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

interface BlogPostFormProps {
  blogPost?: BlogPost | null;
  onBlogAdded: () => void;
}

export const BlogPostForm = ({ blogPost, onBlogAdded }: BlogPostFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blogPost) {
      setFormData({
        title: blogPost.title,
        content: blogPost.content
      });
    }
  }, [blogPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const blogData = {
        title: formData.title,
        content: formData.content,
        author_id: user.id
      };

      if (blogPost) {
        // Update existing blog post
        const { error } = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', blogPost.id);

        if (error) throw error;
      } else {
        // Create new blog post
        const { error } = await supabase
          .from('blog_posts')
          .insert([blogData]);

        if (error) throw error;
      }

      onBlogAdded();
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Error saving blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter blog post title"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={12}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Write your blog post content here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Saving...' : (blogPost ? 'Update Post' : 'Create Post')}
        </button>
      </form>
    </div>
  );
};
