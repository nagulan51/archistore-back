import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ce middleware permet de verifier si l'utilisateur est authentifié
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // on verifie si le token est present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    //on verifie le token avec la clé secrete
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };

    //on passe dans entete de la requete le userId et le role
    req.body.userId = decoded.id;
    req.body.role = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.body.role;
    //on verifie si le role de l'utilisateur est dans le tableau des roles autorisés
    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have permission." });
    }

    next();
  };
};
