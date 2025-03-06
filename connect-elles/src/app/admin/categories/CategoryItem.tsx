import React, { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Category } from "@/app/utils/interface";

interface CategoryItemProps {
  category: Category;
  onEdit: (categoryId: string, newTitle: string) => Promise<void>;
  onDelete: (category: Category) => Promise<void>;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(category.title);

  const handleSubmit = async () => {
    if (!editedTitle.trim()) return;
    await onEdit(category._id, editedTitle);
    setIsEditing(false);
  };

  return (
    <div className="p-6 rounded-2xl border border-pink-200 bg-pink-50 hover:scale-105 transition-all duration-300">
      <div className="flex flex-col">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 px-3 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              autoFocus
            />
            <div>
              <button
                onClick={handleSubmit}
                className="p-2 text-green-600 hover:text-green-700 transition-colors"
              >
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
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">{category.title}</h3>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-slate-600 hover:text-pink-500 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(category)}
                className="p-2 text-slate-600 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;
