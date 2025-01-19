import { Request, Response } from "express";
import { validate } from "class-validator";
import Subscription from "../models/subscription.model";
import {
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
} from "../dto/subscription.dto";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      plan,
      startDate,
      endDate,
      paymentMethod,
    }: CreateSubscriptionDTO = req.body;

    // Create DTO instance
    const dto = new CreateSubscriptionDTO(
      userId,
      plan,
      startDate ? startDate : null,
      endDate ? endDate : null,
      paymentMethod
    );
    dto.userId = userId;
    dto.plan = plan;
    dto.startDate = startDate;
    dto.endDate = endDate;
    dto.paymentMethod = paymentMethod;

    // Validate DTO instance
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }

    // Create subscription if validation passes
    const subscription = await Subscription.create({
      userId,
      plan,
      startDate: startDate ? startDate : new Date(),
      endDate,
      status: "active",
      paymentMethod,
    });

    res.status(201).json({
      message: "Subscription created successfully",
      subscription,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating subscription",
      error: (err as Error).message,
    });
  }
};

export const getSubscriptions = async (_req: Request, res: Response) => {
  try {
    const subscriptions = await Subscription.findAll();
    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving subscriptions",
      error: (err as Error).message,
    });
  }
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json(subscription);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving subscription",
      error: (err as Error).message,
    });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plan, status, endDate, paymentMethod }: UpdateSubscriptionDTO =
      req.body;

    // Create DTO instance
    const dto = new UpdateSubscriptionDTO();
    dto.plan = plan;
    dto.status = status;
    dto.endDate = endDate;
    dto.paymentMethod = paymentMethod;

    // Validate DTO instance
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Update subscription if validation passes
    subscription.plan = plan || subscription.plan;
    subscription.status = status || subscription.status;
    subscription.endDate = endDate || subscription.endDate;
    subscription.paymentMethod = paymentMethod || subscription.paymentMethod;

    await subscription.save();

    res.status(200).json({
      message: "Subscription updated successfully",
      subscription,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating subscription",
      error: (err as Error).message,
    });
  }
};

export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await subscription.destroy();

    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting subscription",
      error: (err as Error).message,
    });
  }
};
