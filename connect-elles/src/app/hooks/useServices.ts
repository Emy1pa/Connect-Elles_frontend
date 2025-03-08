"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Service } from "@/app/utils/interface";
import { API_URL } from "@/app/utils/constants";

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/services`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setServices(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Failed to fetch services. Please try again later.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, isLoading, error, fetchServices };
};
