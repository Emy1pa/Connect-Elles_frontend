"use client";
import React, { useState } from "react";
import { ArrowLeft, Calendar, Tag, User, Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { useBlogDetail } from "@/app/hooks/useBlogDetail";
import { useBlogFavorites } from "@/app/hooks/useBlogFavorites";
import { useBlogComments } from "@/app/hooks/useBlogComments";
import { API_URL, formatDate } from "@/app/utils/constants";
import { useBlogFavoriteCount } from "@/app/hooks/useBlogFavoriteCount";

interface BlogDetailProps {
  blogId: string;
}

const BlogDetail = ({ blogId }: BlogDetailProps) => {
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const { favoriteCount, refetch } = useBlogFavoriteCount(blogId);
  const { blog, isLoading } = useBlogDetail(blogId);
  const { isFavorite, handleFavoriteToggle } = useBlogFavorites(blogId, refetch);
  const { comments, handleCommentAdded, handleCommentDeleted, handleCommentUpdated } = useBlogComments(
    blogId,
    showComments
  );

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-rose-50 to-pink-50">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-rose-50 to-pink-50">
        <h2 className="text-2xl font-bold text-rose-500 mb-4">Blog not found</h2>
        <button
          onClick={handleGoBack}
          className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="pt-[navbar-height]">
      <div className="relative min-h-[calc(100vh-navbar-height)]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/painting.jpg')",
            backgroundAttachment: "fixed",
          }}
        />

        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

        <div className="relative z-10 min-h-screen py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-96 w-full">
                <Image
                  src={blog.blogImage ? `${API_URL}${blog.blogImage}` : "/api/placeholder/1200/800"}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  width={1200}
                  height={800}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                  {blog.category && blog.category.title ? (
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-pink-600 text-sm font-medium shadow-lg mb-4 w-fit">
                      <Tag className="w-4 h-4 inline-block mr-1" />
                      {blog.category.title}
                    </span>
                  ) : (
                    <p className="text-gray-500">No category</p>
                  )}
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{blog.title}</h1>

                  <div className="flex flex-wrap items-center text-white/90 gap-4">
                    <div className="flex items-center backdrop-blur-sm bg-black/10 px-3 py-1 rounded-full">
                      <Calendar className="w-5 h-5 mr-2" />
                      {formatDate(blog.createdAt)}
                    </div>
                    <div className="flex items-center backdrop-blur-sm bg-black/10 px-3 py-1 rounded-full">
                      <User className="w-5 h-5 mr-2" />
                      {blog.user?.fullName}
                    </div>
                    <div className="flex items-center backdrop-blur-sm bg-black/10 px-3 py-1 rounded-full">
                      <Heart className="w-5 h-5 mr-2 text-pink-500" />
                      {favoriteCount} {favoriteCount === 1 ? "favorite" : "favorites"}
                    </div>
                    {localStorage.getItem("userId") && localStorage.getItem("userRole") === "normal-user" && (
                      <button
                        onClick={handleFavoriteToggle}
                        className="flex items-center backdrop-blur-sm bg-black/10 px-3 py-1 rounded-full hover:bg-black/20 transition-colors"
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart
                          className={`w-5 h-5 mr-2 ${isFavorite ? "fill-pink-500 text-pink-500" : "text-white"}`}
                        />
                        {isFavorite ? "Favorited" : "Add to favorites"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <button
                  onClick={handleGoBack}
                  className="flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 mb-12"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blogs
                </button>

                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 relative inline-block after:content-[''] after:absolute after:w-full after:h-1 after:bg-pink-300 after:bottom-0 after:left-0 pb-2">
                    Summary
                  </h2>
                  <p className="text-lg text-slate-600 italic border-l-4 border-pink-400 pl-6 py-3 bg-gradient-to-r from-pink-50 to-transparent rounded-r-lg shadow-sm">
                    {blog.summary}
                  </p>
                </div>

                <div className="prose prose-pink prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-a:text-pink-600 prose-a:no-underline prose-a:font-medium hover:prose-a:text-pink-700">
                  <div dangerouslySetInnerHTML={{ __html: blog.content || "" }} />
                </div>
                <div className="border-t border-gray-200 pt-10">
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 mb-8"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {showComments ? "Hide Comments" : "Show Comments"}
                  </button>

                  {showComments && (
                    <div className="space-y-10">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 relative inline-block after:content-[''] after:absolute after:w-full after:h-1 after:bg-pink-300 after:bottom-0 after:left-0 pb-2">
                          Add a Comment
                        </h3>
                        <CommentForm
                          blogId={blogId}
                          user={localStorage.getItem("userId") || ""}
                          onCommentAdded={handleCommentAdded}
                        />
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 relative inline-block after:content-[''] after:absolute after:w-full after:h-1 after:bg-pink-300 after:bottom-0 after:left-0 pb-2">
                          Comments ({comments.length})
                        </h3>
                        <CommentList
                          comments={comments}
                          onCommentDeleted={handleCommentDeleted}
                          onCommentUpdated={handleCommentUpdated}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
