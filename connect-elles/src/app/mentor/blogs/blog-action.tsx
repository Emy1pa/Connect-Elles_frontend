import axios from "axios";
import { Blog } from "@/app/utils/types/blog";
import { API_URL, getAuthHeaders } from "@/app/utils/constants";
import { Category } from "@/app/utils/interface";

export const editBlog = async (blogId: string, formData: FormData): Promise<Blog> => {
  try {
    const response = await axios.put(`${API_URL}/api/blogs/${blogId}`, formData, {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw new Error("Failed to update blog");
  }
};

export const deleteBlog = async (blogId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/blogs/${blogId}`, {
      headers: getAuthHeaders().headers,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw new Error("Failed to delete blog");
  }
};

export const createBlog = async (formData: FormData): Promise<Blog> => {
  try {
    const response = await axios.post(`${API_URL}/api/blogs`, formData, {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw new Error("Failed to create blog");
  }
};

export const fetchBlogs = async (userId: string): Promise<Blog[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/blogs/mentor/${userId}`, {
      headers: getAuthHeaders().headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw new Error("Failed to fetch blogs");
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/categories`, {
      headers: getAuthHeaders().headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};
