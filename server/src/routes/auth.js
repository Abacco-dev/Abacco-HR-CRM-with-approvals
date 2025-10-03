// src/routes/auth.js
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { hashPassword, verifyPassword, signToken } = require("../utils/auth");

const prisma = new PrismaClient();

/**
 * Register a new user
 * Accessible to Admin only if you want role-based registration (optional)
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" });
    }

    // Check if user already exists
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already used" });

    // Hash password
    const hashed = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        role: role || "EMPLOYEE",
      },
    });

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Login user
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken({ id: user.id, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
