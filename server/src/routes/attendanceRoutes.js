// server/src/routes/attendanceRoutes.js
const express = require("express");
const { authenticate } = require("../utils/auth");
const {
    clockIn,
    clockOut,
    getTodayRecord,
    getAllRecords, // ✅ new controller
} = require("../controllers/attendanceController");

const router = express.Router();

// ✅ Protect routes with authentication
router.use(authenticate);

// POST → Clock In
router.post("/clock-in", clockIn);

// POST → Clock Out
router.post("/clock-out", clockOut);

// GET → Fetch today’s record
router.get("/today", getTodayRecord);

// ✅ NEW → Fetch all attendance records
router.get("/", getAllRecords);

module.exports = router;
