import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

const DEFAULT_ANNOUNCEMENT = {
  enabled: true,
  text: "PROMPT OPS-2K26 Winners announced! Join CIPHER recruiting drive open for 2026 cohort.",
  badge: "ANNOUNCEMENT",
  linkText: "Join Now",
  linkUrl: "#join",
};

// PUBLIC — get current announcement
router.get("/", async (_req, res) => {
  try {
    const announcement = await prisma.announcement.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.json(announcement ?? DEFAULT_ANNOUNCEMENT);
  } catch (error) {
    console.error("Failed to fetch public announcement:", error);

    return res.status(500).json({
      error: "Failed to fetch announcement",
    });
  }
});

export default router;