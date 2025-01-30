"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Loader2, X, Pencil, Trash2, Check } from "lucide-react";

interface Category {
  _id: string;
  title: string;
}

const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    console.log("Current token:", token);
    if (!token) {
      console.error("Token is missing");
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(
        "http://localhost:5000/api/categories"
      );
      getAuthHeaders();

      setCategories(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post<Category>(
        "http://localhost:5000/api/categories",
        { title: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCategories((prevCategories) => [...prevCategories, response.data]);
      setNewCategory("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
    setIsSubmitting(false);
  };
  const startEditing = (category: Category) => {
    setEditingId(category._id);
    setEditedTitle(category.title);
  };

  const handleEditSubmit = async (categoryId: string) => {
    if (!editedTitle.trim()) return;

    try {
      const response = await axios.put<Category>(
        `http://localhost:5000/api/categories/${categoryId}`,
        { title: editedTitle },
        getAuthHeaders()
      );

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === categoryId ? response.data : cat
        )
      );
      setEditingId(null);
      setEditedTitle("");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  };
  const handleDelete = async (category: Category) => {
    console.log(category._id);
    if (confirm(`Are you sure you want to delete "${category.title}"?`)) {
      try {
        const categoryId = category._id;
        await axios.delete(
          `http://localhost:5000/api/categories/${categoryId}`,
          getAuthHeaders()
        );
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat._id !== category._id)
        );
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
            Categories
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Browse Our Categories
          </h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/25 flex items-center gap-2 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-pink-50 rounded-2xl border border-pink-200">
          <div className="text-xl font-medium text-slate-800 mb-2">
            No Categories Found
          </div>
          <p className="text-slate-600 text-center mb-4">
            Start by adding your first category using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="p-6 rounded-2xl border border-pink-200 bg-pink-50 hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col">
                {editingId === category._id ? (
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
                        onClick={() => handleEditSubmit(category._id)}
                        className="p-2 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-slate-600 hover:text-slate-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">
                      {category.title}
                    </h3>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEditing(category)}
                        className="p-2 text-slate-600 hover:text-pink-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Add New Category
            </h3>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
