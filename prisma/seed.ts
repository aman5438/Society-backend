import { PrismaClient } from '@prisma/client';
import { seedSocieties } from './seeds/society.seed';
import { seedFlats } from './seeds/flat.seed';
import { seedSubSocieties } from './seeds/subsociety.seed';
import { seedAdminAssignments } from './seeds/admin-assignment.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding started...');

  const societies = await seedSocieties(prisma);
  console.log(`✅ Seeded ${societies.length} societies`);

  const subSocieties = await seedSubSocieties(prisma, societies);
  console.log(`✅ Seeded ${subSocieties.length} sub-societies`);

  const flats = await seedFlats(prisma, societies, subSocieties);
  console.log(`✅ Seeded ${flats.length} flats`);

  await seedAdminAssignments(prisma, societies, subSocieties);
  console.log(`✅ Seeded 3 admin assignments`);

  console.log('🌱 Seeding completed');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
