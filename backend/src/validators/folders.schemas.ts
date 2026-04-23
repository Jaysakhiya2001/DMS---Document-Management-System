import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createFolderSchema = z.object({
  name: z.string().trim().min(1).max(255),
  parent_id: z.number().int().positive().nullable().optional(),
});

export const updateFolderSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export const deleteFolderQuerySchema = z.object({
  mode: z.enum(["cascade", "move"]).default("move"),
});
