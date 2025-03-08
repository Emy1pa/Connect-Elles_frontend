import axios from "axios";
import { Blog } from "@/app/utils/interface";
import { API_URL } from "@/app/utils/constants";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchPublishedBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await api.get<Blog[]>(`${API_URL}/api/blogs/published`);
    return response.data;
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    throw error;
  }
};
