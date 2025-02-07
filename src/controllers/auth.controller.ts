import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validate } from "class-validator";
import User from "../models/user.model";
import { RegisterDto } from "../dto/Register.dto";
import { LoginDto } from "../dto/Login.dto";
import { sendEmail } from "../utils/emailSender";
import { createSubscription } from "./subscription.controller";
const JWT_SECRET = process.env.JWT_SECRET || "dOl6VBeGRkimzwI7DzXgf47";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: RegisterDto = req.body;

    const dto = new RegisterDto(name, email, password);
    dto.name = name;
    dto.email = email;
    dto.password = password;

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

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "client",
    });

    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    createSubscription(req, res);
    /*  sendEmail(
      email,
      "Inscription réussie",
      `Bonjour ${name},\n\nVotre inscription a été effectuée avec succès.`
    ); */
  } catch (err) {
    res.status(500).json({
      message: "Error registering user",
      error: (err as Error).message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginDto = req.body;

    const dto = new LoginDto(email, password);
    dto.email = email;
    dto.password = password;

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

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data", error: err });
  }
};
