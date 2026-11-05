// Seeds the database with the first admin account.
//   npm run db:seed
// Credentials come from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (defaults below, change them on a live server).
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Admin', role: 'ADMIN', status: 'ACTIVE', passwordHash: await bcrypt.hash(password, 10) },
  });

  console.log(`Seeded admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
