"use client";
import { useState, useEffect } from "react";
import { API_URL } from "@/app/utils/constants";
import { Reservation, Service } from "@/app/utils/interface";

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
      const response = await fetch(`${API_URL}/reservations/mentor/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
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
      const response = await fetch(`${API_URL}/reservations/${reservationId}/status/${userId}/${userRole}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CONFIRMED" }),
      });
      if (response.ok) {
        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation._id === reservationId ? { ...reservation, reservationStatus: "CONFIRMED" } : reservation
          )
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to confirm reservation: ${errorData.message}`);
      }
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
