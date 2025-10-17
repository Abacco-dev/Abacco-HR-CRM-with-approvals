// const router = require('express').Router();
// const { authenticate, authorize, prisma } = require('../utils/auth');
// router.use(authenticate);
// router.post('/clock-in', async (req, res, next) => {
//   try { const userId = req.user.id; const date = new Date(); const key = new Date(date.getFullYear(), date.getMonth(), date.getDate()); const rec = await prisma.attendanceRecord.upsert({ where: { userId_date: { userId, date: key } }, update: { clockIn: date, status: 'PRESENT' }, create: { userId, date: key, clockIn: date, status: 'PRESENT' } }); res.json(rec); } catch (e) { next(e); }
// });
// router.post('/clock-out', async (req, res, next) => {
//   try { const userId = req.user.id; const date = new Date(); const key = new Date(date.getFullYear(), date.getMonth(), date.getDate()); const rec = await prisma.attendanceRecord.update({ where: { userId_date: { userId, date: key } }, data: { clockOut: date } }); res.json(rec); } catch (e) { next(e); }
// });
// router.post('/leave', async (req, res, next) => { try { const userId = req.user.id; const { type, startDate, endDate, reason } = req.body; const leave = await prisma.leaveRequest.create({ data: { userId, type, startDate: new Date(startDate), endDate: new Date(endDate), reason } }); res.json(leave); } catch (e) { next(e); } });
// router.get('/me', async (req, res, next) => { try { const userId = req.user.id; const list = await prisma.attendanceRecord.findMany({ where: { userId }, orderBy: { date: 'desc' } }); res.json(list); } catch (e) { next(e); } });
// module.exports = router;


// routes/attendanceActivity.js
import express from "express";
const router = express.Router();

/**
 * Dummy backend route for logging mouse activity
 */
router.post("/activity", async (req, res) => {
  try {
    const { employeeId, date, movementCount, rightClickCount, activeMinutes } = req.body;

    // Example Prisma logic (commented out for now)
    // await prisma.mouseActivity.create({
    //   data: { employeeId, date, movementCount, rightClickCount, activeMinutes }
    // });

    res.json({ message: "Activity logged successfully", data: req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


