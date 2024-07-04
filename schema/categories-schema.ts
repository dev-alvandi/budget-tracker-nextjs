import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: z.enum(["income", "expense"]),
});

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: z.enum(["income", "expense"]),
  id: z.string().min(1),
});

export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;

export const deleteCategorySchema = z.object({
  name: z.string().min(3).max(20),
  type: z.enum(["income", "expense"]),
  id: z.string().min(1),
});

export type DeleteCategorySchemaType = z.infer<typeof deleteCategorySchema>;
