import { Router } from "express";
import { documentsRouter } from "./documents.routes";
import { foldersRouter } from "./folders.routes";

export const apiRouter = Router();

apiRouter.use("/documents", documentsRouter);
apiRouter.use("/folders", foldersRouter);
