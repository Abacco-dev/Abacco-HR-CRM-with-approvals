// server/src/routes/teams.js
const router = require("express").Router();
const { authenticate, authorize, prisma } = require("../utils/auth");

// Secure all routes
router.use(authenticate);

// Create a new team (ADMIN, MANAGER)
router.post("/", authorize("ADMIN", "MANAGER"), async (req, res, next) => {
  try {
    const { name, leaderId } = req.body;

    if (!name) return res.status(400).json({ error: "Team name is required" });

    const team = await prisma.team.create({
      data: {
        name,
        leaderId: leaderId ? parseInt(leaderId) : null,
      },
    });

    res.json(team);
  } catch (err) {
    next(err);
  }
});

// Get all teams with leader + members
router.get("/", async (req, res, next) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        leader: { select: { id: true, name: true, email: true } },
        members: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(teams);
  } catch (err) {
    next(err);
  }
});

// Update team (ADMIN, MANAGER)
router.put("/:id", authorize("ADMIN", "MANAGER"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, leaderId } = req.body;

    const team = await prisma.team.update({
      where: { id: parseInt(id) },
      data: {
        name,
        leaderId: leaderId ? parseInt(leaderId) : null,
      },
    });

    res.json(team);
  } catch (err) {
    next(err);
  }
});

// Delete team (ADMIN only)
router.delete("/:id", authorize("ADMIN"), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.team.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
