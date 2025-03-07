import axios from "axios";
import { Skill } from "@/app/utils/types/skill";
import { API_URL, getAuthHeaders } from "@/app/utils/constants";

export const editSkill = async (skillId: string, title: string, description: string): Promise<Skill> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/skills/${skillId}`,
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
    await axios.delete(`${API_URL}/api/skills/${skillId}`, getAuthHeaders());
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw new Error("Failed to delete skill");
  }
};
