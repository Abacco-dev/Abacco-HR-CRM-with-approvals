const express = require("express");
const router = express.Router();
const { prisma, authenticate } = require("../utils/auth");

// Ensure all routes require login
router.use(authenticate);

/**
 * GET /api/notifications
 * Fetch all team notifications (newest first)
 */
router.get("/", async (req, res, next) => {
  try {
    const notifications = await prisma.teamNotification.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        team: { select: { id: true, name: true } },
      },
    });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    next(err);
  }
});

/**
 * POST /api/notifications
 * Create a new notification (optional for admin usage)
 */
router.post("/", async (req, res, next) => {
  try {
    const { teamId, message, type = "info" } = req.body;
    if (!teamId || !message) {
      return res.status(400).json({ error: "teamId and message are required" });
    }

    const notification = await prisma.teamNotification.create({
      data: { teamId, message, type },
    });

    res.json(notification);
  } catch (err) {
    console.error("Error creating notification:", err);
    next(err);
  }
});

/**
 * PATCH /api/notifications/:id
 * Mark notification as read or update fields
 */
router.patch("/:id", async (req, res, next) => {
  try {
    const updated = await prisma.teamNotification.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating notification:", err);
    next(err);
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification (optional cleanup)
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.teamNotification.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    next(err);
  }
});

module.exports = router;
