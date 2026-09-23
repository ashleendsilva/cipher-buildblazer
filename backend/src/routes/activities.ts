import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Get all activities
router.get("/", async (_req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "asc" },
    });

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

// Get one activity
router.get("/:id", async (req, res) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: req.params.id },
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

export default router;