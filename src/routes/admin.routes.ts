import { Router } from "express";
import {
  getAllClients,
  getClientDetails,
  getAllFiles,
  getDashboardStatistics,
  deleteClient,
} from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";

const Adminrouter = Router();

// Protect all routes with the `authenticate` middleware
Adminrouter.use(authenticate);

Adminrouter.get("/clients", getAllClients);
Adminrouter.get("/clients/:id", getClientDetails);
Adminrouter.get("/files", getAllFiles);
Adminrouter.get("/dashboard", getDashboardStatistics);
Adminrouter.delete("/clients/:id", deleteClient);

export default Adminrouter;
