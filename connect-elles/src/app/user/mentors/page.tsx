"use client";
import React, { useState, useEffect } from "react";
import { UserCircle2, Search, ArrowRight } from "lucide-react";
import { API_URL } from "@/app/utils/constants";
import axios from "axios";

interface Mentor {
  _id: string;
  fullName: string;
  email: string;
  username?: string;
  profileImage?: string;
  userRole?: string;
}

const MentorsList: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/users/mentors`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch mentors");
        }

        setMentors(response.data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) =>
    mentor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Meet Our Mentors</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Discover inspiring professionals ready to guide your journey
          </p>

          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-pink-200 focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">No mentors found matching your search</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor._id}
                className="flex items-center bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-pink-100/50 hover:shadow-pink-200/50 transition-all duration-300 border border-pink-100 group"
              >
                <div className="flex-shrink-0 mr-6">
                  {mentor.profileImage ? (
                    <img
                      src={`${API_URL}${mentor.profileImage}`}
                      alt={mentor.fullName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-pink-100 group-hover:border-pink-200 transition-all"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center">
                      <UserCircle2 className="w-16 h-16 text-pink-300" />
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-pink-600 transition-colors">
                    {mentor.fullName}
                  </h2>
                  <div className="text-slate-600 mb-2">
                    <span className="mr-4">@{mentor.username || "mentor"}</span>
                    <span className="text-pink-600">{mentor.email}</span>
                  </div>
                  <p className="text-slate-500 italic">
                    Passionate about guiding and inspiring professionals
                  </p>
                </div>

                <div className="ml-6">
                  <button
                    onClick={() => console.log("View Mentor Details", mentor)}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center"
                  >
                    View Profile
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorsList;
