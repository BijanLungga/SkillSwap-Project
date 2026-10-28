import prisma from '../config/database';
import * as SkillService from '../services/SkillService';

jest.mock('../config/database', () => {
  return {
    __esModule: true,
    default: {
      userSkill: {
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    },
  };
});

const mockPrisma = prisma as unknown as {
  userSkill: {
    findMany: jest.Mock;
    create: jest.Mock;
    delete: jest.Mock;
  };
};

describe('SkillService - Business Logic & Acceptance Criteria', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserSkills', () => {
    it('harus mengembalikan seluruh daftar keahlian milik pengguna berurutan dari yang terbaru', async () => {
      const mockSkills = [
        { id: 's1', userId: 'u1', skillName: 'React TypeScript', skillType: 'HAVE', createdAt: new Date() },
        { id: 's2', userId: 'u1', skillName: 'Python AI', skillType: 'WANT', createdAt: new Date() },
      ];
      mockPrisma.userSkill.findMany.mockResolvedValue(mockSkills);

      const result = await SkillService.getUserSkills('u1');

      expect(result).toHaveLength(2);
      expect(result[0].skillName).toBe('React TypeScript');
      expect(mockPrisma.userSkill.findMany).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('harus mengembalikan array kosong jika user belum memiliki keahlian apapun', async () => {
      mockPrisma.userSkill.findMany.mockResolvedValue([]);

      const result = await SkillService.getUserSkills('u-empty');

      expect(result).toEqual([]);
    });
  });

  describe('addSkill', () => {
    it('harus berhasil menambahkan keahlian yang dimiliki (HAVE)', async () => {
      const newSkill = {
        id: 's10',
        userId: 'u1',
        skillName: 'Figma UI/UX',
        skillType: 'HAVE',
        createdAt: new Date(),
      };
      mockPrisma.userSkill.create.mockResolvedValue(newSkill);

      const result = await SkillService.addSkill('u1', 'Figma UI/UX', 'HAVE');

      expect(result.skillName).toBe('Figma UI/UX');
      expect(result.skillType).toBe('HAVE');
      expect(mockPrisma.userSkill.create).toHaveBeenCalledWith({
        data: { userId: 'u1', skillName: 'Figma UI/UX', skillType: 'HAVE' },
      });
    });

    it('harus berhasil menambahkan keahlian yang ingin dipelajari (WANT)', async () => {
      const newSkill = {
        id: 's11',
        userId: 'u1',
        skillName: 'Machine Learning',
        skillType: 'WANT',
        createdAt: new Date(),
      };
      mockPrisma.userSkill.create.mockResolvedValue(newSkill);

      const result = await SkillService.addSkill('u1', 'Machine Learning', 'WANT');

      expect(result.skillName).toBe('Machine Learning');
      expect(result.skillType).toBe('WANT');
    });
  });

  describe('deleteSkill', () => {
    it('harus berhasil menghapus keahlian berdasarkan id spesifik', async () => {
      const deletedSkill = {
        id: 's1',
        userId: 'u1',
        skillName: 'React TypeScript',
        skillType: 'HAVE',
        createdAt: new Date(),
      };
      mockPrisma.userSkill.delete.mockResolvedValue(deletedSkill);

      const result = await SkillService.deleteSkill('s1');

      expect(result.id).toBe('s1');
      expect(mockPrisma.userSkill.delete).toHaveBeenCalledWith({
        where: { id: 's1' },
      });
    });
  });
});
