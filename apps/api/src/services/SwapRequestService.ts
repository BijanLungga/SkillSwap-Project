import prisma from '../config/database';

const includeUsersWithSkills = {
  sender: { select: { id: true, name: true, email: true, bio: true, createdAt: true, skills: true } },
  receiver: { select: { id: true, name: true, email: true, bio: true, createdAt: true, skills: true } },
};

export const getSwapRequests = async (userId: string) => {
  return prisma.swapRequest.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: includeUsersWithSkills,
    orderBy: { createdAt: 'desc' },
  });
};

export const getSwapRequestById = async (id: string) => {
  return prisma.swapRequest.findUnique({
    where: { id },
    include: includeUsersWithSkills,
  });
};

export const createSwapRequest = async (senderId: string, receiverId: string, message?: string) => {
  if (senderId === receiverId) throw new Error('Tidak dapat mengirim permintaan ke diri sendiri');

  const existing = await prisma.swapRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId, status: 'PENDING' },
        { senderId: receiverId, receiverId: senderId, status: 'PENDING' },
      ],
    },
  });
  if (existing) throw new Error('Sudah ada permintaan tukar yang masih menunggu antara kedua pengguna');

  const activeSwap = await prisma.swapRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId, status: 'ACCEPTED' },
        { senderId: receiverId, receiverId: senderId, status: 'ACCEPTED' },
      ],
    },
  });
  if (activeSwap) throw new Error('Sudah ada sesi pertukaran aktif antara kedua pengguna');

  return prisma.swapRequest.create({
    data: { senderId, receiverId, message },
    include: includeUsersWithSkills,
  });
};

export const updateSwapRequestStatus = async (id: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED') => {
  const request = await prisma.swapRequest.findUnique({ where: { id } });
  if (!request) throw new Error('Permintaan tukar tidak ditemukan');

  if (request.status === 'REJECTED' || request.status === 'COMPLETED') {
    throw new Error('Permintaan tukar sudah tidak dapat diubah');
  }

  return prisma.swapRequest.update({
    where: { id },
    data: { status },
    include: includeUsersWithSkills,
  });
};
