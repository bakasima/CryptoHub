
import React from 'react';
import { MessageSquare, Calendar, User } from 'lucide-react';

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

interface CommentsViewProps {
  comments: Comment[];
}

export const CommentsView = ({ comments }: CommentsViewProps) => {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
        <MessageSquare className="w-6 h-6" />
        <span>All Comments</span>
      </h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No comments yet</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {comment.profiles?.full_name || comment.profiles?.email}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  {comment.event_id && comment.events && (
                    <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded-full">
                      Event: {comment.events.title}
                    </span>
                  )}
                  {comment.blog_post_id && comment.blog_posts && (
                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full">
                      Blog: {comment.blog_posts.title}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
