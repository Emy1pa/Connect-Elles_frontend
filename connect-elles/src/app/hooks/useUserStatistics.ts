import { useState, useEffect } from "react";
import { CommentStatistics, FavoriteStatistics, ReservationStatistic } from "@/app/utils/statistics";
import { API_URL } from "../utils/constants";

export const useUserStatistics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteStatistics | null>(null);
  const [reservations, setReservations] = useState<ReservationStatistic | null>(null);
  const [comments, setComments] = useState<CommentStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const fetchAllStatistics = async () => {
    if (!userId || !token) {
      setError("Authentication required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const favoritesResponse = await fetch(`${API_URL}/favorites/statistics/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const reservationsResponse = await fetch(`${API_URL}/reservations/statistics/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const commentsResponse = await fetch(`${API_URL}/comments/statistics/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json();
        setFavorites(favoritesData);
      } else {
        throw new Error("Failed to fetch favorites statistics");
      }

      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json();
        setReservations(reservationsData);
      } else {
        throw new Error("Failed to fetch reservations statistics");
      }

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } else {
        throw new Error("Failed to fetch comments statistics");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setError("Failed to load statistics");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllStatistics();
  }, [userId, token]);

  return { isLoading, favorites, reservations, comments, error };
};
