// src/controllers/employeeController.js
import prisma from "../prisma.js";

// ✅ Fetch all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { id: "asc" },
    });
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// ✅ Fetch single employee by ID
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
    });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};
