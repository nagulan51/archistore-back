import { Router } from "express";
import multer from "multer";
import {
  uploadFile,
  getFiles,
  getFileById,
  deleteFile,
  filterFiles,
} from "../controllers/file.controller";
import { authenticate } from "../middlewares/auth.middleware";

const FileRouter = Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Protect all routes
FileRouter.use(authenticate);

FileRouter.post("/upload", upload.single("file"), uploadFile);
FileRouter.get("/", getFiles); //
FileRouter.get("/:id", getFileById);
FileRouter.delete("/:id", deleteFile);
FileRouter.get("/filter", filterFiles);

export default FileRouter;
