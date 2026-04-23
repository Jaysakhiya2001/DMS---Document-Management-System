import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { fail } from "../utils/ApiResponse";

export type ValidatedRequest<T> = Request & { validated: T };

export const validate =
  <T>(schema: ZodSchema<T>, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      const validationReq = req as unknown as { validated: Record<string, unknown> };
      validationReq.validated = {
        ...(validationReq.validated || {}),
        ...parsed,
      };
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422).json(
          fail(
            "Validation failed",
            error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          ),
        );
        return;
      }
      next(error);
    }
  };
