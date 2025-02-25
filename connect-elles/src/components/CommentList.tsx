import React from "react";
import { Comment } from "@/app/utils/interface";
import { User, Clock } from "lucide-react";

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white">
                {comment.user.profileImage ? (
                  <img
                    src={`http://localhost:4000${comment.user.profileImage}`}
                    alt={comment.user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-slate-800">
                  {comment.user.fullName}
                </h4>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="text-slate-700 whitespace-pre-line">
            {comment.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
