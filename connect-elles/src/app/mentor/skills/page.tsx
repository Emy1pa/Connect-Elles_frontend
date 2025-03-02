"use client";
import React, { useState, useEffect } from "react";
import { Plus, Loader2, X, Pencil, Trash2, Check } from "lucide-react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skill, SkillFormData, skillSchema } from "@/app/utils/types/skill";
import { useForm } from "react-hook-form";
import { deleteSkill, editSkill, getAuthHeaders } from "./skill-action";
import SkillItem from "./SkillItem";
const SkillsList = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmit, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
  });
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get<Skill[]>(
        "http://localhost:4000/api/skills"
      );
      getAuthHeaders();
      setSkills(response.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.title.trim() || !newSkill.description.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post<Skill>(
        "http://localhost:4000/api/skills",
        { title: newSkill.title, description: newSkill.description },
        getAuthHeaders()
      );
      setSkills((prevSkills) => [...prevSkills, response.data]);
      reset();
      setNewSkill({ title: "", description: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
    setIsSubmitting(false);
  };

  const handleEditSkill = async (
    skillId: string,
    newSkill: string,
    newDescription: string
  ) => {
    try {
      const response = await editSkill(skillId, newSkill, newDescription);
      setSkills((prevSkills) =>
        prevSkills.map((skill) => (skill._id === skillId ? response : skill))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating skill:", error);
      alert("Failed to update skill. Please try again.");
    }
  };

  const handleDelete = async (skill: Skill) => {
    if (confirm(`Are you sure you want to delete "${skill.title}"?`)) {
      try {
        const skillId = skill._id;

        await deleteSkill(skill._id);
        setSkills((prevSkills) =>
          prevSkills.filter((s) => s._id !== skill._id)
        );
      } catch (error) {
        console.error("Error deleting skill:", error);
        alert("Failed to delete skill. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-medium">
            Skills
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Browse Our Skills
          </h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:shadow-lg hover:shadow-rose-500/25 flex items-center gap-2 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-rose-50 rounded-2xl border border-rose-200">
          <div className="text-xl font-medium text-slate-800 mb-2">
            No Skills Found
          </div>
          <p className="text-slate-600 text-center mb-4">
            Start by adding your first skill using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillItem
              key={skill._id}
              skill={skill}
              onEdit={handleEditSkill}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                Add New Skill
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <input
                type="text"
                placeholder="Skill title"
                {...register("title")}
                value={newSkill.title}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
              <textarea
                placeholder="Skill description"
                {...register("description")}
                value={newSkill.description}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                rows={4}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:shadow-lg hover:shadow-rose-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add Skill
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsList;
