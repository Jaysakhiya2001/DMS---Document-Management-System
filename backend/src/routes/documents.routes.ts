import { Router } from "express";
import {
  createDocumentController,
  deleteDocumentController,
  getDocumentController,
  listDocumentsController,
  updateDocumentController,
  uploadDocumentController,
} from "../controllers/documents.controller";
import { uploadSingleDocument } from "../middleware/upload";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createDocumentSchema,
  documentListQuerySchema,
  idParamSchema,
  updateDocumentSchema,
} from "../validators/documents.schemas";

export const documentsRouter = Router();

documentsRouter.get("/", validate(documentListQuerySchema, "query"), asyncHandler(listDocumentsController));
documentsRouter.post("/upload", uploadSingleDocument, asyncHandler(uploadDocumentController));
documentsRouter.get("/:id", validate(idParamSchema, "params"), asyncHandler(getDocumentController));
documentsRouter.post("/", validate(createDocumentSchema), asyncHandler(createDocumentController));
documentsRouter.put("/:id", validate(idParamSchema, "params"), validate(updateDocumentSchema), asyncHandler(updateDocumentController));
documentsRouter.delete("/:id", validate(idParamSchema, "params"), asyncHandler(deleteDocumentController));
