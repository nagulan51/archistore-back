import { Request, Response } from "express";
import { validate } from "class-validator";
import Subscription from "../models/subscription.model";
import User from "../models/user.model";
import Plan from "../models/plan.model";
import Payment from "../models/payment.model";
import {
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
} from "../dto/subscription.dto";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      planId,
      startDate,
      paymentMethod,
      statutJuridique,
      firstname,
      lastname,
      rue,
      codePostal,
      ville,
    }: CreateSubscriptionDTO = req.body;

    // Create DTO instance
    const dto = new CreateSubscriptionDTO(
      userId,
      planId,
      startDate ? startDate : null,
      null,
      paymentMethod,
      statutJuridique,
      firstname,
      lastname,
      rue,
      codePostal,
      ville
    );
    dto.userId = userId;
    dto.planId = planId;
    dto.startDate = startDate;
    dto.paymentMethod = paymentMethod;
    dto.statutJuridique = statutJuridique;
    dto.firstname = firstname;
    dto.lastname = lastname;
    dto.rue = rue;
    dto.codePostal = codePostal;
    dto.ville = ville;

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
    //verifier si l'utilisateur existe
    const user = await User.findByPk(userId);
    console.log(userId);
    if (!user) {
      return res.status(404).json({ message: "utilisateur n existe pas" });
    }
    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(404).json({ message: "le plan demandé n existe pas" });
    }
    const payment = await Payment.create({
      userId,
      method: paymentMethod,
      amount: plan.price,
      tvaPercent: plan.tvaPercent,
      statutJuridique,
      siret: null,
      firstname,
      lastname,
      rue,
      codePostal,
      ville,
    });
    console.log(payment);
    // créer un abonnement si la validation passe
    const subscription = await Subscription.create({
      userId,
      planId,
      startDate: startDate ? startDate : new Date(),
      paymentId: payment.id,
      endDate: null,
      status: "active",
      paymentMethod,
    });

    res.status(201).json({
      message: "souscription créée avec succès",
      subscription,
    });
  } catch (err) {
    res.status(500).json({
      message: "erreur lors de la création de la souscription",
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
      return res
        .status(404)
        .json({ message: "impossible de trouver la souscription" });
    }

    res.status(200).json(subscription);
  } catch (err) {
    res.status(500).json({
      message: "erreur lors de la récupération de la souscription",
      error: (err as Error).message,
    });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { planId, status, endDate, paymentMethod }: UpdateSubscriptionDTO =
      req.body;

    // Create DTO instance
    const dto = new UpdateSubscriptionDTO(
      planId,
      status,
      endDate ? endDate : null,
      paymentMethod
    );
    dto.planId = planId;
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
    subscription.planId = planId || subscription.planId;
    subscription.status = status || subscription.status;
    subscription.endDate = endDate || subscription.endDate;

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
