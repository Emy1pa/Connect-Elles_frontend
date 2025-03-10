"use client";
import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Service, ServiceFormData, serviceSchema } from "@/app/utils/types/service";
import { createService, editService, deleteService, fetchServices } from "./service-action";
import ServiceItem from "./ServiceItem";
import { fetchCategories } from "@/app/utils/constants";
import ServiceForm from "./ServiceForm";
import { Category } from "@/app/utils/interface";
import { useRouter } from "next/navigation";

const ServicesList = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "mentor") {
      router.replace("/");
    }
  }, []);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");
      const [servicesData, categoriesData] = await Promise.all([fetchServices(userId), fetchCategories()]);
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      if (data.serviceImage) {
        formData.append("serviceImage", data.serviceImage);
      }

      if (editingService) {
        const updatedService = await editService(editingService._id, formData);
        setServices((prev) => prev.map((service) => (service._id === editingService._id ? updatedService : service)));
      } else {
        const newService = await createService(formData);
        setServices((prev) => [...prev, newService]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(serviceId);
        setServices((prev) => prev.filter((service) => service._id !== serviceId));
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service");
      }
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  const buttonClass =
    "w-full px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-1 transition-all duration-300";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-medium">
            Services
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">Manage Your Services</h2>
        </div>

        <button onClick={() => setIsModalOpen(true)} className={buttonClass}>
          <Plus className="w-5 h-5 inline-block mr-2" />
          Create Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-rose-50 rounded-2xl border border-rose-200">
          <div className="text-xl font-medium text-slate-800 mb-2">No Services Found</div>
          <p className="text-slate-600 text-center mb-4">
            Start by creating your first service using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceItem key={service._id} service={service} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <ServiceForm
            categories={categories}
            onSubmit={onSubmit}
            editingService={editingService}
            isSubmitting={isSubmitting}
            onCancel={resetForm}
          />
        </div>
      )}
    </div>
  );
};

export default ServicesList;
