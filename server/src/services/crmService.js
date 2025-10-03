// server/src/services/crmService.js
import { prisma } from "../config/db.js";

export const crmService = {
  getClients: async () =>
    await prisma.client.findMany({ select: { id: true, name: true, email: true } }),

  getLeads: async () =>
    await prisma.lead.findMany({ select: { id: true, name: true, status: true } }),

  getDeals: async () =>
    await prisma.deal.findMany({ select: { id: true, title: true, amount: true } }),
};
