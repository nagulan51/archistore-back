import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      role: string;
    };
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ce middleware permet de verifier si l'utilisateur est authentifié
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the token is in the Authorization header or query parameter
  let token: string | undefined = req.headers.authorization
    ? req.headers.authorization.split(" ")[1] // Extract token from "Bearer" header
    : (req.query.token as string); // Get token from query parameter if not in header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };

    // Attach decoded user information to the request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    }; // Proceed to the next middleware
    req.body.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    //on verifie si le role de l'utilisateur est dans le tableau des roles autorisés
    if (!userRole || !roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have permission." });
    }

    next();
  };
};
