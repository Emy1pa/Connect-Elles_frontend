import axios from "axios";
import { Service } from "@/app/utils/types/service";
import { API_URL, getAuthHeaders } from "@/app/utils/constants";

export const editService = async (serviceId: string, formData: FormData): Promise<Service> => {
  try {
    const response = await axios.put(`${API_URL}/api/services/${serviceId}`, formData, {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw new Error("Failed to update service");
  }
};

export const deleteService = async (serviceId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/services/${serviceId}`, {
      headers: getAuthHeaders().headers,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    throw new Error("Failed to delete service");
  }
};

export const createService = async (formData: FormData): Promise<Service> => {
  try {
    const response = await axios.post(`${API_URL}/api/services`, formData, {
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw new Error("Failed to create service");
  }
};

export const fetchServices = async (userId: string): Promise<Service[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/services/mentor/${userId}`, {
      headers: getAuthHeaders().headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Failed to fetch services");
  }
};
