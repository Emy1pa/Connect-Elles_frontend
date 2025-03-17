import * as z from "zod";

export const blogSchema = z.object({
  title: z.string().min(3, "Blog title must be at least 3 characters"),
  content: z.string().min(10, "Blog content must be at least 10 characters"),
  summary: z.string().min(10, "Blog summary must be at least 10 characters"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  categoryId: z.string().min(1, "Category is required"),
  blogImage: z.instanceof(File).nullable(),
});

export interface Blog {
  _id: string;
  title: string;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  blogImage?: string;
  summary: string;
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

export type BlogFormData = z.infer<typeof blogSchema>;
