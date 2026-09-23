import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const applicationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  year: z.string().trim().min(1).max(50),
  domain: z.string().trim().min(1).max(100),
  message: z.string().trim().max(1000).optional(),
});

// PUBLIC — submit application
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
      data: {
        ...result.data,
        applicantId: `CPHR-${Math.floor(1000 + Math.random() * 9000)}-${result.data.year.slice(0, 1)}Y`,
      },
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      applicationId: application.id,
      applicantId: application.applicantId,
    });
  } catch (error) {
    console.error("Failed to submit application:", error);

    return res.status(500).json({
      error: "Failed to submit application",
    });
  }
});

// ADMIN — get applications
router.get("/", requireAdmin, async (_req, res) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(applications);
  } catch (error) {
    console.error("Failed to fetch applications:", error);

    return res.status(500).json({
      error: "Failed to fetch applications",
    });
  }
});

// ADMIN — update application status
router.patch("/:id/status", requireAdmin, async (req, res) => {
  const result = z
    .object({
      status: z.enum(["pending", "approved", "contacted", "rejected"]),
    })
    .safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid status",
    });
  }

  try {
    const application = await prisma.application.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        status: result.data.status,
      },
    });

    return res.json(application);
  } catch (error) {
    console.error("Failed to update application status:", error);

    return res.status(404).json({
      error: "Application not found",
    });
  }
});

// ADMIN — delete application
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.application.delete({
      where: {
        id: String(req.params.id),
      },
    });

    return res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete application:", error);

    return res.status(404).json({
      error: "Application not found",
    });
  }
});

export default router;