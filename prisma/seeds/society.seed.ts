import { PrismaClient, Society } from '@prisma/client';

export async function seedSocieties(prisma: PrismaClient) {
  const societies: Society[] = [];

  for (let i = 1; i <= 5; i++) {
    const society = await prisma.society.create({
      data: {
        name: `Sunshine Residency ${i}`,
        societyCode: `SUN_RES_${100 + i}`,
      },
    });
    societies.push(society);
  }

  return societies;
}
