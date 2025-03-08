"use client";
import React, { useState, useEffect } from "react";
import { UserCircle2, X } from "lucide-react";
import { API_URL } from "@/app/utils/constants";
import axios from "axios";
import { Mentor, Skill } from "@/app/utils/interface";

const MentorProfileModal: React.FC<{
  mentor: Mentor;
  onClose: () => void;
}> = ({ mentor, onClose }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const fetchMentorSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/skills/mentor/${mentor._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching mentor skills:", error);
    } finally {
      setIsLoadingSkills(false);
    }
  };
  useEffect(() => {
    fetchMentorSkills();
  }, [mentor._id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="flex items-center mb-8">
          {mentor.profileImage ? (
            <img
              src={`${API_URL}${mentor.profileImage}`}
              alt={mentor.fullName}
              className="w-32 h-32 rounded-full object-cover border-4 border-pink-100 mr-6"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-pink-100 flex items-center justify-center mr-6">
              <UserCircle2 className="w-20 h-20 text-pink-300" />
            </div>
          )}

          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{mentor.fullName}</h2>
            <div className="text-slate-600">
              <p className="mb-1">@{mentor.username || "mentor"}</p>
              <p className="text-pink-600">{mentor.email}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-slate-800 mb-6">Skills</h3>
          {isLoadingSkills ? (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
          ) : skills.length === 0 ? (
            <p className="text-slate-500 italic">No skills listed</p>
          ) : (
            <div className="space-y-4">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  className="bg-pink-50 rounded-2xl p-4 border border-pink-100 hover:bg-pink-100/50 transition-colors"
                >
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">{skill.title}</h4>
                  <p className="text-slate-600">{skill.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfileModal;
