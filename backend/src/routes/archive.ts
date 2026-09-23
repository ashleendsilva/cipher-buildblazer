import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const archive = await prisma.archiveItem.findMany({
      orderBy: { year: "desc" },
    });

    res.json(archive);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch archive" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await prisma.archiveItem.findUnique({
      where: { id: req.params.id },
    });

    if (!item) {
      return res.status(404).json({ error: "Archive item not found" });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch archive item" });
  }
});

export default router;