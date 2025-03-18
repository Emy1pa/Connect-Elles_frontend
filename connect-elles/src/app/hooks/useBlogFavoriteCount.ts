import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/constants";

export const useBlogFavoriteCount = (blogId: string) => {
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [isLoadings, setIsLoadings] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!blogId) return;

    try {
      setIsLoadings(true);
      const response = await axios.get(`${API_URL}/favorites/blog/favorites/${blogId}`);
      setFavoriteCount(response.data.favoriteCount);
      setError(null);
    } catch (err) {
      console.error("Error fetching blog favorite count:", err);
      setError("Failed to fetch favorite count");
    } finally {
      setIsLoadings(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [blogId]);

  return { favoriteCount, isLoadings, error, refetch };
};
