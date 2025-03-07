"use client";
import { useState, useEffect } from "react";
import { API_URL } from "@/app/utils/constants";
import { Reservation } from "@/app/utils/interface";
import axios from "axios";
export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState<string | null>(null);

  const userRole = localStorage.getItem("userRole") || "mentor";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchUserReservations = async () => {
    if (!userId || !token) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/reservations/mentor/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

  const confirmReservation = async (reservationId: string) => {
    if (!userId || !token) return;

    setConfirmLoading(reservationId);
    try {
      await axios.patch(
        `${API_URL}/reservations/${reservationId}/status/${userId}/${userRole}`,
        { status: "CONFIRMED" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation._id === reservationId ? { ...reservation, reservationStatus: "CONFIRMED" } : reservation
        )
      );
    } catch (error) {
      console.error("Error confirming reservation:", error);
    } finally {
      setConfirmLoading(null);
    }
  };

  return {
    reservations,
    isLoading,
    confirmLoading,
    confirmReservation,
  };
};
