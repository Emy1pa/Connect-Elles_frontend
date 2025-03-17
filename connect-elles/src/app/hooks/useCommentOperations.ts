import { useState } from "react";
import { Comment } from "@/app/utils/interface";
import { API_URL, getAuthHeaders } from "../utils/constants";
import axios from "axios";

export const useCommentOperations = (
  onCommentDeleted: (commentId: string) => void,
  onCommentUpdated: (commentId: string, updatedText: string) => void
) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleDeleteClick = (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment(commentId);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!token) {
      alert("You must be logged in to delete comments");
      return;
    }

    setIsDeleting(commentId);

    try {
      await axios.delete(`${API_URL}/comments/${commentId}`, getAuthHeaders());

      onCommentDeleted(commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (comment: Comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!token) {
      alert("You must be logged in to update comments");
      return;
    }

    if (!editText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    setIsUpdating(true);

    try {
      await axios.patch(
        `${API_URL}/comments/${commentId}`,
        {
          text: editText,
        },
        getAuthHeaders()
      );

      onCommentUpdated(commentId, editText);
      setEditingComment(null);
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
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
  };
};
