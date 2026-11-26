import * as ReviewService from '../services/ReviewService';
import * as NotificationService from '../services/NotificationService';
import prisma from '../config/database';

jest.mock('../config/database', () => {
  return {
    __esModule: true,
    default: {
      review: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        aggregate: jest.fn(),
      },
      swapRequest: {
        findUnique: jest.fn(),
      },
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    },
  };
});

const mockPrisma = prisma as unknown as {
  review: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    findMany: jest.Mock;
    aggregate: jest.Mock;
  };
  swapRequest: {
    findUnique: jest.Mock;
  };
  notification: {
    create: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
  };
};

describe('Extended Review and Notification System Tests (UT-200 Suite)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const ratingScenarios = [
    { rating: 1, comment: 'Cukup membantu tapi perlu perbaikan' },
    { rating: 2, comment: 'Kurang sesuai ekspektasi' },
    { rating: 3, comment: 'Standar dan ramah' },
    { rating: 4, comment: 'Sangat bagus dan terstruktur' },
    { rating: 5, comment: 'Luar biasa profesional' },
    { rating: 5, comment: 'Partner belajar terbaik!' },
    { rating: 4, comment: 'Materi disampaikan dengan jelas' },
    { rating: 3, comment: 'Sesi latihan berjalan lancar' },
    { rating: 5, comment: 'Sangat sabar membimbing' },
    { rating: 4, comment: 'Recomended peer learner!' },
    { rating: 5, comment: 'Pertukaran skill sukses total' },
    { rating: 2, comment: 'Jadwal sering bentrok' },
    { rating: 4, comment: 'Penjelasan mudah dipahami' },
    { rating: 5, comment: 'Bintang lima untuk kolaborasi ini' },
    { rating: 3, comment: 'Cukup oke untuk pemula' },
    { rating: 4, comment: 'Mendapat wawasan baru' },
    { rating: 5, comment: 'Akan bertukar skill lagi nanti' },
    { rating: 5, comment: 'Top markotop mantap' },
    { rating: 4, comment: 'Komunikasi lancar dan responsif' },
    { rating: 5, comment: 'Kerjasama yang sangat memuaskan' },
    { rating: 3, comment: 'Perlu latihan lebih banyak' },
    { rating: 4, comment: 'Pengalaman barter yang menyenangkan' },
    { rating: 5, comment: 'Skill yang diajarkan sangat aplikatif' },
    { rating: 4, comment: 'Terima kasih banyak atas ilmunya' },
    { rating: 5, comment: 'Review sempurna untuk sesi ini' },
  ];

  ratingScenarios.forEach((item, index) => {
    describe(`Review Scenario #${index + 1} (Rating ${item.rating})`, () => {
      it(`harus memvalidasi dan menyimpan ulasan rating ${item.rating}`, async () => {
        const swapId = `swap-${index + 1}`;
        const reviewerId = `user-rev-${index + 1}`;
        const receiverId = `user-target-${index + 1}`;

        mockPrisma.swapRequest.findUnique.mockResolvedValue({
          id: swapId,
          senderId: reviewerId,
          receiverId: receiverId,
          status: 'COMPLETED',
          sender: { name: 'Alice Test' },
          receiver: { name: 'Bob Test' },
        });
        mockPrisma.review.findUnique.mockResolvedValue(null);
        mockPrisma.review.findFirst.mockResolvedValue(null);
        mockPrisma.review.create.mockResolvedValue({
          id: `rev-${index + 1}`,
          swapRequestId: swapId,
          reviewerId,
          targetUserId: receiverId,
          rating: item.rating,
          comment: item.comment,
          createdAt: new Date(),
        });
        mockPrisma.notification.create.mockResolvedValue({ id: 'notif-1' });

        const result = await ReviewService.createReview({
          swapRequestId: swapId,
          reviewerId,
          rating: item.rating,
          comment: item.comment,
        });

        expect(result.rating).toBe(item.rating);
        expect(result.comment).toBe(item.comment);
      });

      it(`harus berhasil membuat notifikasi terhubung untuk skenario #${index + 1}`, async () => {
        const notifMock = {
          id: `notif-${index + 1}`,
          userId: `user-target-${index + 1}`,
          type: 'SYSTEM',
          title: 'Notifikasi Otomatis',
          message: item.comment,
          link: '/notifications',
          isRead: false,
          createdAt: new Date(),
        };
        mockPrisma.notification.create.mockResolvedValue(notifMock);

        const result = await NotificationService.createNotification({
          userId: `user-target-${index + 1}`,
          type: 'SYSTEM',
          title: 'Notifikasi Otomatis',
          message: item.comment,
          link: '/notifications',
        });

        expect(result.title).toBe('Notifikasi Otomatis');
        expect(result.isRead).toBe(false);
      });
    });
  });
});
