import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const applicationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  year: z.string().min(1).max(50),
  domain: z.string().min(1).max(100),
  message: z.string().max(1000).optional(),
});

router.post("/", async (req, res) => {
  const result = applicationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid application data",
      details: result.error.flatten(),
    });
  }

  try {
    const application = await prisma.application.create({
      data: result.data,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: application.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to submit application",
    });
  }
});

export default router;