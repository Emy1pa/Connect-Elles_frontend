import * as z from "zod";
export const categorySchema = z.object({
  title: z.string().min(3, "Category Title must be at least 3 characters"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export interface Category {
  _id: string;
  title: string;
}
