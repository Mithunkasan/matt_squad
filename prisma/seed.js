const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");
  
  // Ensure default goal exists
  const goal = await prisma.goal.upsert({
    where: { id: 'default-goal' },
    update: {},
    create: {
      id: 'default-goal',
      amount: 5000.0,
    },
  });
  
  console.log("Seeded Goal:", goal);

  // Check if any tasks exist; if not, seed initial tasks totaling 1250
  const taskCount = await prisma.task.count();
  if (taskCount === 0) {
    console.log("No tasks found, seeding initial tasks totaling 1250...");
    const initialTasks = [
      { taskName: "UI/UX Design Mockups", amount: 450.0 },
      { taskName: "Database Architecture Setup", amount: 350.0 },
      { taskName: "Landing Page Development", amount: 450.0 }
    ];

    for (const t of initialTasks) {
      const createdTask = await prisma.task.create({ data: t });
      console.log("Seeded Task:", createdTask);
    }
  } else {
    console.log(`Found ${taskCount} tasks, skipping task seeding.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
