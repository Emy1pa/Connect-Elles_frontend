import axios from "axios";
import { Blog } from "@/app/utils/types/blog";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Token is missing");
    return {};
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const editBlog = async (
  blogId: string,
  formData: FormData
): Promise<Blog> => {
  try {
    const response = await axios.put(
      `http://localhost:4000/api/blogs/${blogId}`,
      formData,
      {
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw new Error("Failed to update blog");
  }
};

export const deleteBlog = async (blogId: string): Promise<void> => {
  try {
    await axios.delete(`http://localhost:4000/api/blogs/${blogId}`, {
      headers: getAuthHeaders().headers,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw new Error("Failed to delete blog");
  }
};

export const createBlog = async (formData: FormData): Promise<Blog> => {
  try {
    const response = await axios.post(
      "http://localhost:4000/api/blogs",
      formData,
      {
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw new Error("Failed to create blog");
  }
};
