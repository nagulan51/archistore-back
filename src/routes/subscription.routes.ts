import { Router } from "express";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscription.controller";
import { validateRequest } from "../middlewares/validateRequest";

import { authenticate, authorize } from "../middlewares/auth.middleware";
import { CreateSubscriptionDTO } from "../dto/subscription.dto"; // Import the correct DTO class

const subscriptionRouter = Router();

// Correctly pass the DTO class to the validateRequest middleware
subscriptionRouter.post(
  "/",
  authenticate,
  validateRequest(CreateSubscriptionDTO), // Pass the DTO class, not the controller
  createSubscription
);

subscriptionRouter.get("/", authenticate, getSubscriptions);

subscriptionRouter.get("/:id", authenticate, getSubscriptionById);

subscriptionRouter.put("/:id", authenticate, updateSubscription);

subscriptionRouter.delete("/:id", authenticate, deleteSubscription);

export default subscriptionRouter;
