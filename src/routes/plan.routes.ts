import { Router } from "express";
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from "../controllers/plan.controller";
import { CreatePlanDto } from "../dto/CreatePlanDto.dto";
import { UpdatePlanDto } from "../dto/UpdatePlan.dto";
import { validateRequest } from "../middlewares/validateRequest";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const Planrouter = Router();

Planrouter.post(
  "/create",
  authenticate,
  authorize(["admin"]),
  validateRequest(CreatePlanDto),
  createPlan
);

Planrouter.get("/", getPlans);

Planrouter.get("/:id", getPlanById);

Planrouter.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validateRequest(UpdatePlanDto),
  updatePlan
);

Planrouter.delete("/:id", authenticate, authorize(["admin"]), deletePlan);

export default Planrouter;
