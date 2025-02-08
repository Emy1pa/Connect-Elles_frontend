import * as z from "zod";

export const serviceSchema = z.object({
  title: z.string().min(3, "Service title must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Service description must be at least 10 characters"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "ARCHIVED", "EXPIRED"]),
  categoryId: z.string().min(1, "Category is required"),
  serviceImage: z.instanceof(File).nullable(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  price: z.number().min(0, "Price cannot be negative"),
  numberOfPlaces: z.number().min(1, "Number of places must be at least 1"),
});

export interface Service {
  _id: string;
  title: string;
  description: string;
  status: "AVAILABLE" | "UNAVAILABLE" | "ARCHIVED" | "EXPIRED";
  serviceImage?: string;
  duration: number;
  price: number;
  numberOfPlaces: number;
  category: {
    _id: string;
    title: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  title: string;
}

export type ServiceFormData = z.infer<typeof serviceSchema>;
