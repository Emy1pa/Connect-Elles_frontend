"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, Calendar, Search, Tag, User } from "lucide-react";
import { Blog } from "@/app/utils/interface";
import { useRouter } from "next/navigation";
import { fetchCategories } from "@/app/utils/constants";
import { fetchPublishedBlogs } from "./blogService";

const BlogList = () => {
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const loadData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const [blogsData, categoriesData] = await Promise.all([fetchPublishedBlogs(), fetchCategories()]);
      setBlogs(blogsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const searchMatch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory === "" || blog.category?._id === selectedCategory;
    return searchMatch && categoryMatch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium mb-4">
            Our Blog
          </span>
          <h1 className="text-4xl font-bold text-slate-800">Latest Stories & Insights</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Discover inspiring stories, helpful tips, and community highlights
          </p>
          <div className="max-w-3xl mx-auto mt-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-100 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition-colors duration-200"
              />
            </div>

            <div className="relative w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="custom-scroll w-full px-4 py-3 rounded-xl border border-pink-100 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition-colors duration-200 appearance-none bg-white overflow-y-auto"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Tag className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">
              {searchTerm || selectedCategory
                ? "No Blogs found matching your filters"
                : "No published blogs available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl shadow-pink-100/50 hover:shadow-pink-200/50 transition-all duration-300 border border-pink-100 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.blogImage ? `http://localhost:4000${blog.blogImage}` : "/api/placeholder/400/320"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {blog.category && (
                    <span className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-pink-600 text-sm font-medium shadow-lg">
                      <Tag className="w-4 h-4 inline-block mr-1" />
                      {blog.category.title}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow ">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center text-slate-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-pink-600">{blog.user?.fullName || "Anonymous"}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-pink-600 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">{blog.summary}</p>

                  <button
                    onClick={() => router.push(`/user/blogs/${blog._id}`)}
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 mt-auto self-start"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
