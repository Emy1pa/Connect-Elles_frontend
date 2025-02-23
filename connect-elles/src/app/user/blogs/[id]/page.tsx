"use client";
import React from "react";
import { useParams } from "next/navigation";
import BlogDetail from "@/components/BlogDetail";

const BlogDetailPage = () => {
  const params = useParams();
  const blogId = params.id as string;

  return <BlogDetail blogId={blogId} />;
};

export default BlogDetailPage;
