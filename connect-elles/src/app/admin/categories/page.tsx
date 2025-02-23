"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Category,
  CategoryFormData,
  categorySchema,
} from "@/app/utils/types/category";
import { deleteCategory, editCategory } from "./category-actions";
import CategoryItem from "./CategoryItem";

const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(
        "http://localhost:4000/api/categories"
      );
      setCategories(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post<Category>(
        "http://localhost:4000/api/categories",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCategories((prev) => [...prev, response.data]);
      reset();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = async (categoryId: string, newTitle: string) => {
    try {
      const updatedCategory = await editCategory(categoryId, newTitle);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === categoryId ? updatedCategory : cat))
      );
    } catch (error) {
      alert("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (confirm(`Are you sure you want to delete "${category.title}"?`)) {
      try {
        await deleteCategory(category._id);
        setCategories((prev) => prev.filter((cat) => cat._id !== category._id));
      } catch (error) {
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
            <CategoryItem
              key={category._id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter category name"
                  {...register("title")}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

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
