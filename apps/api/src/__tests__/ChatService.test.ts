import prisma from '../config/database';
import * as ChatService from '../services/ChatService';

jest.mock('../config/database', () => {
  return {
    __esModule: true,
    default: {
      swapRequest: {
        findUnique: jest.fn(),
      },
      chatMessage: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    },
  };
});

const mockPrisma = prisma as unknown as {
  swapRequest: {
    findUnique: jest.Mock;
  };
  chatMessage: {
    findMany: jest.Mock;
    create: jest.Mock;
  };
};

describe('ChatService - Business Logic & Acceptance Criteria', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMessages', () => {
    it('harus mengembalikan riwayat pesan percakapan terurut secara kronologis', async () => {
      const mockMessages = [
        {
          id: 'msg-1',
          swapRequestId: 'sr-1',
          senderId: 'user-1',
          messageText: 'Halo, salam kenal!',
          createdAt: new Date('2026-10-01T10:00:00Z'),
          sender: { id: 'user-1', name: 'Alice' },
        },
        {
          id: 'msg-2',
          swapRequestId: 'sr-1',
          senderId: 'user-2',
          messageText: 'Halo Alice! Kapan kita bisa mulai sesi?',
          createdAt: new Date('2026-10-01T10:05:00Z'),
          sender: { id: 'user-2', name: 'Bob' },
        },
      ];
      mockPrisma.chatMessage.findMany.mockResolvedValue(mockMessages);

      const result = await ChatService.getMessages('sr-1');

      expect(result).toHaveLength(2);
      expect(result[0].messageText).toBe('Halo, salam kenal!');
      expect(mockPrisma.chatMessage.findMany).toHaveBeenCalledWith({
        where: { swapRequestId: 'sr-1' },
        include: { sender: { select: { id: true, name: true, email: true, bio: true, createdAt: true } } },
        orderBy: { createdAt: 'asc' },
      });
    });

    it('harus mengembalikan array kosong jika belum ada interaksi chat', async () => {
      mockPrisma.chatMessage.findMany.mockResolvedValue([]);

      const result = await ChatService.getMessages('sr-empty');

      expect(result).toEqual([]);
    });
  });

  describe('sendMessage', () => {
    it('harus menolak kirim pesan jika swap request tidak terdaftar', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValue(null);

      await expect(
        ChatService.sendMessage('sr-invalid', 'user-1', 'Halo')
      ).rejects.toThrow('Permintaan tukar tidak ditemukan');
    });

    it('harus menolak kirim pesan jika status permintaan masih PENDING (belum disetujui)', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValue({
        id: 'sr-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'PENDING',
      });

      await expect(
        ChatService.sendMessage('sr-1', 'user-1', 'Pesan sebelum disetujui')
      ).rejects.toThrow('Hanya bisa mengirim pesan pada pertukaran yang sudah disetujui');
    });

    it('harus menolak kirim pesan jika pengguna bukan pihak pengirim maupun penerima', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValue({
        id: 'sr-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'ACCEPTED',
      });

      await expect(
        ChatService.sendMessage('sr-1', 'user-intruder', 'Penyusup')
      ).rejects.toThrow('Anda tidak memiliki akses ke percakapan ini');
    });

    it('harus berhasil mengirim pesan saat status ACCEPTED dan pengirim valid', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValue({
        id: 'sr-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'ACCEPTED',
      });
      const mockCreatedMessage = {
        id: 'msg-new',
        swapRequestId: 'sr-1',
        senderId: 'user-1',
        messageText: 'Mari jadwalkan pertemuan pertama',
        createdAt: new Date(),
        sender: { id: 'user-1', name: 'Alice', email: 'alice@test.com', bio: '', createdAt: new Date() },
      };
      mockPrisma.chatMessage.create.mockResolvedValue(mockCreatedMessage);

      const result = await ChatService.sendMessage(
        'sr-1',
        'user-1',
        'Mari jadwalkan pertemuan pertama'
      );

      expect(result.id).toBe('msg-new');
      expect(result.messageText).toBe('Mari jadwalkan pertemuan pertama');
      expect(result.senderId).toBe('user-1');
      expect(mockPrisma.chatMessage.create).toHaveBeenCalledWith({
        data: {
          swapRequestId: 'sr-1',
          senderId: 'user-1',
          messageText: 'Mari jadwalkan pertemuan pertama',
        },
        include: expect.any(Object),
      });
    });
  });
});
