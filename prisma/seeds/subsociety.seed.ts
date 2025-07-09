import { PrismaClient, Society, SubSociety } from '@prisma/client';

export async function seedSubSocieties(prisma: PrismaClient, societies: Society[]) {
  const subSocieties: SubSociety[] = [];

  for (let i = 0; i < societies.length; i++) {
    const sub = await prisma.subSociety.create({
      data: {
        name: `Wing ${String.fromCharCode(65 + i)}`, // A, B, C...
        societyId: societies[i].id,
      },
    });
    subSocieties.push(sub);
  }

  return subSocieties;
}
