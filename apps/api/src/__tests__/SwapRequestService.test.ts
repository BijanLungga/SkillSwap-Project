import prisma from '../config/database';
import * as SwapRequestService from '../services/SwapRequestService';

jest.mock('../config/database', () => {
  return {
    __esModule: true,
    default: {
      swapRequest: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    },
  };
});

const mockPrisma = prisma as unknown as {
  swapRequest: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

describe('SwapRequestService - Business Logic & Acceptance Criteria', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSwapRequest', () => {
    it('harus menolak pembuatan permintaan jika pengirim dan penerima adalah user yang sama', async () => {
      await expect(
        SwapRequestService.createSwapRequest('user-1', 'user-1', 'Bisa barter skill?')
      ).rejects.toThrow('Tidak dapat mengirim permintaan ke diri sendiri');
    });

    it('harus menolak jika masih ada permintaan status PENDING antara kedua pihak', async () => {
      mockPrisma.swapRequest.findFirst.mockResolvedValueOnce({
        id: 'sr-pending-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'PENDING',
      });

      await expect(
        SwapRequestService.createSwapRequest('user-1', 'user-2', 'Halo ingin tukar skill')
      ).rejects.toThrow('Sudah ada permintaan tukar yang masih menunggu antara kedua pengguna');
    });

    it('harus menolak jika sudah ada sesi pertukaran aktif (ACCEPTED) antara kedua pengguna', async () => {
      // First findFirst (PENDING check) returns null, second findFirst (ACCEPTED check) returns an active swap
      mockPrisma.swapRequest.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'sr-active-1',
          senderId: 'user-2',
          receiverId: 'user-1',
          status: 'ACCEPTED',
        });

      await expect(
        SwapRequestService.createSwapRequest('user-1', 'user-2', 'Mau barter lagi')
      ).rejects.toThrow('Sudah ada sesi pertukaran aktif antara kedua pengguna');
    });

    it('harus berhasil membuat Swap Request jika validasi lolos', async () => {
      mockPrisma.swapRequest.findFirst.mockResolvedValue(null);
      const mockCreatedSwap = {
        id: 'sr-new-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'PENDING',
        message: 'Ayo belajar React & Python bareng!',
        createdAt: new Date(),
        sender: { id: 'user-1', name: 'Alice', email: 'alice@test.com', bio: '', createdAt: new Date(), skills: [] },
        receiver: { id: 'user-2', name: 'Bob', email: 'bob@test.com', bio: '', createdAt: new Date(), skills: [] },
      };
      mockPrisma.swapRequest.create.mockResolvedValue(mockCreatedSwap);

      const result = await SwapRequestService.createSwapRequest(
        'user-1',
        'user-2',
        'Ayo belajar React & Python bareng!'
      );

      expect(result.id).toBe('sr-new-1');
      expect(result.status).toBe('PENDING');
      expect(result.senderId).toBe('user-1');
      expect(result.receiverId).toBe('user-2');
    });
  });

  describe('updateSwapRequestStatus', () => {
    it('harus menolak perubahan jika swap request tidak ditemukan', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValue(null);

      await expect(
        SwapRequestService.updateSwapRequestStatus('not-found-id', 'ACCEPTED')
      ).rejects.toThrow('Permintaan tukar tidak ditemukan');
    });

    it('harus menolak perubahan jika status permintaan sudah REJECTED', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValue({
        id: 'sr-1',
        status: 'REJECTED',
      });

      await expect(
        SwapRequestService.updateSwapRequestStatus('sr-1', 'ACCEPTED')
      ).rejects.toThrow('Permintaan tukar sudah tidak dapat diubah');
    });

    it('harus menolak perubahan jika status permintaan sudah COMPLETED', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValue({
        id: 'sr-1',
        status: 'COMPLETED',
      });

      await expect(
        SwapRequestService.updateSwapRequestStatus('sr-1', 'ACCEPTED')
      ).rejects.toThrow('Permintaan tukar sudah tidak dapat diubah');
    });

    it('harus berhasil menerima permintaan (status ACCEPTED)', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValue({
        id: 'sr-1',
        status: 'PENDING',
      });
      const updatedSwap = {
        id: 'sr-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'ACCEPTED',
        createdAt: new Date(),
        sender: { id: 'user-1', name: 'Alice' },
        receiver: { id: 'user-2', name: 'Bob' },
      };
      mockPrisma.swapRequest.update.mockResolvedValue(updatedSwap);

      const result = await SwapRequestService.updateSwapRequestStatus('sr-1', 'ACCEPTED');

      expect(result.status).toBe('ACCEPTED');
      expect(mockPrisma.swapRequest.update).toHaveBeenCalledWith({
        where: { id: 'sr-1' },
        data: { status: 'ACCEPTED' },
        include: expect.any(Object),
      });
    });

    it('harus berhasil menolak permintaan (status REJECTED)', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValue({
        id: 'sr-1',
        status: 'PENDING',
      });
      const updatedSwap = {
        id: 'sr-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'REJECTED',
        createdAt: new Date(),
      };
      mockPrisma.swapRequest.update.mockResolvedValue(updatedSwap);

      const result = await SwapRequestService.updateSwapRequestStatus('sr-1', 'REJECTED');

      expect(result.status).toBe('REJECTED');
    });
  });

  describe('getSwapRequests', () => {
    it('harus mengambil seluruh permintaan di mana pengguna berperan sebagai pengirim atau penerima', async () => {
      const mockRequests = [
        { id: 'sr-1', senderId: 'user-1', receiverId: 'user-2', status: 'PENDING' },
        { id: 'sr-2', senderId: 'user-3', receiverId: 'user-1', status: 'ACCEPTED' },
      ];
      mockPrisma.swapRequest.findMany.mockResolvedValue(mockRequests);

      const result = await SwapRequestService.getSwapRequests('user-1');

      expect(result).toHaveLength(2);
      expect(mockPrisma.swapRequest.findMany).toHaveBeenCalledWith({
        where: { OR: [{ senderId: 'user-1' }, { receiverId: 'user-1' }] },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});

