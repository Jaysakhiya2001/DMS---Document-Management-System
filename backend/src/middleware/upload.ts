import multer from "multer";

const maxFileSizeBytes = Number(process.env.MAX_UPLOAD_SIZE_BYTES ?? 20 * 1024 * 1024);

export const uploadSingleDocument = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSizeBytes,
  },
}).single("file");
