import { useState, useEffect } from "react";
import { Blog, Favorite } from "../utils/interface";
import { API_URL } from "../utils/constants";
import axios from "axios";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchUserFavorites = async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/favorites/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Error fetching favorites");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserFavorites();
  }, []);

  const removeFavorite = async (favoriteId: string) => {
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/favorites/${favoriteId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites(favorites.filter((fav) => fav._id !== favoriteId));
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  };

  return { favorites, isLoading, error, removeFavorite, fetchUserFavorites };
};
