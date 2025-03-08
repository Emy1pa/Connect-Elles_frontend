"use client";
import { useState, useEffect } from "react";
import { Blog } from "@/app/utils/interface";
import { API_URL } from "../utils/constants";
import axios from "axios";

export const useBlogDetail = (blogId: string) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/${blogId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Fetched blog data:", response.data);
      setBlog(response.data);
    } catch (error) {
      console.error("Error fetching blog details:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (blogId) {
      fetchBlogDetails();
    }
  }, [blogId]);

  return { blog, isLoading };
};
