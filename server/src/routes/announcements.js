const router = require("express").Router();
const { authenticate, prisma } = require("../utils/auth");

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(announcements);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
