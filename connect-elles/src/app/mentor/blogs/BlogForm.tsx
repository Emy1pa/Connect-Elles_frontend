import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { Blog, BlogFormData, blogSchema } from "@/app/utils/types/blog";
import { Category } from "@/app/utils/interface";

interface BlogFormProps {
  categories: Category[];
  onSubmit: (data: BlogFormData) => Promise<void>;
  editingBlog: Blog | null;
  isSubmitting: boolean;
  onCancel: () => void;
}
const BlogForm: React.FC<BlogFormProps> = ({ categories, onSubmit, editingBlog, isSubmitting, onCancel }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(
    editingBlog?.blogImage ? `http://localhost:4000${editingBlog.blogImage}` : null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: editingBlog
      ? {
          title: editingBlog.title,
          content: editingBlog.content,
          summary: editingBlog.summary,
          status: editingBlog.status,
          categoryId: editingBlog.category?._id || "",
          blogImage: null,
        }
      : undefined,
  });

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

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-rose-400 focus:ring-2 focus:outline-none transition-all duration-300 bg-white/90";

  const buttonClass =
    "w-full px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-1 transition-all duration-300";

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
      <button onClick={onCancel} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-2xl font-bold text-slate-800 mb-6">{editingBlog ? "Edit Blog" : "Create New Blog"}</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Title</label>
          <input {...register("title")} className={inputClass} />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Category</label>
          <select {...register("categoryId")} className={inputClass}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Blog Image</label>
          <div className="relative">
            <input type="file" accept="image/*" className="hidden" id="blog-image" onChange={handleImageChange} />
            <label
              htmlFor="blog-image"
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-rose-200 rounded-xl cursor-pointer hover:border-rose-400 transition-all duration-300"
            >
              {previewImage ? (
                <div className="relative w-full h-full">
                  <Image src={previewImage} alt="Blog Preview" layout="fill" objectFit="cover" className="rounded-xl" />
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-rose-400" />
                  <span className="mt-2 block text-sm text-rose-600">Upload blog image</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Summary</label>
          <textarea {...register("summary")} className={inputClass} rows={3} />
          {errors.summary && <p className="mt-1 text-sm text-red-500">{errors.summary.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Content</label>
          <textarea {...register("content")} className={inputClass} rows={6} />
          {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Status</label>
          <select {...register("status")} className={inputClass}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${buttonClass} ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
  );
};

export default BlogForm;
