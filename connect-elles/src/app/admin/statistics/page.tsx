"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Heart, MessageSquare, Book, Briefcase, Award } from "lucide-react";
import { fetchStatistics } from "./StatisticsService";
import { Statistics } from "@/app/utils/statistics";
import { useRouter } from "next/navigation";

const AdminStatisticsDashboard = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "admin") {
      router.replace("/");
    }
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics>({
    favorites: null,
    blogs: null,
    skills: null,
    services: null,
    reservations: null,
    comments: null,
    categories: null,
    users: null,
  });
  const loadStatistics = async (): Promise<void> => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    setIsLoading(true);
    try {
      const data = await fetchStatistics(token);
      setStatistics(data);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadStatistics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  const { favorites, comments, reservations, blogs, services, skills, categories, users } = statistics;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">My Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <p className="text-3xl font-bold text-purple-600">{reservations ? reservations.count : 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-slate-700">Blogs</h3>
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Book className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{blogs ? blogs.count : 0}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border-l-4 border-emerald-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-slate-700">Services</h3>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{services ? services.count : 0}</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 border-l-4 border-indigo-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-slate-700">Skills</h3>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{skills ? skills.count : 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-teal-50 rounded-xl p-4 border-l-4 border-teal-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-slate-700">Categories</h3>
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <Book className="w-5 h-5 text-teal-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-teal-600">{categories ? categories.count : 0}</p>
        </div>
      </div>
      {users && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-slate-700 mb-3">Users</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-600">Total</p>
              <p className="text-xl font-bold text-gray-600">{users.total}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-600">Admin</p>
              <p className="text-xl font-bold text-blue-600">{users.admin}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-600">Users</p>
              <p className="text-xl font-bold text-green-600">{users.user}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-600">Mentors</p>
              <p className="text-xl font-bold text-purple-600">{users.mentor}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminStatisticsDashboard;
