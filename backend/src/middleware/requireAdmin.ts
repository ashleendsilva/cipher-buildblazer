import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    return res.status(500).json({
      error: "JWT_SECRET is not configured",
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Admin authentication required",
    });
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    return res.status(401).json({
      error: "Admin authentication required",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (
      typeof payload !== "object" ||
      payload === null ||
      payload.role !== "admin"
    ) {
      return res.status(403).json({
        error: "Invalid admin token",
      });
    }

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    return res.status(401).json({
      error: "Invalid or expired admin token",
    });
  }
};