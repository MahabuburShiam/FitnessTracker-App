import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as journalApi from '../../api/journal';

const CommentSection = ({ entryId, initialComments = [] }) => {
  const { token } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const addedComment = await journalApi.addComment(entryId, { content: newComment }, token);
      setComments(prev => [...prev, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-3">Comments ({comments.length})</h4>
      <div className="space-y-4 mb-6">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-100 p-3 rounded-lg">
            <p className="font-semibold text-sm">{comment.User.name}</p>
            <p className="text-gray-800">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="2"
          className="w-full p-2 border rounded-md"
          required
        />
        <div className="text-right mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded disabled:bg-blue-300"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;