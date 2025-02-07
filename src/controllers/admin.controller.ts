import { Request, Response } from "express";
import User from "../models/user.model";
import { File } from "../models/file.model";

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await User.findAll({
      attributes: ["id", "name", "email", "role", "created_at"],
    });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error });
  }
};

export const getClientDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const client = await User.findByPk(id, {
      attributes: ["id", "name", "email", "storageUsed", "storageLimit"],
      include: [
        {
          model: File,
          attributes: ["id", "name", "size", "uploadedAt"],
        },
      ],
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error fetching client details", error });
  }
};

export const getAllFiles = async (req: Request, res: Response) => {
  try {
    const files = await File.findAll({
      attributes: ["id", "name", "size", "uploadedAt", "userId"],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files", error });
  }
};

export const getDashboardStatistics = async (req: Request, res: Response) => {
  try {
    const totalFiles = await File.count();
    const totalStorageUsed = await File.sum("size");
    const totalClients = await User.count();

    res.status(200).json({
      totalFiles,
      totalStorageUsed,
      totalClients,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard statistics", error });
  }
};
