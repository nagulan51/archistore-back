import { Request, Response } from "express";
import { File } from "../models/file.model";
import path from "path";
import fs from "fs";

// televerser un fichier
export const uploadFile = async (req: Request, res: Response) => {
  try {
    // const { originalname, size, path } = req.file!;
    const { size, path } = req.file!;
    const { originalName, randomName, fileType } = req.fileInfo!;
    const userId = req.user?.id;
    const file = await File.create({
      name: randomName,
      originalName: originalName,
      size,
      type: fileType,
      path,
      userId,
    });

    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error });
  }
};

// recupérer tous les fichiers un utilisateur
export const getFiles = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const files = await File.findAll({ where: { userId } });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files", error });
  }
};

// recupérer un fichier par son id
export const getFileById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.user?.id;

    const file = await File.findOne({ where: { id, userId } });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: "Error fetching file", error });
  }
};

// suppresion de fichier par ID
export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.user?.id;

    const file = await File.findOne({ where: { id, userId } });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await file.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error });
  }
};

export const filterFiles = async (req: Request, res: Response) => {
  const { name, size, date } = req.query;
  try {
    const userId = req.user?.id;

    const where: any = { userId };
    if (name) where.name = name;
    if (size) where.size = size;
    if (date) where.createdAt = date;

    const files = await File.findAll({ where });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Error filtering files", error });
  }
};

export const readFileByName = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const userId = req.user?.id;

    // Find the file by its name
    const file = await File.findOne({ where: { name, userId } });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Get the file path from the file record
    const filePath = path.resolve(file.path);

    // Check if the file exists and send it as a response
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File does not exist on the server" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error reading file", error });
  }
};
