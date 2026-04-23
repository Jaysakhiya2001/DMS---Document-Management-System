import { Router } from "express";
import {
  createFolderController,
  deleteFolderController,
  getFolderContentsController,
  listRootFoldersController,
  updateFolderController,
} from "../controllers/folders.controller";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createFolderSchema,
  deleteFolderQuerySchema,
  idParamSchema,
  updateFolderSchema,
} from "../validators/folders.schemas";

export const foldersRouter = Router();

foldersRouter.get("/", asyncHandler(listRootFoldersController));
foldersRouter.get("/:id/contents", validate(idParamSchema, "params"), asyncHandler(getFolderContentsController));
foldersRouter.post("/", validate(createFolderSchema), asyncHandler(createFolderController));
foldersRouter.put("/:id", validate(idParamSchema, "params"), validate(updateFolderSchema), asyncHandler(updateFolderController));
foldersRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  validate(deleteFolderQuerySchema, "query"),
  asyncHandler(deleteFolderController),
);
