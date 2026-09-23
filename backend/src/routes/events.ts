import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /api/events
router.get("/", async (_req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { isoDate: "desc" },
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET /api/events/:id
router.get("/:id", async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

export default router;