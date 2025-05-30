// src/components/CommentItem.jsx
import React from 'react';

export default function CommentItem({ comment }) {
  return (
    <div className="border border-gray-300 rounded-md p-3 mb-2 bg-gray-50">
      <p className="text-sm text-gray-700">{comment.content}</p>
      <div className="text-xs text-gray-400 mt-1">       
        {comment.created_at && (
          <span className="ml-2">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
