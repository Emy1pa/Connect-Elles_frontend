import React, { useState } from "react";
import { X, Pencil, Trash2, Check } from "lucide-react";
import { Skill } from "@/app/utils/types/skill";

interface SkillItemsProps {
  skill: Skill;
  onEdit: (skillId: string, newTitle: string, newDescription: string) => Promise<void>;
  onDelete: (skill: Skill) => Promise<void>;
  onOpenEditModal?: (skill: Skill) => void;
}
const SkillItem: React.FC<SkillItemsProps> = ({ skill, onEdit, onDelete, onOpenEditModal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkill, setEditedSkill] = useState({
    title: skill.title,
    description: skill.description,
  });
  const handleSubmit = async () => {
    if (!editedSkill.title.trim() || !editedSkill.description.trim()) return;
    await onEdit(skill._id, editedSkill.title, editedSkill.description);
    setIsEditing(false);
  };
  const handleEditClick = () => {
    if (onOpenEditModal) {
      onOpenEditModal(skill);
    } else {
      setIsEditing(true);
    }
  };
  return (
    <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50 hover:scale-105 transition-all duration-300">
      <div className="flex flex-col">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedSkill.title}
              onChange={(e) => setEditedSkill({ ...editedSkill, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Skill title"
            />
            <textarea
              value={editedSkill.description}
              onChange={(e) =>
                setEditedSkill({
                  ...editedSkill,
                  description: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Skill description"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleSubmit} className="p-2 text-green-600 hover:text-green-700 transition-colors">
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-slate-600 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-slate-800">{skill.title}</h3>
              <div className="flex gap-2">
                <button onClick={handleEditClick} className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(skill)}
                  className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-slate-600">{skill.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillItem;
