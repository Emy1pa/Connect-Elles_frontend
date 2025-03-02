import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Clock,
  Users,
  User,
  LogIn,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Service } from "@/app/utils/interface";
import ReservationModal from "./ReservationModal";

interface ServiceDetailProps {
  serviceId: string;
}

const ServiceDetail = ({ serviceId }: ServiceDetailProps) => {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const router = useRouter();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  const fetchServiceDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/services/${serviceId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setService(data);
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

  const handleReservation = () => {
    setIsReservationModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsReservationModalOpen(false);
  };
  const handleReservationSuccess = () => {
    fetchServiceDetails();
  };
  const handleLogin = () => {
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-rose-50 to-green-50">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-rose-50 to-green-50">
        <h2 className="text-2xl font-bold text-rose-500 mb-4">
          Service not found
        </h2>
        <button
          onClick={handleGoBack}
          className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-green-500 text-white font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-1 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </button>
      </div>
    );
  }
  const renderReservationButton = () => {
    if (service.numberOfPlaces === 0) {
      return (
        <div className="space-y-4">
          <p className="text-center text-red-600 font-medium">
            Service is unavailable - No places left
          </p>
          <button
            disabled
            className="w-full flex items-center justify-center px-6 py-3 rounded-xl bg-gray-400 text-white font-medium cursor-not-allowed opacity-75"
          >
            Service Unavailable
          </button>
        </div>
      );
    }
    if (!token) {
      return (
        <div className="space-y-4">
          <p className="text-center text-rose-600 font-medium">
            Please login to make a reservation
          </p>
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-green-600 text-white font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-1 transition-all duration-300"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login to Reserve
          </button>
        </div>
      );
    }

    if (userRole !== "normal-user") {
      return (
        <div className="space-y-4">
          <p className="text-center text-amber-600 font-medium">
            Only regular users can make reservations
          </p>
          <button
            disabled
            className="w-full flex items-center justify-center px-6 py-3 rounded-xl bg-gray-400 text-white font-medium cursor-not-allowed opacity-75"
          >
            Reservation Not Available
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleReservation}
        className="w-full flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-green-600 text-white font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-1 transition-all duration-300"
      >
        Réserver
      </button>
    );
  };
  return (
    <div className="pt-[navbar-height]">
      <div className="relative min-h-[calc(100vh-navbar-height)]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/girl.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div className="relative z-10 min-h-screen py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleGoBack}
              className="mb-6 flex items-center px-5 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-slate-800 font-medium shadow-lg hover:bg-white transform hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </button>

            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {service.title}
              </h1>
              <div className="flex flex-wrap gap-4">
                {service.category && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-700 text-sm font-medium">
                    <Tag className="w-4 h-4 mr-2" />
                    {service.category.title}
                  </span>
                )}
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-700 text-sm font-medium">
                  {service.status}
                </span>
                {service.user && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-700 text-sm font-medium">
                    <User className="w-4 h-4 mr-2" />
                    {service.user.fullName}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative w-full h-80">
                <img
                  src={
                    service.serviceImage
                      ? `http://localhost:4000${service.serviceImage}`
                      : "/api/placeholder/1200/600"
                  }
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-5 h-5 mr-2 text-rose-500" />
                      <span className="font-medium">
                        {service.duration} Days
                      </span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Users className="w-5 h-5 mr-2 text-rose-500" />
                      <span className="font-medium">
                        {service.numberOfPlaces} Places
                      </span>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-rose-600">
                    ${service.price}
                  </div>
                </div>

                <div className="flex items-center text-slate-500 text-sm mb-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(service.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                <div className="prose prose-rose prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 mb-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">
                    Description
                  </h2>
                  <div
                    className="text-slate-600 text-base"
                    dangerouslySetInnerHTML={{
                      __html: service.description || "",
                    }}
                  />
                </div>
                {renderReservationButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={handleCloseModal}
        userId={userId}
        serviceId={serviceId}
        onReservationSuccess={handleReservationSuccess}
      />
    </div>
  );
};

export default ServiceDetail;
