
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, User, MessageSquare, Plus } from 'lucide-react';
import { CommentForm } from './CommentForm';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  created_at: string;
  author_id: string;
  published: boolean;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

export const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles!blog_posts_author_id_fkey(full_name, email)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setBlogPosts(data);
        // Fetch comments for each post
        data.forEach(post => fetchComments(post.id));
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (blogPostId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!comments_author_id_fkey(full_name, email)
        `)
        .eq('blog_post_id', blogPostId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) {
        setComments(prev => ({
          ...prev,
          [blogPostId]: data
        }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentAdded = (blogPostId: string) => {
    setShowCommentForm(null);
    fetchComments(blogPostId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {blogPosts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No blog posts available</p>
        </div>
      ) : (
        blogPosts.map((post) => (
          <div key={post.id} className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.profiles?.full_name || post.profiles?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="text-gray-300 leading-relaxed mb-6">
              {selectedPost === post.id ? (
                <div>
                  <p className="whitespace-pre-wrap">{post.content}</p>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-purple-400 hover:text-purple-300 mt-4 text-sm"
                  >
                    Show less
                  </button>
                </div>
              ) : (
                <div>
                  <p>{post.excerpt || post.content.substring(0, 300)}...</p>
                  <button
                    onClick={() => setSelectedPost(post.id)}
                    className="text-purple-400 hover:text-purple-300 mt-4 text-sm"
                  >
                    Read more
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Comments ({comments[post.id]?.length || 0})</span>
                </h3>
                <button
                  onClick={() => setShowCommentForm(showCommentForm === post.id ? null : post.id)}
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Comment</span>
                </button>
              </div>

              {showCommentForm === post.id && (
                <div className="mb-4">
                  <CommentForm
                    blogPostId={post.id}
                    onCommentAdded={() => handleCommentAdded(post.id)}
                    onCancel={() => setShowCommentForm(null)}
                  />
                </div>
              )}

              <div className="space-y-3">
                {comments[post.id]?.map((comment) => (
                  <div key={comment.id} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">
                        {comment.profiles?.full_name || comment.profiles?.email}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
