import { Request, Response } from "express";
import Plan from "../models/plan.model";
import { CreatePlanDto } from "../dto/CreatePlanDto.dto";
import { UpdatePlanDto } from "../dto/UpdatePlan.dto";
import { validate } from "class-validator";

export const createPlan = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      storageSize,
      duration,
      tvaPercent,
    }: CreatePlanDto = req.body;

    const plan = await Plan.create({
      name,
      description,
      price,
      storageSize,
      duration,
      tvaPercent,
    });

    res.status(201).json({
      message: "Plan crée avec succès",
      plan,
    });
  } catch (err) {
    res.status(500).json({
      message: "erreur lors de la création du plan",
      error: (err as Error).message,
    });
  }
};

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plan.findAll();
    res.status(200).json({ plans });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des plans",
      error: (err as Error).message,
    });
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "plan non trouvé" });
    }

    res.status(200).json({ plan });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération du plan",
      error: (err as Error).message,
    });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, duration }: UpdatePlanDto = req.body;

  const updateDto = new UpdatePlanDto();
  updateDto.name = name;
  updateDto.description = description;
  updateDto.price = price;
  updateDto.duration = duration;

  const errors = await validate(updateDto);

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      })),
    });
  }

  try {
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "plan non trouvé" });
    }

    plan.name = name || plan.name;
    plan.description = description || plan.description;
    plan.price = price || plan.price;
    plan.duration = duration || plan.duration;

    await plan.save();

    res.status(200).json({
      message: "Plan mis à jour avec succès",
      plan,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du plan",
      error: (err as Error).message,
    });
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.destroy();

    res.status(200).json({
      message: "Plan deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting plan",
      error: (err as Error).message,
    });
  }
};
