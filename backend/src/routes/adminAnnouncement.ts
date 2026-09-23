import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const announcementSchema = z.object({
  enabled: z.boolean(),
  text: z.string().trim().min(1).max(500),
  badge: z.string().trim().min(1).max(50),
  linkText: z.string().trim().max(100).optional(),
  linkUrl: z.string().trim().max(1000).optional(),
});

// GET CURRENT ANNOUNCEMENT
router.get("/", requireAdmin, async (_req, res) => {
  try {
    const announcement = await prisma.announcement.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.json(
      announcement ?? {
        enabled: true,
        text: "PROMPT OPS-2K26 Winners announced! Join CIPHER recruiting drive open for 2026 cohort.",
        badge: "ANNOUNCEMENT",
        linkText: "Join Now",
        linkUrl: "#join",
      }
    );
  } catch (error) {
    console.error("Failed to fetch announcement:", error);

    return res.status(500).json({
      error: "Failed to fetch announcement",
    });
  }
});

// SAVE ANNOUNCEMENT
router.put("/", requireAdmin, async (req, res) => {
  const result = announcementSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid announcement data",
      details: result.error.flatten(),
    });
  }

  try {
    const existing = await prisma.announcement.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    const data = {
      enabled: result.data.enabled,
      text: result.data.text,
      badge: result.data.badge,
      linkText: result.data.linkText || null,
      linkUrl: result.data.linkUrl || null,
    };

    const announcement = existing
      ? await prisma.announcement.update({
          where: {
            id: existing.id,
          },
          data,
        })
      : await prisma.announcement.create({
          data,
        });

    return res.json(announcement);
  } catch (error) {
    console.error("Failed to save announcement:", error);

    return res.status(500).json({
      error: "Failed to save announcement",
    });
  }
});

export default router;