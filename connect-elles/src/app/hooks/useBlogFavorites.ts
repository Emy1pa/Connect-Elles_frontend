import { useState, useEffect } from "react";
import { Favorite } from "@/app/utils/interface";
import axios from "axios";
import { API_URL } from "../utils/constants";

export const useBlogFavorites = (blogId: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      checkIfFavorite(userId, token);
    }
  }, [blogId]);

  const checkIfFavorite = async (userId: string, token: string) => {
    try {
      const response = await axios.get<Favorite[]>(`${API_URL}/favorites/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const favorites = response.data;
      const favorite = favorites.find((fav) => fav.blog && fav.blog._id === blogId);
      if (favorite) {
        setIsFavorite(true);
        setFavoriteId(favorite._id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const handleFavoriteToggle = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      alert("Please log in to add favorites");
      return;
    }

    try {
      if (isFavorite && favoriteId) {
        await axios.delete(`${API_URL}/favorites/${favoriteId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await axios.post(
          `${API_URL}/favorites/${userId}/${blogId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsFavorite(true);
        setFavoriteId(response.data._id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return { isFavorite, handleFavoriteToggle };
};
