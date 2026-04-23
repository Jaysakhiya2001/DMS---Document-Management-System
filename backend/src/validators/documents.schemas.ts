import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const documentListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  folder_id: z
    .union([z.coerce.number().int().positive(), z.literal("null"), z.undefined()])
    .optional(),
  search: z.string().trim().optional(),
  sort_by: z.enum(["name", "created_at", "file_size"]).default("created_at"),
  sort_dir: z.enum(["asc", "desc"]).default("desc"),
});

export const createDocumentSchema = z.object({
  name: z.string().trim().min(1).max(255),
  file_type: z.enum(["pdf", "docx", "xlsx", "pptx", "txt", "png", "jpg", "jpeg", "svg", "gif", "zip", "rar", "7z"]),
  file_size: z.coerce.number().int().min(0).default(0),
  folder_id: z.number().int().positive().nullable().optional(),
});

export const updateDocumentSchema = z.object({
  name: z.string().trim().min(1).max(255),
});
