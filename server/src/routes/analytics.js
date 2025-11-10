const router = require("express").Router();
const { authenticate, prisma } = require("../utils/auth");

// Require login for all dashboard routes
router.use(authenticate);

// =========================
// GET /api/dashboard
// =========================
router.get("/dashboard", async (req, res, next) => {
  try {
    // 1️⃣ Total Employees
    const totalEmployees = await prisma.user.count();

    // 2️⃣ Attendance Today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const attendanceToday = await prisma.attendanceRecord.count({
      where: { date: startOfDay, status: "PRESENT" },
    });

    // 3️⃣ Pending Leave Requests
    const requestPaidLeave = await prisma.leaveRequest.count({
      where: { status: "PENDING" },
    });

    // 4️⃣ Employee performance (based on Targets or Reviews)
    const performance = await prisma.performanceReview.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        createdAt: true,
        rating: true,
      },
    });

    const employeePerformance = performance.map((p) => ({
      date: p.createdAt.toISOString().split("T")[0],
      closed: Math.round((p.rating / 5) * 20),
      target: 20,
    }));

    // 5️⃣ Employees (status)
    const employees = await prisma.user.findMany({
      select: {
        name: true,
        role: true,
        profile: {
          select: { jobTitle: true, department: true },
        },
      },
      take: 5,
    });

    const employeeList = employees.map((e) => ({
      name: e.name,
      role: e.profile?.jobTitle || e.role,
      jobLevel: e.profile?.department || "N/A",
      status: "Active",
    }));

    // 6️⃣ Announcements
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const formattedAnnouncements =
      announcements.length > 0
        ? announcements.map((a) => ({
          title: a.title,
          desc: a.desc || "",
        }))
        : [
          { title: "Mass Leave", desc: "Collective leave May 1–3, 2024" },
          { title: "Pay Day", desc: "Salary processed, check your account" },
        ];

    // 7️⃣ Scheduled Interviews
    const interviews = await prisma.applicant.findMany({
      where: { status: "INTERVIEW" },
      select: {
        name: true,
        job: { select: { title: true } },
        notes: true,
      },
      take: 3,
    });

    const formattedInterviews =
      interviews.length > 0
        ? interviews.map((i) => ({
          candidate: i.name,
          position: i.job?.title || "N/A",
          time: "TBD",
        }))
        : [
          { candidate: "Chiurul Aji", position: "UI/UX Designer", time: "11:00 AM" },
          { candidate: "Gusto Nusamba", position: "Fullstack Developer", time: "2:00 PM" },
        ];

    // ✅ Combine response
    const dashboardData = {
      totalEmployees,
      attendanceToday,
      requestPaidLeave,
      employeePerformance,
      employees: employeeList,
      announcements: formattedAnnouncements,
      interviews: formattedInterviews,
    };

    res.json(dashboardData);
  } catch (err) {
    console.error("Dashboard error:", err);
    next(err);
  }
});

module.exports = router;
