import { API_URL, getAuthHeaders } from "@/app/utils/constants";
import { Category } from "@/app/utils/interface";
import { CategoryFormData } from "@/app/utils/types/category";
import axios from "axios";

export const loadCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(`${API_URL}/api/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export const addCategory = async (data: CategoryFormData): Promise<Category> => {
  try {
    const response = await axios.post<Category>(`${API_URL}/api/categories`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw new Error("Failed to add category");
  }
};
export const editCategory = async (categoryId: string, title: string): Promise<Category> => {
  try {
    const response = await axios.put<Category>(`${API_URL}/api/categories/${categoryId}`, { title }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/categories/${categoryId}`, getAuthHeaders());
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};
