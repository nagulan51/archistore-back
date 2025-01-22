import { Router } from "express";
import multer from "multer";
import {
  uploadFile,
  getFiles,
  getFileById,
  deleteFile,
  filterFiles,
  readFileByName,
} from "../controllers/file.controller";
import { authenticate } from "../middlewares/auth.middleware";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

// Allowed file extensions
const allowedFileTypes = [
  "jpeg",
  "jpg",
  "png",
  "gif",
  "pdf",
  "mp4",
  "mov",
  "docx",
];

//2GB max file size
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024;

// Extend Express Request type
declare module "express-serve-static-core" {
  interface Request {
    fileInfo?: {
      originalName: string;
      randomName: string;
      fileType: string;
      filePath: string;
    };
  }
}

const FileRouter = Router();

// gestion des erreus personnalisées
const handleErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: `File size too large. Maximum size is ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB`,
      });
    }
    return res.status(400).json({ message: err.message });
  }
  return res
    .status(500)
    .json({ message: err.message || "An error occurred during file upload" });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    try {
      const randomName = crypto.randomBytes(16).toString("hex");
      const extension = file.originalname.split(".").pop()?.toLowerCase();
      const generatedFileName = `${randomName}.${extension}`;
      const mimeType = file.mimetype.split("/")[1];

      req.fileInfo = {
        originalName: file.originalname,
        randomName: generatedFileName,
        fileType: mimeType,
        filePath: `uploads/${generatedFileName}`,
      };

      cb(null, generatedFileName);
    } catch (error) {
      cb(error as Error, "");
    }
  },
});

// Multer file filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const fileExtension = file.originalname.split(".").pop()?.toLowerCase();

  console.log(
    "Uploading file:",
    file.originalname,
    "with extension:",
    fileExtension
  );

  if (!fileExtension) {
    return cb(new Error("Could not determine file extension"));
  }

  if (allowedFileTypes.includes(fileExtension)) {
    return cb(null, true);
  }

  return cb(
    new Error(
      `Invalid file type. Allowed types are: ${allowedFileTypes.join(", ")}`
    )
  );
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Middleware
FileRouter.use(authenticate);

// Routes with error handling
FileRouter.post(
  "/upload",
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        return handleErrors(err, req, res, next);
      }
      try {
        uploadFile(req, res);
      } catch (error) {
        next(error);
      }
    });
  }
);

// Get all files
FileRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getFiles(req, res);
  } catch (error) {
    next(error);
  }
});

// Get file by ID
FileRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFileById(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Delete file
FileRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteFile(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Filter files
FileRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await filterFiles(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Get file by name
FileRouter.get(
  "/getfile/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await readFileByName(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default FileRouter;
