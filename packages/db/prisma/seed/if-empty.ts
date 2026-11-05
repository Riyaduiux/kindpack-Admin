// Seeds the database only when it has no users yet (safe to run on every start).
import { PrismaClient } from '@prisma/client';

async function run() {
  const prisma = new PrismaClient();
  const users = await prisma.user.count();
  await prisma.$disconnect();
  if (users > 0) {
    console.log(`Database already has ${users} users: skipping seed.`);
    return;
  }
  console.log('Empty database: loading the seed data…');
  require('./index');
}

void run();
