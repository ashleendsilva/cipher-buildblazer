import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const galleryImageSchema = z.object({
  url: z.string().trim().url().max(2000),
  caption: z.string().trim().max(500),
  tag: z.string().trim().max(100).optional(),
});

const eventSchema = z.object({
  badge: z.string().trim().min(1).max(100),
  dateStr: z.string().trim().min(1).max(100),
  isoDate: z.string().trim().min(1).max(30),
  venue: z.string().trim().min(1).max(300),
  title: z.string().trim().min(2).max(200),
  theme: z.string().trim().max(300).optional(),
  shortSummary: z.string().trim().min(1).max(1000),
  fullNarrative: z.array(z.string().trim().max(3000)).max(50),
  highlights: z.array(z.string().trim().max(500)).max(50),
  galleryImages: z.array(galleryImageSchema).max(100),
  tracks: z.array(z.any()).max(100).default([]),
});

// GET ALL EVENTS FOR ADMIN
router.get("/", requireAdmin, async (_req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        isoDate: "desc",
      },
    });

    return res.json(events);
  } catch (error) {
    console.error("Failed to fetch admin events:", error);

    return res.status(500).json({
      error: "Failed to fetch events",
    });
  }
});

// CREATE EVENT
router.post("/", requireAdmin, async (req, res) => {
  const result = eventSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid event data",
      details: result.error.flatten(),
    });
  }

  try {
    const event = await prisma.event.create({
      data: {
        badge: result.data.badge,
        dateStr: result.data.dateStr,
        isoDate: result.data.isoDate,
        venue: result.data.venue,
        title: result.data.title,
        theme: result.data.theme || null,
        shortSummary: result.data.shortSummary,
        fullNarrative: result.data.fullNarrative,
        highlights: result.data.highlights,
        galleryImages: result.data.galleryImages,
        tracks: result.data.tracks,
      },
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error("Failed to create event:", error);

    return res.status(500).json({
      error: "Failed to create event",
    });
  }
});

// UPDATE EVENT
router.patch("/:id", requireAdmin, async (req, res) => {
  const result = eventSchema.partial().safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid event data",
      details: result.error.flatten(),
    });
  }

  try {
    const event = await prisma.event.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        ...result.data,
        theme:
          result.data.theme === undefined
            ? undefined
            : result.data.theme || null,
      },
    });

    return res.json(event);
  } catch (error) {
    console.error("Failed to update event:", error);

    return res.status(404).json({
      error: "Event not found",
    });
  }
});

// DELETE EVENT
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.event.delete({
      where: {
        id: String(req.params.id),
      },
    });

    return res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete event:", error);

    return res.status(404).json({
      error: "Event not found",
    });
  }
});

export default router;