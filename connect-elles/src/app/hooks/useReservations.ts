"use client";
import { useState, useEffect } from "react";
import { Reservation } from "@/app/utils/interface";
import { API_URL, getAuthHeaders } from "../utils/constants";
import axios from "axios";
export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);

  const userRole = localStorage.getItem("userRole") || "normal_user";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const fetchUserReservations = async () => {
    if (!userId || !token) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/reservations/user/${userId}`, getAuthHeaders());
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReservations();
  }, [userId, token]);

  const cancelReservation = async (reservationId: string) => {
    if (!userId || !token) return;

    setCancelLoading(reservationId);

    try {
      const response = await axios.patch(`${API_URL}/reservations/${reservationId}/status/${userId}/${userRole}`, {
        status: "CANCELED",
      });

      if (response.status === 200) {
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation._id === reservationId ? { ...reservation, status: "CANCELLED" } : reservation
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(`Failed to cancel reservation: ${error.response.data.message}`);
      } else {
        console.error("Error cancelling reservation:", error);
      }
    } finally {
      setCancelLoading(null);
    }
  };

  return {
    reservations,
    isLoading,
    cancelLoading,
    cancelReservation,
  };
};
