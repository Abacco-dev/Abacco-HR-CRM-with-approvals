// server/src/routes/employees.js
const router = require("express").Router();
const { authenticate, authorize, prisma, hashPassword } = require("../utils/auth");

// ✅ Protect all employee routes
router.use(authenticate);

// ==========================
// 📋 Get all employees
// ==========================
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true },
    });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// ==========================
// ➕ Create employee (Admin/Manager only)
// ==========================
router.post("/", authorize("ADMIN", "MANAGER"), async (req, res, next) => {
  try {
    const { email, password, name, role, jobTitle, department, location } = req.body;

    // Check if email already exists
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already used" });

    // Hash password before saving
    const hashed = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role: role || "EMPLOYEE" },
    });

    // Create employee profile
    await prisma.employeeProfile.create({
      data: {
        userId: user.id,
        jobTitle,
        department,
        location,
      },
    });

    res.json(user);
  } catch (e) {
    next(e);
  }
});

// ==========================
// 📋 Get employee by ID
// ==========================
router.get("/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { profile: true, documents: true, attendance: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (e) {
    next(e);
  }
});

// ==========================
// ✏️ Update employee (Admin/Manager only)
// ==========================
router.put("/:id", authorize("ADMIN", "MANAGER"), async (req, res, next) => {
  try {
    const { name, phone, role, jobTitle, department, location } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, phone, role },
    });

    await prisma.employeeProfile.upsert({
      where: { userId: user.id },
      update: { jobTitle, department, location },
      create: { userId: user.id, jobTitle, department, location },
    });

    res.json(user);
  } catch (e) {
    next(e);
  }
});

// ==========================
// ❌ Delete employee (Admin/Manager only)
// ==========================
router.delete("/:id", authorize("ADMIN", "MANAGER"), async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
