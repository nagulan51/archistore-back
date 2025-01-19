import { Router } from "express";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscription.controller";

const subscriptionRouter = Router();

subscriptionRouter.post("/", createSubscription);

subscriptionRouter.get("/", getSubscriptions);

subscriptionRouter.get("/:id", getSubscriptionById);

subscriptionRouter.put("/:id", updateSubscription);

subscriptionRouter.delete("/:id", deleteSubscription);

export default subscriptionRouter;
