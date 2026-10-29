import prisma from '../config/database';
import * as NotificationService from '../services/NotificationService';
import { webSocketService } from '../services/WebSocketService';

jest.mock('../config/database', () => {
  return {
    __esModule: true,
    default: {
      notification: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
      },
    },
  };
});

jest.mock('../services/WebSocketService', () => {
  return {
    webSocketService: {
      sendToUser: jest.fn(),
    },
  };
});

const mockPrisma = prisma as unknown as {
  notification: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
    count: jest.Mock;
  };
};

describe('NotificationService - Business Logic & Acceptance Criteria', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserNotifications', () => {
    it('harus mengembalikan daftar notifikasi milik pengguna terurut dari yang terbaru', async () => {
      const mockNotifications = [
        {
          id: 'notif-1',
          userId: 'user-1',
          type: 'SWAP_REQUEST_RECEIVED',
          title: 'Permintaan Pertukaran Baru',
          message: 'Alice mengirim permohonan',
          link: '/swap-requests',
          isRead: false,
          createdAt: new Date(),
        },
      ];
      mockPrisma.notification.findMany.mockResolvedValueOnce(mockNotifications);

      const result = await NotificationService.getUserNotifications('user-1');

      expect(result).toEqual(mockNotifications);
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('harus melempar error jika userId tidak diisi', async () => {
      await expect(NotificationService.getUserNotifications('')).rejects.toThrow(
        'ID pengguna wajib diisi'
      );
    });
  });

  describe('getUnreadCount', () => {
    it('harus menghitung jumlah notifikasi yang belum dibaca secara akurat', async () => {
      mockPrisma.notification.count.mockResolvedValueOnce(3);

      const count = await NotificationService.getUnreadCount('user-1');

      expect(count).toBe(3);
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
      });
    });

    it('harus melempar error jika userId tidak disertakan', async () => {
      await expect(NotificationService.getUnreadCount('')).rejects.toThrow(
        'ID pengguna wajib diisi'
      );
    });
  });

  describe('createNotification', () => {
    it('harus berhasil membuat notifikasi dan memicu kiriman push real-time', async () => {
      const mockCreated = {
        id: 'notif-new',
        userId: 'user-2',
        type: 'SWAP_REQUEST_ACCEPTED',
        title: 'Permintaan Disetujui',
        message: 'Bob menyetujui pertukaran',
        link: '/swap-requests',
        isRead: false,
        createdAt: new Date(),
      };
      mockPrisma.notification.create.mockResolvedValueOnce(mockCreated);

      const result = await NotificationService.createNotification({
        userId: 'user-2',
        type: 'SWAP_REQUEST_ACCEPTED',
        title: 'Permintaan Disetujui',
        message: 'Bob menyetujui pertukaran',
        link: '/swap-requests',
      });

      expect(result).toEqual(mockCreated);
      expect(mockPrisma.notification.create).toHaveBeenCalled();
      expect(webSocketService.sendToUser).toHaveBeenCalledWith('user-2', {
        type: 'NOTIFICATION',
        data: mockCreated,
      });
    });

    it('harus menolak pembuatan jika data wajib kosong', async () => {
      await expect(
        NotificationService.createNotification({
          userId: '',
          type: 'TEST',
          title: 'Judul',
          message: 'Pesan',
        })
      ).rejects.toThrow('ID pengguna penerima notifikasi wajib diisi');

      await expect(
        NotificationService.createNotification({
          userId: 'u1',
          type: 'TEST',
          title: '',
          message: 'Pesan',
        })
      ).rejects.toThrow('Judul notifikasi wajib diisi');

      await expect(
        NotificationService.createNotification({
          userId: 'u1',
          type: 'TEST',
          title: 'Judul',
          message: '',
        })
      ).rejects.toThrow('Pesan notifikasi wajib diisi');
    });
  });

  describe('markAsRead', () => {
    it('harus berhasil menandai notifikasi sebagai telah dibaca', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: 'notif-1',
        userId: 'user-1',
        isRead: false,
      });
      mockPrisma.notification.update.mockResolvedValueOnce({
        id: 'notif-1',
        userId: 'user-1',
        isRead: true,
      });

      const result = await NotificationService.markAsRead('notif-1', 'user-1');

      expect(result.isRead).toBe(true);
      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: { isRead: true },
      });
    });

    it('harus menolak jika notifikasi tidak ditemukan', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce(null);

      await expect(NotificationService.markAsRead('notif-missing', 'user-1')).rejects.toThrow(
        'Notifikasi tidak ditemukan'
      );
    });

    it('harus menolak jika pengguna bukan pemilik notifikasi', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: 'notif-1',
        userId: 'other-user',
        isRead: false,
      });

      await expect(NotificationService.markAsRead('notif-1', 'user-1')).rejects.toThrow(
        'Anda tidak memiliki akses ke notifikasi ini'
      );
    });
  });

  describe('markAllAsRead', () => {
    it('harus memperbarui seluruh notifikasi belum dibaca milik pengguna', async () => {
      mockPrisma.notification.updateMany.mockResolvedValueOnce({ count: 5 });

      const result = await NotificationService.markAllAsRead('user-1');

      expect(result.success).toBe(true);
      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRead: false },
        data: { isRead: true },
      });
    });
  });
});
