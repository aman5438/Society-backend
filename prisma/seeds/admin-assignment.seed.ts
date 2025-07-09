import { PrismaClient, Society, SubSociety } from '@prisma/client';

export async function seedAdminAssignments(
  prisma: PrismaClient,
  societies: Society[],
  subSocieties: SubSociety[]
) {
  for (let i = 0; i < 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: `admin${i + 1}@example.com`,
        password: '$2b$10$zKKE9Ipo..hUkC0I9aGp6.3uq.Y0FZDhC51aWoBWhzuMShBcCmHqW', // bcrypt hash
        name: `Admin User ${i + 1}`,
        phone: `99999123${i}`,
        role: 'SOCIETY_ADMIN',
        status: 'ACTIVE',
      },
    });

    await prisma.adminAssignment.create({
      data: {
        userId: user.id,
        societyId: societies[i % societies.length].id,
        subSocietyId: subSocieties[i % subSocieties.length].id,
      },
    });
  }
}
