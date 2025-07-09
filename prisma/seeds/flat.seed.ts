import { PrismaClient, Society, SubSociety, FlatStatus, Flat } from '@prisma/client';

export async function seedFlats(
  prisma: PrismaClient,
  societies: Society[],
  subSocieties: SubSociety[]
) {
  const flats: Flat[] = [];

  for (let i = 0; i < 5; i++) {
    const flat = await prisma.flat.create({
      data: {
        flatNumber: `A-${101 + i}`,
        type: '2BHK',
        status: FlatStatus.VACANT,
        societyId: societies[i % societies.length].id,
        subSocietyId: subSocieties[i % subSocieties.length].id,
      },
    });

    flats.push(flat);
  }

  return flats;
}
