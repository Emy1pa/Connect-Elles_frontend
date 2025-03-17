import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { Service, ServiceFormData, serviceSchema } from "@/app/utils/types/service";
import { Category } from "@/app/utils/types/service";
import { API_URL } from "@/app/utils/constants";

interface ServiceFormProps {
  categories: Category[];
  onSubmit: (data: ServiceFormData) => Promise<void>;
  editingService: Service | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ categories, onSubmit, editingService, isSubmitting, onCancel }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(
    editingService?.serviceImage ? `${API_URL}${editingService.serviceImage}` : null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: editingService
      ? {
          title: editingService.title,
          description: editingService.description,
          status: editingService.status,
          categoryId: editingService.category?._id || "",
          serviceImage: null,
          duration: editingService.duration,
          price: editingService.price,
          numberOfPlaces: editingService.numberOfPlaces,
        }
      : undefined,
  });

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

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-rose-400 focus:ring-2 focus:outline-none transition-all duration-300 bg-white/90";

  const buttonClass =
    "w-full px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-1 transition-all duration-300";

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
      <button onClick={onCancel} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-2xl font-bold text-slate-800 mb-6">
        {editingService ? "Edit Service" : "Create New Service"}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Title</label>
          <input {...register("title")} className={inputClass} />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Category</label>
          <select {...register("categoryId")} className={inputClass}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Service Image</label>
          <div className="relative">
            <input type="file" accept="image/*" className="hidden" id="service-image" onChange={handleImageChange} />
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
                  <span className="mt-2 block text-sm text-rose-600">Upload service image</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">Duration (Jours)</label>
            <input type="number" {...register("duration", { valueAsNumber: true })} min="1" className={inputClass} />
            {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">Price ($)</label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              min="1"
              step="0.01"
              className={inputClass}
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-rose-700 mb-1">Number of Places</label>
            <input
              type="number"
              {...register("numberOfPlaces", { valueAsNumber: true })}
              min="1"
              className={inputClass}
            />
            {errors.numberOfPlaces && <p className="mt-1 text-sm text-red-500">{errors.numberOfPlaces.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Description</label>
          <textarea {...register("description")} className={inputClass} rows={6} />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">Status</label>
          <select {...register("status")} className={inputClass}>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${buttonClass} ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
  );
};

export default ServiceForm;
