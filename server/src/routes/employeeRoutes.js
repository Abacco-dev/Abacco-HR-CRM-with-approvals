// src/routes/employeeRoutes.js
import express from "express";
import {
    getAllEmployees,
    getEmployeeById,
} from "../controllers/employeeController.js";

const router = express.Router();

// GET all employees
router.get("/", getAllEmployees);

// GET employee by ID
router.get("/:id", getEmployeeById);

export default router;
