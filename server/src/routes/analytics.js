const router = require('express').Router();
const { authenticate } = require('../utils/auth');

// Apply authentication middleware
router.use(authenticate);

router.get('/dashboard', async (req, res, next) => {
  try {
    // Dummy data to match the design
    const dummyData = {
      totalEmployees: 522,
      attendanceToday: 500,
      requestPaidLeave: 15,

      // Employee performance (based on leads closed vs target, by date)
      employeePerformance: [
        { date: "2025-09-01", closed: 12, target: 15 },
        { date: "2025-09-02", closed: 18, target: 20 },
        { date: "2025-09-03", closed: 22, target: 25 },
        { date: "2025-09-04", closed: 15, target: 20 },
        { date: "2025-09-05", closed: 30, target: 30 },
        { date: "2025-09-06", closed: 25, target: 28 },
      ],

      // Employee status table
      employees: [
        { name: "Aditya Wibowo", role: "Creative Director", jobLevel: "Senior Staff", status: "Active" },
        { name: "Fahmi Pratama", role: "Project Manager", jobLevel: "Middle Staff", status: "Active" },
        { name: "Fakhri Boden", role: "Fullstack Developer", jobLevel: "Junior Staff", status: "Paid Leave" },
      ],

      // Announcements
      announcements: [
        { title: "Mass Leave", desc: "Collective leave May 1–3, 2024" },
        { title: "Eid Al-Fitr", desc: "Holiday set for Wed–Thu, Apr 10–11, 2024" },
        { title: "Birthday Fahmi Pratama", desc: "Fahmi turns 33 today 🎉" },
        { title: "Birthday Fakhri Boden", desc: "Fakhri turns 28 today 🎉" },
        { title: "Pay Day", desc: "Salary has been processed, check your account" },
      ],

      // Schedule interviews
      interviews: [
        { candidate: "Chiurul Aji", position: "UI/UX Designer", time: "11:00 AM" },
        { candidate: "Gusto Nusamba", position: "Fullstack Developer", time: "2:00 PM" },
      ],
    };

    res.json(dummyData);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
