import multer, { FileFilterCallback } from "multer";
import { fileURLToPath } from "url";
import path, { dirname, resolve } from "path";
import fs, { existsSync, mkdirSync } from "fs";
import { Request } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = path.resolve(__dirname, "../../uploads");

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
  console.log(`Created uploads directory at: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "-");
    cb(null, `product-${uniqueSuffix}-${cleanName}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, png, webp) are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});

export const verifyUploadDir = (): boolean => {
  try {
    fs.accessSync(uploadDir, fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (err) {
    console.error("Upload directory access error:", err);
    return false;
  }
};

export default upload;
