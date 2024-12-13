import { Request, Response } from "express";
import Client from "../models/client.model"; // Assume you have a Client model

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error fetching client", error });
  }
};

export const createClient = async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  try {
    const newClient = await Client.create({ name, email, phone });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.update({ name, email, phone });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error updating client", error });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting client", error });
  }
};
