import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { category: "asc" },
    });

    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id: req.params.id },
    });

    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }

    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch team member" });
  }
});

export default router;