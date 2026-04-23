import type { Request, Response } from "express";
import { z } from "zod";
import sanitize from "sanitize-filename";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
  type ListDocumentsQuery,
} from "../services/documents.service";
import type { ValidatedRequest } from "../middleware/validate";
import { ok } from "../utils/ApiResponse";
import { BadRequestError, NotFoundError } from "../utils/ApiError";
import { createDocumentSchema, documentListQuerySchema, idParamSchema, updateDocumentSchema } from "../validators/documents.schemas";
import { uploadBufferToMinio } from "../config/minio";

type ListDocumentsQueryInput = z.infer<typeof documentListQuerySchema>;
type IdParamInput = z.infer<typeof idParamSchema>;
type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

const uploadBodySchema = z.object({
  folder_id: z
    .string()
    .optional()
    .transform((value) => {
      if (!value || value === "null") return null;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? null : parsed;
    }),
});

import { listFileSystemItems, type ListItemsQuery } from "../services/file-system.service";

export const listDocumentsController = async (
  req: Request,
  res: Response,
) => {
  const query = (req as ValidatedRequest<ListDocumentsQueryInput>).validated;
  const folder_id = query.folder_id === undefined || query.folder_id === "null" ? undefined : Number(query.folder_id);
  const result = await listFileSystemItems({
    page: query.page,
    limit: query.limit,
    folder_id,
    search: query.search,
    sort_by: query.sort_by as ListItemsQuery["sort_by"],
    sort_dir: query.sort_dir as ListItemsQuery["sort_dir"],
  });

  res.status(200).json(ok(result.data, "OK", result.pagination));
};

export const getDocumentController = async (req: Request, res: Response) => {
  const { id } = (req as ValidatedRequest<IdParamInput>).validated;
  const document = await getDocumentById(id);
  if (!document) {
    throw new NotFoundError("Document not found");
  }
  res.status(200).json(ok(document));
};

export const createDocumentController = async (
  req: Request,
  res: Response,
) => {
  const { name, file_type, file_size, folder_id } = (req as ValidatedRequest<CreateDocumentInput>).validated;
  const created = await createDocument(name, file_type, file_size ?? 0, folder_id ?? null, null, 1);
  res.status(201).json(ok(created, "Document created"));
};

export const updateDocumentController = async (req: Request, res: Response) => {
  const { id } = (req as ValidatedRequest<IdParamInput>).validated;
  const { name } = (req as ValidatedRequest<UpdateDocumentInput>).validated;
  const document = await updateDocument(id, name);
  if (!document) {
    throw new NotFoundError("Document not found");
  }
  res.status(200).json(ok(document, "Document renamed"));
};

export const deleteDocumentController = async (req: Request, res: Response) => {
  const { id } = (req as ValidatedRequest<IdParamInput>).validated;
  const deleted = await deleteDocument(id);
  if (!deleted) {
    throw new NotFoundError("Document not found");
  }
  res.status(204).send();
};

export const uploadDocumentController = async (req: Request, res: Response) => {
  const file = (req as unknown as { file?: { originalname: string, buffer: Buffer, mimetype: string, size: number } }).file;
  if (!file) {
    throw new BadRequestError("No file uploaded");
  }

  const body = uploadBodySchema.parse(req.body);
  const lastDotIndex = file.originalname.lastIndexOf(".");
  const extension = lastDotIndex >= 0 ? file.originalname.slice(lastDotIndex + 1).toLowerCase() : "bin";
  const originalBaseName = lastDotIndex >= 0 ? file.originalname.slice(0, lastDotIndex) : file.originalname;
  const sanitizedBaseName = sanitize(originalBaseName).trim() || "file";
  const documentName = `${sanitizedBaseName}.${extension}`.slice(0, 255);
  const objectName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${documentName}`;

  await uploadBufferToMinio(objectName, file.buffer, file.mimetype || "application/octet-stream");
  const created = await createDocument(documentName, extension, file.size, body.folder_id, objectName, 1);

  res.status(201).json(ok(created, "Document uploaded"));
};
