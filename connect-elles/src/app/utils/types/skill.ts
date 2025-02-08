import { title } from "process";
import * as z from "zod";
export const skillSchema = z.object({
  title: z
    .string()
    .min(3, "Skill title is required must be at least 3 characters"),
  description: z
    .string()
    .min(
      10,
      "Skill description is required and must be at least 10 characters"
    ),
});
export type SkillFormData = z.infer<typeof skillSchema>;

export interface Skill {
  _id: string;
  title: string;
  description: string;
}
