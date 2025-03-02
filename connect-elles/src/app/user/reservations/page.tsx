"use client";
import React, { useState, useEffect } from "react";
import { Calendar, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Service {
  _id: string;
  name: string;
  price: number;
  serviceImage: string;
  duration: number;
}

interface Reservation {
  _id: string;
  reservationDate: string;
  status: string;
  service: Service | null;
}

const UserReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserReservations = async () => {
      if (!userId || !token) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:4000/reservations/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

    fetchUserReservations();
  }, [userId, token]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center p-12 bg-pink-50 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-pink-600 mb-4">
              No Reservations Yet
            </h2>
            <p className="text-slate-600 mb-8">
              You haven't made any service reservations.
            </p>
            <Link href="/user/services">
              <div className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300">
                Browse Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-10 relative inline-block after:content-[''] after:absolute after:w-full after:h-2 after:bg-pink-300 after:bottom-0 after:left-0 pb-3">
          My Reservations
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reservations.map(
            (reservation) =>
              reservation.service && (
                <div
                  key={reservation._id}
                  className="bg-pink-50 rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="relative h-48">
                    <Image
                      src={
                        reservation.service.serviceImage
                          ? `http://localhost:4000${reservation.service.serviceImage}`
                          : "/api/placeholder/800/400"
                      }
                      alt={reservation.service.name}
                      className="w-full h-full object-cover"
                      width={800}
                      height={400}
                    />

                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 border-t-4 border-pink-400">
                    <h2 className="text-xl font-bold text-slate-800 mb-3">
                      {reservation.service.name}
                    </h2>

                    <div className="mb-4">
                      <div className="flex items-center text-slate-600 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(reservation.reservationDate)}</span>
                      </div>
                      <div className="text-slate-600">
                        <span className="font-medium">Duration:</span>{" "}
                        {reservation.service.duration} min
                      </div>
                      <div className="text-pink-600 font-bold mt-2">
                        {reservation.service.price} $
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Link href={`services/${reservation.service._id}`}>
                        <div className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-md shadow-pink-500/20 hover:shadow-pink-500/30 transform hover:-translate-y-1 transition-all duration-300">
                          View Service
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReservations;
