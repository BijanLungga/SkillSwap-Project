import prisma from '../config/database';
import * as ReviewService from '../services/ReviewService';
import * as NotificationService from '../services/NotificationService';

jest.mock('../config/database', () => {
  return {
    __esModule: true,
    default: {
      swapRequest: {
        findUnique: jest.fn(),
      },
      review: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
    },
  };
});

jest.mock('../services/NotificationService', () => {
  return {
    createNotification: jest.fn(),
  };
});

const mockPrisma = prisma as unknown as {
  swapRequest: {
    findUnique: jest.Mock;
  };
  review: {
    findFirst: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
  };
};

describe('ReviewService - Business Logic & Acceptance Criteria', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('harus menolak jika rating di luar rentang 1 sampai 5', async () => {
      await expect(
        ReviewService.createReview({
          swapRequestId: 'sr-1',
          reviewerId: 'user-1',
          rating: 0,
        })
      ).rejects.toThrow('Rating harus berupa angka bulat antara 1 sampai 5');

      await expect(
        ReviewService.createReview({
          swapRequestId: 'sr-1',
          reviewerId: 'user-1',
          rating: 6,
        })
      ).rejects.toThrow('Rating harus berupa angka bulat antara 1 sampai 5');

      await expect(
        ReviewService.createReview({
          swapRequestId: 'sr-1',
          reviewerId: 'user-1',
          rating: 4.5,
        })
      ).rejects.toThrow('Rating harus berupa angka bulat antara 1 sampai 5');
    });

    it('harus menolak jika swap request tidak ditemukan', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValueOnce(null);

      await expect(
        ReviewService.createReview({
          swapRequestId: 'sr-non-existent',
          reviewerId: 'user-1',
          rating: 5,
        })
      ).rejects.toThrow('Permintaan pertukaran tidak ditemukan');
    });

    it('harus menolak jika status pertukaran belum COMPLETED', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValueOnce({
        id: 'sr-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'ACCEPTED',
        sender: { id: 'user-1', name: 'Alice' },
        receiver: { id: 'user-2', name: 'Bob' },
      });

      await expect(
        ReviewService.createReview({
          swapRequestId: 'sr-1',
          reviewerId: 'user-1',
          rating: 5,
        })
      ).rejects.toThrow('Ulasan hanya dapat diberikan untuk pertukaran yang sudah selesai');
    });

    it('harus menolak jika pengulas bukan pengirim maupun penerima', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValueOnce({
        id: 'sr-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'COMPLETED',
        sender: { id: 'user-1', name: 'Alice' },
        receiver: { id: 'user-2', name: 'Bob' },
      });

      await expect(
        ReviewService.createReview({
          swapRequestId: 'sr-1',
          reviewerId: 'user-stranger',
          rating: 5,
        })
      ).rejects.toThrow('Anda tidak memiliki izin memberikan ulasan pada pertukaran ini');
    });

    it('harus menolak jika sudah pernah memberikan ulasan untuk sesi ini', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValueOnce({
        id: 'sr-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'COMPLETED',
        sender: { id: 'user-1', name: 'Alice' },
        receiver: { id: 'user-2', name: 'Bob' },
      });
      mockPrisma.review.findFirst.mockResolvedValueOnce({
        id: 'rev-existing',
        swapRequestId: 'sr-1',
        reviewerId: 'user-1',
      });

      await expect(
        ReviewService.createReview({
          swapRequestId: 'sr-1',
          reviewerId: 'user-1',
          rating: 5,
        })
      ).rejects.toThrow('Anda sudah memberikan ulasan untuk pertukaran ini');
    });

    it('harus berhasil menyimpan ulasan dan mengirim notifikasi jika seluruh kriteria terpenuhi', async () => {
      mockPrisma.swapRequest.findUnique.mockResolvedValueOnce({
        id: 'sr-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        status: 'COMPLETED',
        sender: { id: 'user-1', name: 'Alice' },
        receiver: { id: 'user-2', name: 'Bob' },
      });
      mockPrisma.review.findFirst.mockResolvedValueOnce(null);

      const mockCreatedReview = {
        id: 'rev-new',
        swapRequestId: 'sr-1',
        reviewerId: 'user-1',
        targetUserId: 'user-2',
        rating: 5,
        comment: 'Sangat ramah dan materi jelas!',
        createdAt: new Date(),
        reviewer: { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
      };
      mockPrisma.review.create.mockResolvedValueOnce(mockCreatedReview);

      const result = await ReviewService.createReview({
        swapRequestId: 'sr-1',
        reviewerId: 'user-1',
        rating: 5,
        comment: 'Sangat ramah dan materi jelas!',
      });

      expect(result).toEqual(mockCreatedReview);
      expect(mockPrisma.review.create).toHaveBeenCalledWith({
        data: {
          swapRequestId: 'sr-1',
          reviewerId: 'user-1',
          targetUserId: 'user-2',
          rating: 5,
          comment: 'Sangat ramah dan materi jelas!',
        },
        include: {
          reviewer: {
            select: { id: true, name: true, email: true },
          },
        },
      });
      expect(NotificationService.createNotification).toHaveBeenCalled();
    });
  });

  describe('getUserReviews', () => {
    it('harus mengembalikan riwayat ulasan yang diterima pengguna', async () => {
      const mockReviews = [
        {
          id: 'rev-1',
          targetUserId: 'user-2',
          rating: 5,
          comment: 'Bagus',
          reviewer: { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
        },
      ];
      mockPrisma.review.findMany.mockResolvedValueOnce(mockReviews);

      const result = await ReviewService.getUserReviews('user-2');

      expect(result).toEqual(mockReviews);
      expect(mockPrisma.review.findMany).toHaveBeenCalledWith({
        where: { targetUserId: 'user-2' },
        include: {
          reviewer: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getUserReputation', () => {
    it('harus menghitung reputasi rata-rata rating dan total ulasan', async () => {
      mockPrisma.review.findMany.mockResolvedValueOnce([
        { rating: 5 },
        { rating: 4 },
      ]);

      const result = await ReviewService.getUserReputation('user-2');

      expect(result).toEqual({
        averageRating: 4.5,
        totalReviews: 2,
      });
    });

    it('harus mengembalikan rating 0 jika pengguna belum memiliki ulasan', async () => {
      mockPrisma.review.findMany.mockResolvedValueOnce([]);

      const result = await ReviewService.getUserReputation('user-new');

      expect(result).toEqual({
        averageRating: 0,
        totalReviews: 0,
      });
    });
  });
});
