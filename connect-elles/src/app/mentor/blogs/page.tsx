"use client";
import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Blog, BlogFormData } from "@/app/utils/types/blog";
import BlogItem from "./BlogItem";
import BlogForm from "./BlogForm";
import { Category } from "@/app/utils/interface";
import { createBlog, deleteBlog, editBlog, fetchBlogs } from "./blog-action";
import { fetchCategories } from "@/app/utils/constants";
import { useRouter } from "next/navigation";

const BlogsList = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "mentor") {
      router.replace("/");
    }
  }, []);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");
      const [blogsData, categoriesData] = await Promise.all([fetchBlogs(userId), fetchCategories()]);
      setBlogs(blogsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSumbit = async (data: BlogFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      if (data.blogImage) {
        formData.append("blogImage", data.blogImage);
      }
      if (editingBlog) {
        const updatedBlog = await editBlog(editingBlog._id.toString(), formData);
        setBlogs((prev) => prev.map((blog) => (blog._id === editingBlog._id ? updatedBlog : blog)));
      } else {
        const newBlog = await createBlog(formData);
        setBlogs((prev) => [...prev, newBlog]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(blogId);
        setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog");
      }
    }
  };

  const resetForm = () => {
    setEditingBlog(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  const buttonClass =
    "w-full px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-1 transition-all duration-300";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-medium">
            Blogs
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">Manage Your Blogs</h2>
        </div>

        <button onClick={() => setIsModalOpen(true)} className={buttonClass}>
          <Plus className="w-5 h-5 inline-block mr-2" />
          Create Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-rose-50 rounded-2xl border border-rose-200">
          <div className="text-xl font-medium text-slate-800 mb-2">No Blogs Found</div>
          <p className="text-slate-600 text-center mb-4">Start by creating your first blog using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogItem key={blog._id} blog={blog} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <BlogForm
            categories={categories}
            onSubmit={handleSumbit}
            editingBlog={editingBlog}
            isSubmitting={isSubmitting}
            onCancel={resetForm}
          />
        </div>
      )}
    </div>
  );
};

export default BlogsList;
