import { useState, useEffect } from "react";
import { Comment } from "@/app/utils/interface";
import axios from "axios";
import { API_URL } from "../utils/constants";

export const useBlogComments = (blogId: string, showComments: boolean) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    try {
      const response = await axios.get<Comment[]>(`${API_URL}/comments/blog/${blogId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, blogId]);

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
  };

  const handleCommentUpdated = (commentId: string, updatedText: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) => (comment._id === commentId ? { ...comment, text: updatedText } : comment))
    );
  };

  return {
    comments,
    handleCommentAdded,
    handleCommentDeleted,
    handleCommentUpdated,
  };
};
