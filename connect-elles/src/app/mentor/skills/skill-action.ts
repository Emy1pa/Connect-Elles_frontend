import axios from "axios";
import { Skill } from "@/app/utils/types/skill";

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

export const editSkill = async (
  skillId: string,
  title: string,
  description: string
): Promise<Skill> => {
  try {
    const response = await axios.put(
      `http://localhost:4000/api/skills/${skillId}`,
      {
        title,
        description,
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating skill:", error);
    throw new Error("Failed to update skill");
  }
};

export const deleteSkill = async (skillId: string): Promise<void> => {
  try {
    await axios.delete(
      `http://localhost:4000/api/skills/${skillId}`,
      getAuthHeaders()
    );
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw new Error("Failed to delete skill");
  }
};
