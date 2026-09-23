import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const activitySchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url().max(1000),
});

// CREATE
router.post("/", requireAdmin, async (req, res) => {
  const result = activitySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid activity data",
      details: result.error.flatten(),
    });
  }

  try {
    const activity = await prisma.activity.create({
      data: result.data,
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create activity",
    });
  }
});

// UPDATE
router.patch("/:id", requireAdmin, async (req, res) => {
  const result = activitySchema.partial().safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid activity data",
      details: result.error.flatten(),
    });
  }

  try {
    const activity = await prisma.activity.update({
      where: {
        id: String(req.params.id),
      },
      data: result.data,
    });

    res.json(activity);
  } catch (error) {
    console.error(error);

    res.status(404).json({
      error: "Activity not found",
    });
  }
});

// DELETE
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.activity.delete({
      where: {
        id: String(req.params.id),
      },
    });

    res.json({
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(404).json({
      error: "Activity not found",
    });
  }
});

export default router;