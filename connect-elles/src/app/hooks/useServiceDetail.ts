import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../utils/constants";
import axios from "axios";
import { Service } from "../utils/interface";

export const useServiceDetail = (serviceId: string) => {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const router = useRouter();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  const fetchServiceDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/services/${serviceId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setService(response.data);
    } catch (error) {
      console.error("Error fetching service details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const handleGoBack = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleReservation = () => {
    setIsReservationModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsReservationModalOpen(false);
  };

  const handleReservationSuccess = () => {
    fetchServiceDetails();
  };

  return {
    service,
    isLoading,
    isReservationModalOpen,

    token,
    userRole,
    userId,

    handleGoBack,
    handleLogin,
    handleReservation,
    handleCloseModal,
    handleReservationSuccess,
  };
};
