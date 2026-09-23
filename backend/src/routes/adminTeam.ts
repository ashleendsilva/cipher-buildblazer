import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const teamMemberSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().min(1).max(100),
  subtitle: z.string().trim().max(200).optional(),
  category: z.enum(["executive", "faculty", "core"]),
  image: z.string().trim().min(1).max(5_000_000),
  bio: z.string().trim().max(2000),
  quote: z.string().trim().max(1000).optional(),
  contributions: z.array(z.string().trim().max(500)).max(50).default([]),
  github: z.string().trim().url().optional(),
  linkedin: z.string().trim().url().optional(),
  email: z.string().trim().email().optional(),
});

// CREATE LEADER
router.post("/", requireAdmin, async (req, res) => {
  const result = teamMemberSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid leadership member data",
      details: result.error.flatten(),
    });
  }

  try {
    const leader = await prisma.teamMember.create({
      data: result.data,
    });

    return res.status(201).json(leader);
  } catch (error) {
    console.error("Failed to create leader:", error);

    return res.status(500).json({
      error: "Failed to create leadership member",
    });
  }
});

// UPDATE LEADER
router.patch("/:id", requireAdmin, async (req, res) => {
  const result = teamMemberSchema.partial().safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid leadership member data",
      details: result.error.flatten(),
    });
  }

  try {
    const leader = await prisma.teamMember.update({
      where: {
        id: String(req.params.id),
      },
      data: result.data,
    });

    return res.json(leader);
  } catch (error) {
    console.error("Failed to update leader:", error);

    return res.status(404).json({
      error: "Leadership member not found",
    });
  }
});

// DELETE LEADER
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.teamMember.delete({
      where: {
        id: String(req.params.id),
      },
    });

    return res.json({
      message: "Leadership member deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete leader:", error);

    return res.status(404).json({
      error: "Leadership member not found",
    });
  }
});

export default router;