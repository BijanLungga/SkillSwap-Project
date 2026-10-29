import prisma from '../config/database';
import { createNotification } from './NotificationService';

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

  const createdMessage = await prisma.chatMessage.create({
    data: { swapRequestId, senderId, messageText },
    include: {
      sender: { select: { id: true, name: true, email: true, bio: true, createdAt: true } }
    }
  });

  // Kirim notifikasi ke partner
  try {
    const partnerId = swapRequest.senderId === senderId ? swapRequest.receiverId : swapRequest.senderId;
    const senderName = createdMessage.sender?.name || 'Partner';
    const previewText = messageText.length > 50 ? `${messageText.slice(0, 50)}...` : messageText;
    await createNotification({
      userId: partnerId,
      type: 'NEW_CHAT_MESSAGE',
      title: `Pesan baru dari ${senderName}`,
      message: previewText,
      link: '/swap-requests',
    });
  } catch (err) {
    // Fail-safe
  }

  return createdMessage;
};
