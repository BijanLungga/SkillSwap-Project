import prisma from '../config/database';
import { webSocketService } from './WebSocketService';

export interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
}

export const createNotification = async (data: CreateNotificationInput) => {
  if (!data.userId) throw new Error('ID pengguna penerima notifikasi wajib diisi');
  if (!data.title) throw new Error('Judul notifikasi wajib diisi');
  if (!data.message) throw new Error('Pesan notifikasi wajib diisi');

  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link || null,
    },
  });

  // Push real-time notification to active client
  try {
    webSocketService.sendToUser(data.userId, {
      type: 'NOTIFICATION',
      data: notification,
    });
  } catch (err) {
    // Fail-safe: WebSocket delivery should not break database transaction
  }

  return notification;
};

export const getUserNotifications = async (userId: string) => {
  if (!userId) throw new Error('ID pengguna wajib diisi');

  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getUnreadCount = async (userId: string) => {
  if (!userId) throw new Error('ID pengguna wajib diisi');

  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error('Notifikasi tidak ditemukan');
  }

  if (notification.userId !== userId) {
    throw new Error('Anda tidak memiliki akses ke notifikasi ini');
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export const markAllAsRead = async (userId: string) => {
  if (!userId) throw new Error('ID pengguna wajib diisi');

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return { success: true };
};
