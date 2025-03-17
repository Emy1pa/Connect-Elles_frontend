import React from "react";
import { Comment } from "@/app/utils/interface";
import { User, Clock, Trash2, Edit, Save, X } from "lucide-react";
import { useCommentOperations } from "@/app/hooks/useCommentOperations";
import { formatDate } from "@/app/utils/constants";

interface CommentListProps {
  comments: Comment[];
  onCommentDeleted: (commentId: string) => void;
  onCommentUpdated: (commentId: string, updatedText: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onCommentDeleted, onCommentUpdated }) => {
  const {
    isDeleting,
    editingComment,
    editText,
    isUpdating,
    userId,
    setEditText,
    handleDeleteClick,
    handleEditClick,
    handleCancelEdit,
    handleSaveEdit,
  } = useCommentOperations(onCommentDeleted, onCommentUpdated);
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white">
                {comment.user && comment.user.profileImage ? (
                  <img
                    src={`http://localhost:4000${comment.user?.profileImage}`}
                    alt={comment.user?.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-slate-800">{comment.user?.fullName}</h4>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatDate(comment.createdAt)}
            </div>
            {userId === comment.user?._id && (
              <div className="flex">
                <button
                  onClick={() => handleEditClick(comment)}
                  disabled={isDeleting === comment._id || isUpdating}
                  className={`p-1.5 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors mr-1 ${
                    isDeleting === comment._id || isUpdating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  aria-label="Edit comment"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteClick(comment._id)}
                  disabled={isDeleting === comment._id}
                  className={`p-1.5 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors ${
                    isDeleting === comment._id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  aria-label="Delete comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {editingComment === comment._id ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none min-h-[100px]"
                disabled={isUpdating}
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-1" /> Cancel
                </button>
                <button
                  onClick={() => handleSaveEdit(comment._id)}
                  disabled={isUpdating || !editText.trim()}
                  className={`px-3 py-1.5 rounded-lg flex items-center ${
                    isUpdating || !editText.trim()
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                  }`}
                >
                  <Save className="w-4 h-4 mr-1" /> {isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-slate-700 whitespace-pre-line">{comment.text}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
