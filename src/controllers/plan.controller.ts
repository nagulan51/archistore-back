import { Request, Response } from "express";
import Plan from "../models/plan.model";
import { CreatePlanDto } from "../dto/CreatePlanDto.dto";
import { UpdatePlanDto } from "../dto/UpdatePlan.dto";
import { validate } from "class-validator";

export const createPlan = async (req: Request, res: Response) => {
  try {
    const { name, description, price, duration }: CreatePlanDto = req.body;

    const plan = await Plan.create({
      name,
      description,
      price,
      duration,
    });

    res.status(201).json({
      message: "Plan created successfully",
      plan,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating plan",
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
      message: "Error fetching plans",
      error: (err as Error).message,
    });
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ plan });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching plan",
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
      return res.status(404).json({ message: "Plan not found" });
    }

    plan.name = name || plan.name;
    plan.description = description || plan.description;
    plan.price = price || plan.price;
    plan.duration = duration || plan.duration;

    await plan.save();

    res.status(200).json({
      message: "Plan updated successfully",
      plan,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating plan",
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
