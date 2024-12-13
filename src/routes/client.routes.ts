import { Router } from "express";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/client.controller";
import { authenticate } from "../middlewares/auth.middleware";

const Clientrouter = Router();

// Protected routes (requires authentication)
Clientrouter.use(authenticate);

// GET all clients
Clientrouter.get("/", getAllClients);

// GET a client by ID
Clientrouter.get("/:id", getClientById);

// POST create a new client
Clientrouter.post("/", createClient);

// PUT update an existing client by ID
Clientrouter.put("/:id", updateClient);

// DELETE a client by ID
Clientrouter.delete("/:id", deleteClient);

export default Clientrouter;
