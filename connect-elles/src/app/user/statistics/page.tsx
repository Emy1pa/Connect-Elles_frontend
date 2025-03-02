"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Heart, MessageSquare } from "lucide-react";

interface FavoriteStatistics {
  count: number;
}

interface ReservationStatistics {
  total: number;
  pending: number;
  confirmed: number;
  canceled: number;
}

interface CommentStatistics {
  count: number;
}

const UserStatisticsDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteStatistics | null>(null);
  const [reservations, setReservations] =
    useState<ReservationStatistics | null>(null);
  const [comments, setComments] = useState<CommentStatistics | null>(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllStatistics = async () => {
      if (!userId || !token) return;

      setIsLoading(true);
      try {
        const favoritesResponse = await fetch(
          `http://localhost:4000/favorites/statistics/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const reservationsResponse = await fetch(
          `http://localhost:4000/reservations/statistics/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const commentsResponse = await fetch(
          `http://localhost:4000/comments/statistics/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          setFavorites(favoritesData);
        }

        if (reservationsResponse.ok) {
          const reservationsData = await reservationsResponse.json();
          setReservations(reservationsData);
        }

        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStatistics();
  }, [userId, token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">My Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-pink-50 rounded-xl p-4 border-l-4 border-pink-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-slate-700">Favorites</h3>
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-pink-600">
            {favorites ? favorites.count : 0}
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-slate-700">Comments</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {comments ? comments.count : 0}
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-slate-700">Reservations</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {reservations ? reservations.total : 0}
          </p>
        </div>
      </div>

      {reservations && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-slate-700 mb-3">
            Reservation Status
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {reservations.pending}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-600">Confirmed</p>
              <p className="text-xl font-bold text-green-600">
                {reservations.confirmed}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-600">Canceled</p>
              <p className="text-xl font-bold text-red-600">
                {reservations.canceled}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatisticsDashboard;
