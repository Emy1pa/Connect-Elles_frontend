import axios from "axios";
import { Category } from "../../utils/types/category";

const getAuthHeaders = () => {
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

export const editCategory = async (
  categoryId: string,
  title: string
): Promise<Category> => {
  try {
    const response = await axios.put<Category>(
      `http://localhost:5000/api/categories/${categoryId}`,
      { title },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    await axios.delete(
      `http://localhost:5000/api/categories/${categoryId}`,
      getAuthHeaders()
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};
