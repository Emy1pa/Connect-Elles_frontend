"use client";
import React, { useState, useEffect } from "react";
import { Plus, Loader2, X, Upload } from "lucide-react";
import Image from "next/image";
import { Blog, BlogFormData, blogSchema } from "@/app/utils/types/blog";
import { Category } from "@/app/utils/types/category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBlog,
  editBlog,
  deleteBlog,
  getAuthHeaders,
} from "./blog-action";
import BlogItem from "./BlogItem";

const BlogsList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/blogs", {
        headers: getAuthHeaders().headers,
      });
      const data = await response.json();
      setBlogs(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        headers: getAuthHeaders().headers,
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("blogImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setPreviewImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      if (editingBlog) {
        const updatedBlog = await editBlog(editingBlog._id, formData);
        setBlogs((prev) =>
          prev.map((blog) =>
            blog._id === editingBlog._id ? updatedBlog : blog
          )
        );
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
    reset({
      title: blog.title,
      content: blog.content,
      summary: blog.summary,
      status: blog.status,
      categoryId: blog.category?._id || "",
      blogImage: null,
    });

    setPreviewImage(
      blog.blogImage ? `http://localhost:5000${blog.blogImage}` : null
    );
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
    reset();
    setEditingBlog(null);
    setPreviewImage(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-teal-200 focus:border-teal-400 focus:ring-teal-400 focus:ring-2 focus:outline-none transition-all duration-300 bg-white/90";

  const buttonClass =
    "w-full px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transform hover:-translate-y-1 transition-all duration-300";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium">
            Blogs
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Manage Your Blogs
          </h2>
        </div>

        <button onClick={() => setIsModalOpen(true)} className={buttonClass}>
          <Plus className="w-5 h-5 inline-block mr-2" />
          Create Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-teal-50 rounded-2xl border border-teal-200">
          <div className="text-xl font-medium text-slate-800 mb-2">
            No Blogs Found
          </div>
          <p className="text-slate-600 text-center mb-4">
            Start by creating your first blog using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogItem
              key={blog._id}
              blog={blog}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={resetForm}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              {editingBlog ? "Edit Blog" : "Create New Blog"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  Title
                </label>
                <input {...register("title")} className={inputClass} />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  Category
                </label>
                <select {...register("categoryId")} className={inputClass}>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  Blog Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="blog-image"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="blog-image"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-teal-200 rounded-xl cursor-pointer hover:border-teal-400 transition-all duration-300"
                  >
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={previewImage}
                          alt="Blog Preview"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-xl"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-teal-400" />
                        <span className="mt-2 block text-sm text-teal-600">
                          Upload blog image
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  Summary
                </label>
                <textarea
                  {...register("summary")}
                  className={inputClass}
                  rows={3}
                />
                {errors.summary && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.summary.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  Content
                </label>
                <textarea
                  {...register("content")}
                  className={inputClass}
                  rows={6}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  Status
                </label>
                <select {...register("status")} className={inputClass}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${buttonClass} ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                    {editingBlog ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 inline-block mr-2" />
                    {editingBlog ? "Update Blog" : "Create Blog"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsList;
