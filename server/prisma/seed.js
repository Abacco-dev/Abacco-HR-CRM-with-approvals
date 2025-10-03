const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  // 🔑 Hash all passwords
  const adminPass = await bcrypt.hash('admin1234', 10);
  const managerPass = await bcrypt.hash('manager123', 10);
  const empPass = await bcrypt.hash('employee123', 10);

  // ✅ Upsert users (update password if user already exists)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@abacco.com' },
    update: { password: adminPass, name: 'Admin', role: 'ADMIN' },
    create: { email: 'admin@abacco.com', password: adminPass, name: 'Admin', role: 'ADMIN' },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'ashok@abacco.com' },
    update: { password: managerPass, name: 'Ashok', role: 'MANAGER' },
    create: { email: 'ashok@abacco.com', password: managerPass, name: 'Ashok', role: 'MANAGER' },
  });

  const e1 = await prisma.user.upsert({
    where: { email: 'emp1@abacco.com' },
    update: { password: empPass, name: 'Employee One', role: 'EMPLOYEE' },
    create: { email: 'emp1@abacco.com', password: empPass, name: 'Employee One', role: 'EMPLOYEE' },
  });

  const e2 = await prisma.user.upsert({
    where: { email: 'emp2@abacco.com' },
    update: { password: empPass, name: 'Employee Two', role: 'EMPLOYEE' },
    create: { email: 'emp2@abacco.com', password: empPass, name: 'Employee Two', role: 'EMPLOYEE' },
  });

  // ✅ Employee profiles
  await prisma.employeeProfile.upsert({
    where: { userId: e1.id },
    update: { jobTitle: 'Sales Executive', department: 'Sales', location: 'Bengaluru' },
    create: { userId: e1.id, jobTitle: 'Sales Executive', department: 'Sales', location: 'Bengaluru' },
  });

  await prisma.employeeProfile.upsert({
    where: { userId: e2.id },
    update: { jobTitle: 'Marketing Associate', department: 'Marketing', location: 'Pune' },
    create: { userId: e2.id, jobTitle: 'Marketing Associate', department: 'Marketing', location: 'Pune' },
  });

  // ✅ Team and members
  const team = await prisma.team.upsert({
    where: { name: 'Team 1' },
    update: { leaderId: manager.id },
    create: { name: 'Team 1', leaderId: manager.id },
  });

  await prisma.teamMember.createMany({
    data: [
      { teamId: team.id, userId: e1.id },
      { teamId: team.id, userId: e2.id },
    ],
    skipDuplicates: true,
  });

  // ✅ Targets
  await prisma.target.createMany({
    data: [
      { title: 'Team Sales Sep', period: '2025-09', value: 100000, teamId: team.id },
      { title: 'Emp1 Sales Sep', period: '2025-09', value: 50000, userId: e1.id },
      { title: 'Emp2 Sales Sep', period: '2025-09', value: 50000, userId: e2.id },
    ],
  });
  
  console.log('✅ Seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
