import React, { useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import { getAuthHeaders } from "@/app/utils/constants";
interface CommentFormProps {
  blogId: string;
  user: string | null;
  onCommentAdded: (newComment: any) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ blogId, user, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;
    if (!userId || !token) {
      alert("Please log in to add a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`http://localhost:4000/comments/${user}/${blogId}`, { text }, getAuthHeaders());

      onCommentAdded(response.data);
      setText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex items-start space-x-4">
        <div className="flex-grow">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none min-h-[100px]"
            disabled={isSubmitting || !user || localStorage.getItem("userRole") !== "normal-user"}
          />
          {!user && <p className="mt-2 text-sm text-rose-500">Please log in to comment</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !text.trim() || !userId}
          className={`px-4 py-3 rounded-lg ${
            isSubmitting || !text.trim() || !userId
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300"
          }`}
          aria-label="Submit comment"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
