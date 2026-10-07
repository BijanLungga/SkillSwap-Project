import prisma from '../config/database';

export const getMessages = async (swapRequestId: string) => {
  return prisma.chatMessage.findMany({
    where: { swapRequestId },
    include: {
      sender: { select: { id: true, name: true, email: true, bio: true, createdAt: true } }
    },
    orderBy: { createdAt: 'asc' }
  });
};

export const sendMessage = async (swapRequestId: string, senderId: string, messageText: string) => {
  const swapRequest = await prisma.swapRequest.findUnique({ where: { id: swapRequestId } });
  
  if (!swapRequest) throw new Error('Permintaan tukar tidak ditemukan');
  if (swapRequest.status !== 'ACCEPTED') throw new Error('Hanya bisa mengirim pesan pada pertukaran yang sudah disetujui');
  if (swapRequest.senderId !== senderId && swapRequest.receiverId !== senderId) {
    throw new Error('Anda tidak memiliki akses ke percakapan ini');
  }

  return prisma.chatMessage.create({
    data: { swapRequestId, senderId, messageText },
    include: {
      sender: { select: { id: true, name: true, email: true, bio: true, createdAt: true } }
    }
  });
};
