"use client";
import React, { useState, useEffect } from "react";
import { Plus, Loader2, X, Upload } from "lucide-react";
import Image from "next/image";
import {
  Service,
  ServiceFormData,
  serviceSchema,
} from "@/app/utils/types/service";
import { Category } from "@/app/utils/types/service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createService,
  editService,
  deleteService,
  getAuthHeaders,
} from "./service-action";
import ServiceItem from "./ServiceItem";

const ServicesList = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/services", {
        headers: getAuthHeaders().headers,
      });
      const data = await response.json();
      setServices(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/categories", {
        headers: getAuthHeaders().headers,
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("serviceImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setPreviewImage(result);
        }
      };
      reader.readAsDataURL(file);
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
        setServices((prev) =>
          prev.map((service) =>
            service._id === editingService._id ? updatedService : service
          )
        );
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
    reset({
      title: service.title,
      description: service.description,
      status: service.status,
      categoryId: service.category?._id || "",
      serviceImage: null,
      duration: service.duration,
      price: service.price,
      numberOfPlaces: service.numberOfPlaces,
    });

    setPreviewImage(
      service.serviceImage
        ? `http://localhost:4000${service.serviceImage}`
        : null
    );
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(serviceId);
        setServices((prev) =>
          prev.filter((service) => service._id !== serviceId)
        );
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service");
      }
    }
  };

  const resetForm = () => {
    reset();
    setEditingService(null);
    setPreviewImage(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-rose-400 focus:ring-2 focus:outline-none transition-all duration-300 bg-white/90";

  const buttonClass =
    "w-full px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-1 transition-all duration-300";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-medium">
            Services
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Manage Your Services
          </h2>
        </div>

        <button onClick={() => setIsModalOpen(true)} className={buttonClass}>
          <Plus className="w-5 h-5 inline-block mr-2" />
          Create Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-rose-50 rounded-2xl border border-rose-200">
          <div className="text-xl font-medium text-slate-800 mb-2">
            No Services Found
          </div>
          <p className="text-slate-600 text-center mb-4">
            Start by creating your first service using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceItem
              key={service._id}
              service={service}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={resetForm}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              {editingService ? "Edit Service" : "Create New Service"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">
                  Title
                </label>
                <input {...register("title")} className={inputClass} />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">
                  Category
                </label>
                <select {...register("categoryId")} className={inputClass}>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">
                  Service Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="service-image"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="service-image"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-rose-200 rounded-xl cursor-pointer hover:border-rose-400 transition-all duration-300"
                  >
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={previewImage}
                          alt="Service Preview"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-xl"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-rose-400" />
                        <span className="mt-2 block text-sm text-rose-600">
                          Upload service image
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-1">
                    Duration (Jours)
                  </label>
                  <input
                    type="number"
                    {...register("duration", { valueAsNumber: true })}
                    min="1"
                    className={inputClass}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    min="0"
                    step="0.01"
                    className={inputClass}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-rose-700 mb-1">
                    Number of Places
                  </label>
                  <input
                    type="number"
                    {...register("numberOfPlaces", { valueAsNumber: true })}
                    min="1"
                    className={inputClass}
                  />
                  {errors.numberOfPlaces && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.numberOfPlaces.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className={inputClass}
                  rows={6}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">
                  Status
                </label>
                <select {...register("status")} className={inputClass}>
                  <option value="AVAILABLE">Available</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${buttonClass} ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                    {editingService ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 inline-block mr-2" />
                    {editingService ? "Update Service" : "Create Service"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
