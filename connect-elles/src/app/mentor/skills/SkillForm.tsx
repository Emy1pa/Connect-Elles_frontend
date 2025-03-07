import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Plus, Check } from "lucide-react";
import { Skill, SkillFormData, skillSchema } from "@/app/utils/types/skill";

interface SkillFormProps {
  onSubmit: (data: SkillFormData) => Promise<void>;
  editingSkill: Skill | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ onSubmit, editingSkill, isSubmitting, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: editingSkill
      ? {
          title: editingSkill.title,
          description: editingSkill.description,
        }
      : undefined,
  });

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-rose-400 focus:ring-2 focus:outline-none transition-all duration-300 bg-white/90";

  const buttonClass =
    "w-full px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-1 transition-all duration-300";

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl relative">
      <button onClick={onCancel} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-2xl font-bold text-slate-800 mb-6">{editingSkill ? "Edit Skill" : "Add New Skill"}</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Title</label>
          <input {...register("title")} className={inputClass} />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Description</label>
          <textarea {...register("description")} className={inputClass} rows={4} />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${buttonClass} ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
              {editingSkill ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              {editingSkill ? (
                <Check className="w-4 h-4 inline-block mr-2" />
              ) : (
                <Plus className="w-4 h-4 inline-block mr-2" />
              )}
              {editingSkill ? "Update Skill" : "Add Skill"}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SkillForm;
