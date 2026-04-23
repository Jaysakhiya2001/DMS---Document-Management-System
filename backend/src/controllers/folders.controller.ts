import type { Request, Response } from "express";
import { z } from "zod";
import type { ValidatedRequest } from "../middleware/validate";
import { getDocumentsForFolder } from "../services/documents.service";
import { createFolder, deleteFolder, getFolderById, getRootFolders, getSubFolders, updateFolder } from "../services/folders.service";
import { ok } from "../utils/ApiResponse";
import { NotFoundError } from "../utils/ApiError";
import { createFolderSchema, deleteFolderQuerySchema, idParamSchema, updateFolderSchema } from "../validators/folders.schemas";

type CreateFolderInput = z.infer<typeof createFolderSchema>;
type IdParamInput = z.infer<typeof idParamSchema>;
type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
type DeleteFolderQueryInput = z.infer<typeof deleteFolderQuerySchema>;

export const listRootFoldersController = async (_req: Request, res: Response) => {
  const data = await getRootFolders();
  res.status(200).json(ok(data));
};

export const getFolderContentsController = async (req: Request, res: Response) => {
  const id = (req as ValidatedRequest<IdParamInput>).validated.id;
  const [currentFolder, folders, documents] = await Promise.all([
    getFolderById(id),
    getSubFolders(id),
    getDocumentsForFolder(id),
  ]);

  if (!currentFolder) {
    throw new NotFoundError("Folder not found");
  }

  res.status(200).json(ok({ currentFolder, folders, documents }));
};

export const createFolderController = async (
  req: Request,
  res: Response,
) => {
  const { name, parent_id } = (req as ValidatedRequest<CreateFolderInput>).validated;
  const folder = await createFolder(name, parent_id ?? null, 1);
  res.status(201).json(ok(folder, "Folder created"));
};

export const updateFolderController = async (req: Request, res: Response) => {
  const { id } = (req as ValidatedRequest<IdParamInput>).validated;
  const { name } = (req as ValidatedRequest<UpdateFolderInput>).validated;
  const folder = await updateFolder(id, name);
  if (!folder) {
    throw new NotFoundError("Folder not found");
  }
  res.status(200).json(ok(folder, "Folder renamed"));
};

export const deleteFolderController = async (req: Request, res: Response) => {
  const { id } = (req as ValidatedRequest<IdParamInput>).validated;
  const { mode } = (req as ValidatedRequest<DeleteFolderQueryInput>).validated;
  const deleted = await deleteFolder(id, mode);
  if (!deleted) {
    throw new NotFoundError("Folder not found");
  }
  res.status(204).send();
};
