// routes/attendanceActivity.js
const express = require("express");
// const { prisma } = require("../utils/auth"); // uncomment later if you use Prisma
const router = express.Router();

/**
 * Dummy backend route for logging mouse activity
 */
router.post("/activity", async (req, res) => {
  try {
    const { employeeId, date, movementCount, rightClickCount, activeMinutes } = req.body;

    // Example Prisma logic (commented out for now)
    // await prisma.mouseActivity.create({
    //   data: { employeeId, date, movementCount, rightClickCount, activeMinutes },
    // });

    res.json({
      message: "Activity logged successfully",
      data: req.body,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CommonJS export
module.exports = router;
