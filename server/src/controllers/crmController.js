// server/src/controllers/crmController.js
import { crmService } from "../services/crmService.js";

export const crmController = {
  getClients: async (req, res) => {
    const clients = await crmService.getClients();
    res.json(clients);
  },
  getLeads: async (req, res) => {
    const leads = await crmService.getLeads();
    res.json(leads);
  },
  getDeals: async (req, res) => {
    const deals = await crmService.getDeals();
    res.json(deals);
  },
};
