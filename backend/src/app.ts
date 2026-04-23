import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(morgan("dev")); // HTTP request logging
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "OK", data: null });
});

app.use("/api/v1", apiRouter);
app.use(errorHandler);
