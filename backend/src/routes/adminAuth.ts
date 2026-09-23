import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", (req, res) => {
  const { passcode } = req.body;

  if (!JWT_SECRET) {
    return res.status(500).json({
      error: "JWT_SECRET is not configured",
    });
  }

  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return res.status(401).json({
      error: "Invalid admin passcode",
    });
  }

  const token = jwt.sign(
    { role: "admin" },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    message: "Authentication successful",
    token,
  });
});

export default router;