import prisma from '../config/database';
import { createNotification } from './NotificationService';

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

  const created = await prisma.swapRequest.create({
    data: { senderId, receiverId, message },
    include: includeUsersWithSkills,
  });

  // Kirim notifikasi ke receiver
  try {
    const senderName = created.sender?.name || 'Seseorang';
    await createNotification({
      userId: receiverId,
      type: 'SWAP_REQUEST_RECEIVED',
      title: 'Permintaan Pertukaran Baru',
      message: `${senderName} mengirim permohonan barter keahlian kepada Anda.`,
      link: '/swap-requests',
    });
  } catch (err) {
    // Fail-safe
  }

  return created;
};

export const updateSwapRequestStatus = async (id: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED') => {
  const request = await prisma.swapRequest.findUnique({ where: { id } });
  if (!request) throw new Error('Permintaan tukar tidak ditemukan');

  if (request.status === 'REJECTED' || request.status === 'COMPLETED') {
    throw new Error('Permintaan tukar sudah tidak dapat diubah');
  }

  const updated = await prisma.swapRequest.update({
    where: { id },
    data: { status },
    include: includeUsersWithSkills,
  });

  // Kirim notifikasi status perubahan
  try {
    if (status === 'ACCEPTED') {
      const partnerName = updated.receiver?.name || 'Partner';
      await createNotification({
        userId: updated.senderId,
        type: 'SWAP_REQUEST_ACCEPTED',
        title: 'Permintaan Pertukaran Disetujui',
        message: `${partnerName} telah menyetujui permintaan barter keahlian Anda. Silakan mulai berkoordinasi di chat!`,
        link: '/swap-requests',
      });
    } else if (status === 'REJECTED') {
      const partnerName = updated.receiver?.name || 'Partner';
      await createNotification({
        userId: updated.senderId,
        type: 'SWAP_REQUEST_REJECTED',
        title: 'Permintaan Pertukaran Ditolak',
        message: `${partnerName} belum dapat menerima permohonan barter keahlian Anda saat ini.`,
        link: '/swap-requests',
      });
    } else if (status === 'COMPLETED') {
      // Beritahu kedua belah pihak untuk mengisi ulasan
      await createNotification({
        userId: updated.senderId,
        type: 'SWAP_REQUEST_COMPLETED',
        title: 'Sesi Pertukaran Selesai',
        message: 'Sesi barter telah selesai. Luangkan waktu untuk memberikan ulasan & rating bintang bagi partner Anda!',
        link: '/swap-requests',
      });
      await createNotification({
        userId: updated.receiverId,
        type: 'SWAP_REQUEST_COMPLETED',
        title: 'Sesi Pertukaran Selesai',
        message: 'Sesi barter telah selesai. Luangkan waktu untuk memberikan ulasan & rating bintang bagi partner Anda!',
        link: '/swap-requests',
      });
    }
  } catch (err) {
    // Fail-safe
  }

  return updated;
};
