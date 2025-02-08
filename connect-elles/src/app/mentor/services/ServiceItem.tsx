import React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Service } from "@/app/utils/types/service";

interface ServiceItemProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  onEdit,
  onDelete,
}) => {
  const imageLoader = ({ src }: { src: string }) => {
    return `http://localhost:5000${src}`;
  };

  return (
    <div className="p-6 rounded-2xl border border-teal-200 bg-teal-50 hover:shadow-lg transition-all duration-300">
      {service.serviceImage && (
        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
          <Image
            src={service.serviceImage}
            alt={service.title}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
            loader={imageLoader}
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            {service.title}
          </h3>
          <span className="text-sm text-slate-500">
            {service.category?.title}
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            service.status === "AVAILABLE"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {service.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-sm">
          <span className="text-slate-500">Duration:</span>
          <p className="font-medium">{service.duration} minutes</p>
        </div>
        <div className="text-sm">
          <span className="text-slate-500">Price:</span>
          <p className="font-medium">${service.price}</p>
        </div>
        <div className="text-sm">
          <span className="text-slate-500">Places:</span>
          <p className="font-medium">{service.numberOfPlaces}</p>
        </div>
      </div>

      <p className="text-slate-600 mb-4 line-clamp-3">{service.description}</p>

      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-500">
          {new Date(service.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(service)}
            className="p-2 text-slate-600 hover:text-teal-500 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(service._id)}
            className="p-2 text-slate-600 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;
