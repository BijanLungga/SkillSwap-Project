import prisma from '../config/database';
import * as DashboardService from '../services/DashboardService';

jest.mock('../config/database', () => {
  return {
    __esModule: true,
    default: {
      user: {
        findUnique: jest.fn(),
      },
      swapRequest: {
        findMany: jest.fn(),
      },
    },
  };
});

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
  };
  swapRequest: {
    findMany: jest.Mock;
  };
};

describe('DashboardService - Business Logic & Acceptance Criteria', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboard', () => {
    it('harus menolak request jika user yang diminta tidak ada dalam database', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(DashboardService.getDashboard('non-existent-user')).rejects.toThrow(
        'User tidak ditemukan'
      );
    });

    it('harus menghitung metrik statistik keahlian dan status pertukaran secara akurat', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'Alice',
        email: 'alice@test.com',
        bio: 'Tech enthusiast',
        createdAt: new Date(),
        skills: [
          { id: 's1', skillName: 'React', skillType: 'HAVE' },
          { id: 's2', skillName: 'TypeScript', skillType: 'HAVE' },
          { id: 's3', skillName: 'Graphic Design', skillType: 'HAVE' },
          { id: 's4', skillName: 'Python Backend', skillType: 'WANT' },
          { id: 's5', skillName: 'Machine Learning', skillType: 'WANT' },
        ],
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const mockSwaps = [
        {
          id: 'sr-1',
          senderId: 'user-1',
          receiverId: 'user-2',
          status: 'ACCEPTED',
          createdAt: new Date(),
          sender: { id: 'user-1', name: 'Alice', email: 'alice@test.com', bio: '', skills: [] },
          receiver: {
            id: 'user-2',
            name: 'Bob',
            email: 'bob@test.com',
            bio: 'Python Dev',
            skills: [{ skillName: 'Python Backend', skillType: 'HAVE' }],
          },
        },
        {
          id: 'sr-2',
          senderId: 'user-3',
          receiverId: 'user-1',
          status: 'PENDING',
          createdAt: new Date(),
          sender: { id: 'user-3', name: 'Charlie', email: 'charlie@test.com', bio: '', skills: [] },
          receiver: { id: 'user-1', name: 'Alice', email: 'alice@test.com', bio: '', skills: [] },
        },
        {
          id: 'sr-3',
          senderId: 'user-1',
          receiverId: 'user-4',
          status: 'COMPLETED',
          createdAt: new Date(),
          sender: { id: 'user-1', name: 'Alice', email: 'alice@test.com', bio: '', skills: [] },
          receiver: { id: 'user-4', name: 'Dave', email: 'dave@test.com', bio: '', skills: [] },
        },
      ];
      mockPrisma.swapRequest.findMany.mockResolvedValue(mockSwaps);

      const result = await DashboardService.getDashboard('user-1');

      expect(result.stats.totalSkillsHave).toBe(3);
      expect(result.stats.totalSkillsWant).toBe(2);
      expect(result.stats.totalActiveSwaps).toBe(1);
      expect(result.stats.totalPendingRequests).toBe(1);
      expect(result.stats.totalCompletedSwaps).toBe(1);

      expect(result.partners).toHaveLength(1);
      expect(result.partners[0].userId).toBe('user-2');
      expect(result.partners[0].name).toBe('Bob');
      expect(result.partners[0].skills).toEqual([{ skillName: 'Python Backend', skillType: 'HAVE' }]);
    });

    it('harus mengembalikan angka nol dan daftar partner kosong untuk pengguna yang baru mendaftar', async () => {
      const mockNewUser = {
        id: 'newbie-1',
        name: 'Newbie',
        email: 'newbie@test.com',
        bio: '',
        createdAt: new Date(),
        skills: [],
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockNewUser);
      mockPrisma.swapRequest.findMany.mockResolvedValue([]);

      const result = await DashboardService.getDashboard('newbie-1');

      expect(result.stats.totalSkillsHave).toBe(0);
      expect(result.stats.totalSkillsWant).toBe(0);
      expect(result.stats.totalActiveSwaps).toBe(0);
      expect(result.stats.totalPendingRequests).toBe(0);
      expect(result.stats.totalCompletedSwaps).toBe(0);
      expect(result.partners).toEqual([]);
    });
  });
});
