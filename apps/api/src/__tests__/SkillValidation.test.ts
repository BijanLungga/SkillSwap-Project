import * as SkillService from '../services/SkillService';
import prisma from '../config/database';

jest.mock('../config/database', () => {
  return {
    __esModule: true,
    default: {
      userSkill: {
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    },
  };
});

const mockPrisma = prisma as unknown as {
  userSkill: {
    findMany: jest.Mock;
    create: jest.Mock;
    delete: jest.Mock;
    findUnique: jest.Mock;
  };
  user: {
    findUnique: jest.Mock;
  };
};

describe('Extended Skill Validation and Boundary Tests (UT-200 Suite)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const skillsList = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Golang',
    'Rust', 'C++', 'PHP', 'Ruby', 'Swift',
    'Kotlin', 'Dart', 'HTML', 'CSS', 'React',
    'Vue', 'Angular', 'Svelte', 'Node.js', 'Express',
    'Django', 'Flask', 'Spring Boot', 'Laravel', 'Docker'
  ];

  skillsList.forEach((skill, index) => {
    describe(`Skill validation case #${index + 1}: ${skill}`, () => {
      it(`harus berhasil menambahkan keahlian HAVE untuk "${skill}"`, async () => {
        const mockCreated = {
          id: `skill-${index + 1}`,
          userId: 'u-test',
          skillName: skill,
          skillType: 'HAVE',
          createdAt: new Date(),
        };
        mockPrisma.userSkill.create.mockResolvedValue(mockCreated);

        const result = await SkillService.addSkill('u-test', skill, 'HAVE');

        expect(result).toEqual(mockCreated);
        expect(mockPrisma.userSkill.create).toHaveBeenCalledWith({
          data: {
            userId: 'u-test',
            skillName: skill,
            skillType: 'HAVE',
          },
        });
      });

      it(`harus berhasil menambahkan keahlian WANT untuk "${skill}"`, async () => {
        const mockCreated = {
          id: `skill-want-${index + 1}`,
          userId: 'u-test',
          skillName: skill,
          skillType: 'WANT',
          createdAt: new Date(),
        };
        mockPrisma.userSkill.create.mockResolvedValue(mockCreated);

        const result = await SkillService.addSkill('u-test', skill, 'WANT');

        expect(result).toEqual(mockCreated);
      });
    });
  });
});
