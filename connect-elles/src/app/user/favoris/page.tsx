"use client";
import React, { useState, useEffect } from "react";
import { Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  blogImage: string;
  summary: string;
}

interface Favorite {
  _id: string;
  blog: Blog | null;
}

const UserFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!userId || !token) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:4000/favorites/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFavorites();
  }, [userId, token]);

  const handleRemoveFavorite = async (favoriteId: string) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:4000/favorites/${favoriteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav._id !== favoriteId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center p-12 bg-pink-50 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-pink-600 mb-4">
              No Favorites Yet
            </h2>
            <p className="text-slate-600 mb-8">
              You haven't added any blogs to your favorites.
            </p>
            <Link href="/user/blogs">
              <div className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300">
                Browse Blogs
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-10 relative inline-block after:content-[''] after:absolute after:w-full after:h-2 after:bg-pink-300 after:bottom-0 after:left-0 pb-3">
          My Favorites
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map(
            (favorite) =>
              favorite.blog && (
                <div
                  key={favorite._id}
                  className="bg-pink-50 rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="relative h-48">
                    <Image
                      src={
                        favorite.blog.blogImage
                          ? `http://localhost:4000${favorite.blog.blogImage}`
                          : "/api/placeholder/800/400"
                      }
                      alt={favorite.blog.title}
                      className="w-full h-full object-cover"
                      width={800}
                      height={400}
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleRemoveFavorite(favorite._id)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-pink-600 hover:bg-white hover:text-pink-700 transition-colors shadow-md"
                        aria-label="Remove from favorites"
                      >
                        <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 border-t-4 border-pink-400">
                    <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                      {favorite.blog.title}
                    </h2>
                    <p className="text-slate-600 mb-6 line-clamp-3">
                      {favorite.blog.summary}
                    </p>
                    <Link href={`blogs/${favorite.blog._id}`}>
                      <div className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-md shadow-pink-500/20 hover:shadow-pink-500/30 transform hover:-translate-y-1 transition-all duration-300">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </Link>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFavorites;
