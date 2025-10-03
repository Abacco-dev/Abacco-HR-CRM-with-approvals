// server/src/routes/crm.js
import express from "express";
import { crmController } from "../controllers/crmController.js";

const router = express.Router();

router.get("/clients", crmController.getClients);
router.get("/leads", crmController.getLeads);
router.get("/deals", crmController.getDeals);

export default router;
