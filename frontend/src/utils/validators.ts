import { z } from "zod";

export const addFolderSchema = z.object({
  name: z.string().trim().min(1, "Folder name is required").max(255),
});
