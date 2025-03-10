"use client";
import React, { useState, useEffect } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { Skill, SkillFormData } from "@/app/utils/types/skill";
import { deleteSkill, editSkill, createSkill, fetchSkills } from "./skill-action";
import SkillItem from "./SkillItem";
import SkillForm from "./SkillForm";
import { useRouter } from "next/router";

const SkillsList = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "mentor") {
      router.replace("/");
    }
  }, []);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = localStorage.getItem("userId");
  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await fetchSkills(userId);
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSkill = async (skillId: string, newSkill: string, newDescription: string): Promise<void> => {
    try {
      const updatedSkill = await editSkill(skillId, newSkill, newDescription);
      setSkills((prevSkills) => prevSkills.map((skill) => (skill._id === skillId ? updatedSkill : skill)));
    } catch (error) {
      console.error("Error updating skill:", error);
      alert("Failed to update skill. Please try again.");
    }
  };

  const handleDelete = async (skill: Skill) => {
    if (confirm(`Are you sure you want to delete "${skill.title}"?`)) {
      try {
        await deleteSkill(skill._id);
        setSkills((prevSkills) => prevSkills.filter((s) => s._id !== skill._id));
      } catch (error) {
        console.error("Error deleting skill:", error);
        alert("Failed to delete skill. Please try again.");
      }
    }
  };
  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleFormSubmit = async (data: SkillFormData) => {
    setIsSubmitting(true);
    try {
      if (editingSkill) {
        const updatedSkill = await editSkill(editingSkill._id, data.title, data.description);
        setSkills((prevSkills) => prevSkills.map((skill) => (skill._id === editingSkill._id ? updatedSkill : skill)));
      } else {
        const newSkill = await createSkill(data);
        setSkills((prevSkills) => [...prevSkills, newSkill]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          <h2 className="mt-2 text-3xl font-bold text-slate-800">Browse Our Skills</h2>
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
          <div className="text-xl font-medium text-slate-800 mb-2">No Skills Found</div>
          <p className="text-slate-600 text-center mb-4">Start by adding your first skill using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillItem
              key={skill._id}
              skill={skill}
              onEdit={handleEditSkill}
              onDelete={handleDelete}
              onOpenEditModal={() => openEditModal(skill)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <SkillForm
            onSubmit={handleFormSubmit}
            editingSkill={editingSkill}
            isSubmitting={isSubmitting}
            onCancel={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default SkillsList;
