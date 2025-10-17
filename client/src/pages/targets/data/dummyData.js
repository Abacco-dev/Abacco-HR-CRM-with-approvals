// src/targets/data/dummyData.js
export const dummyTargets = [
  {
    id: 1,
    title: "Monthly Sales Revenue",
    description: "Achieve $50K in monthly sales revenue",
    type: "monthly",
    period: "2024-09",
    targetValue: 50000,
    achievedValue: 38500,
    progress: 77,
    status: "in_progress",
    assignedTo: "Sales Team",
    assignedBy: "John Manager",
    createdDate: "2024-09-01",
    deadline: "2024-09-30",
    category: "Revenue",
    priority: "high",
    reminders: [
      { date: "2024-09-15", sent: true, type: "halfway" },
      { date: "2024-09-25", sent: false, type: "warning" }
    ]
  },
  {
    id: 2,
    title: "Customer Acquisition",
    description: "Acquire 100 new customers this quarter",
    type: "quarterly",
    period: "2024-Q3",
    targetValue: 100,
    achievedValue: 85,
    progress: 85,
    status: "in_progress",
    assignedTo: "Marketing Team",
    assignedBy: "Sarah Director",
    createdDate: "2024-07-01",
    deadline: "2024-09-30",
    category: "Growth",
    priority: "high",
    reminders: [
      { date: "2024-08-15", sent: true, type: "halfway" },
      { date: "2024-09-15", sent: true, type: "warning" }
    ]
  },
  {
    id: 3,
    title: "Employee Training Completion",
    description: "Complete annual training for all employees",
    type: "annual",
    period: "2024",
    targetValue: 150,
    achievedValue: 150,
    progress: 100,
    status: "completed",
    assignedTo: "HR Team",
    assignedBy: "Mike HR",
    createdDate: "2024-01-01",
    deadline: "2024-12-31",
    category: "Development",
    priority: "medium",
    reminders: []
  },
  {
    id: 4,
    title: "Product Development Milestones",
    description: "Complete 5 major product features",
    type: "quarterly",
    period: "2024-Q3",
    targetValue: 5,
    achievedValue: 3,
    progress: 60,
    status: "at_risk",
    assignedTo: "Dev Team",
    assignedBy: "Tech Lead",
    createdDate: "2024-07-01",
    deadline: "2024-09-30",
    category: "Product",
    priority: "high",
    reminders: [{ date: "2024-09-20", sent: false, type: "urgent" }]
  }
];

export const progressData = [
  { month: 'Jan', revenue: 45000, target: 50000, customers: 78 },
  { month: 'Feb', revenue: 48000, target: 50000, customers: 82 },
  { month: 'Mar', revenue: 52000, target: 50000, customers: 89 },
  { month: 'Apr', revenue: 49000, target: 50000, customers: 95 },
  { month: 'May', revenue: 51000, target: 50000, customers: 88 },
  { month: 'Jun', revenue: 47000, target: 50000, customers: 92 },
  { month: 'Jul', revenue: 53000, target: 50000, customers: 96 },
  { month: 'Aug', revenue: 48500, target: 50000, customers: 91 },
  { month: 'Sep', revenue: 38500, target: 50000, customers: 85 }
];

export const categoryData = [
  { name: 'Revenue', value: 35, color: '#3B82F6' },
  { name: 'Growth', value: 25, color: '#10B981' },
  { name: 'Development', value: 20, color: '#8B5CF6' },
  { name: 'Product', value: 20, color: '#F59E0B' }
];

export const statusData = [
  { name: 'Completed', count: 12, color: '#10B981' },
  { name: 'In Progress', count: 18, color: '#3B82F6' },
  { name: 'At Risk', count: 5, color: '#EF4444' },
  { name: 'Overdue', count: 2, color: '#DC2626' }
];

export const dummyEmployees = [
  { id: 'e1', name: 'John Doe', target: 40, todayAchieved: 4, weeklyAchieved: 22, totalLeads: 30, leadEmails: 'admin@company.com' },
  { id: 'e2', name: 'Asha R', target: 50, todayAchieved: 6, weeklyAchieved: 35, totalLeads: 44, leadEmails: 'ops@company.com' },
  { id: 'e3', name: 'Ravi K', target: 30, todayAchieved: 2, weeklyAchieved: 15, totalLeads: 18, leadEmails: 'hr@company.com' }
];
const dashboardData = {
  targets: dummyTargets,
  progress: progressData,
  categories: categoryData,
  status: statusData,
  employees: dummyEmployees
};

export default dashboardData;
