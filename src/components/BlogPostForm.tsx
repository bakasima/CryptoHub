
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  published: boolean;
}

interface BlogPostFormProps {
  blogPost?: BlogPost | null;
  onBlogAdded: () => void;
}

export const BlogPostForm = ({ blogPost, onBlogAdded }: BlogPostFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blogPost) {
      setFormData({
        title: blogPost.title,
        content: blogPost.content,
        excerpt: blogPost.excerpt || '',
        published: blogPost.published
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
        excerpt: formData.excerpt || null,
        published: formData.published,
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
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
          <label className="block text-white font-medium mb-2">Excerpt</label>
          <input
            type="text"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Brief description of the post"
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

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="published"
            id="published"
            checked={formData.published}
            onChange={handleInputChange}
            className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
          />
          <label htmlFor="published" className="text-white font-medium">
            Publish immediately
          </label>
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
