import axios from "axios";
import { Service } from "@/app/utils/types/service";

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

export const editService = async (
  serviceId: string,
  formData: FormData
): Promise<Service> => {
  try {
    const response = await axios.put(
      `http://localhost:4000/api/services/${serviceId}`,
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
    console.error("Error updating service:", error);
    throw new Error("Failed to update service");
  }
};

export const deleteService = async (serviceId: string): Promise<void> => {
  try {
    await axios.delete(`http://localhost:4000/api/services/${serviceId}`, {
      headers: getAuthHeaders().headers,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    throw new Error("Failed to delete service");
  }
};

export const createService = async (formData: FormData): Promise<Service> => {
  try {
    const response = await axios.post(
      "http://localhost:4000/api/services",
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
    console.error("Error creating service:", error);
    throw new Error("Failed to create service");
  }
};
