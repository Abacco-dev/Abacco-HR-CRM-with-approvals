const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all employees
exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// Create new employee
exports.createEmployee = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const employee = await prisma.employee.create({
      data: { name, email, role },
    });
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};
