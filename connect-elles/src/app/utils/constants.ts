import axios from "axios";
import { Category } from "./interface";
export const getStatusColor = (status: string) => {
  if (!status) {
    return "bg-gray-100 text-gray-800";
  }
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
