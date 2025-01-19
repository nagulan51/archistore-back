import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";

// Middleware to validate the request body against a DTO
export const validateRequest = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if the dtoClass is a valid constructor
      if (typeof dtoClass !== "function") {
        return res.status(500).json({
          message: "Invalid DTO class provided",
          error: "dtoClass is not a constructor",
        });
      }

      // Create an instance of the DTO class and assign the request body to it
      const dto = Object.assign(new dtoClass(), req.body);
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

      next();
    } catch (err) {
      // Catch any unexpected errors during validation
      res.status(500).json({
        message: "Unexpected error during validation",
        error: (err as Error).message,
      });
    }
  };
};
