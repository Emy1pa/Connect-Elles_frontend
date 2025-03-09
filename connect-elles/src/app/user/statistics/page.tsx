"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Heart, MessageSquare } from "lucide-react";
import { CommentStatistics, FavoriteStatistics, ReservationStatistic } from "@/app/utils/statistics";
import { useUserStatistics } from "@/app/hooks/useUserStatistics";

const UserStatisticsDashboard = () => {
  const { isLoading, favorites, reservations, comments, error } = useUserStatistics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white p-6">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <p>{error}</p>
        </div>
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
          <p className="text-3xl font-bold text-pink-600">{favorites ? favorites.count : 0}</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-slate-700">Comments</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{comments ? comments.count : 0}</p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-slate-700">Reservations</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">{reservations ? reservations.total : 0}</p>
        </div>
      </div>

      {reservations && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-slate-700 mb-3">Reservation Status</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{reservations.pending}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-600">Confirmed</p>
              <p className="text-xl font-bold text-green-600">{reservations.confirmed}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-600">Canceled</p>
              <p className="text-xl font-bold text-red-600">{reservations.canceled}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatisticsDashboard;
