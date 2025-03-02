import React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Blog } from "@/app/utils/types/blog";

interface BlogItemProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (blogId: string) => void;
}

const BlogItem: React.FC<BlogItemProps> = ({ blog, onEdit, onDelete }) => {
  const imageLoader = ({ src }: { src: string }) => {
    return `http://localhost:4000${src}`;
  };

  return (
    <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50 hover:shadow-lg transition-all duration-300">
      {blog.blogImage && (
        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
          <Image
            src={blog.blogImage}
            alt={blog.title}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
            loader={imageLoader}
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">{blog.title}</h3>
          <span className="text-sm text-slate-500">{blog.category?.title}</span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            blog.status === "PUBLISHED"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {blog.status}
        </span>
      </div>

      <p className="text-slate-600 mb-4 line-clamp-3">{blog.summary}</p>

      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-500">
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(blog)}
            className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(blog._id)}
            className="p-2 text-slate-600 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
