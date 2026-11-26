import * as UserService from '../services/UserService';
import prisma from '../config/database';

jest.mock('../config/database', () => {
  return {
    __esModule: true,
    default: {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    },
  };
});

const mockPrisma = prisma as unknown as {
  user: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

describe('Extended User Validation & Security Boundary Tests (UT-200 Suite)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testAccounts = [
    { name: 'Dev Account 1', email: 'dev1@example.com', pass: 'secret01', bio: 'Bio 1' },
    { name: 'Dev Account 2', email: 'dev2@example.com', pass: 'secret02', bio: 'Bio 2' },
    { name: 'Dev Account 3', email: 'dev3@example.com', pass: 'secret03', bio: 'Bio 3' },
    { name: 'Dev Account 4', email: 'dev4@example.com', pass: 'secret04', bio: 'Bio 4' },
    { name: 'Dev Account 5', email: 'dev5@example.com', pass: 'secret05', bio: 'Bio 5' },
    { name: 'Dev Account 6', email: 'dev6@example.com', pass: 'secret06', bio: 'Bio 6' },
    { name: 'Dev Account 7', email: 'dev7@example.com', pass: 'secret07', bio: 'Bio 7' },
    { name: 'Dev Account 8', email: 'dev8@example.com', pass: 'secret08', bio: 'Bio 8' },
    { name: 'Dev Account 9', email: 'dev9@example.com', pass: 'secret09', bio: 'Bio 9' },
    { name: 'Dev Account 10', email: 'dev10@example.com', pass: 'secret10', bio: 'Bio 10' },
    { name: 'Dev Account 11', email: 'dev11@example.com', pass: 'secret11', bio: 'Bio 11' },
    { name: 'Dev Account 12', email: 'dev12@example.com', pass: 'secret12', bio: 'Bio 12' },
    { name: 'Dev Account 13', email: 'dev13@example.com', pass: 'secret13', bio: 'Bio 13' },
    { name: 'Dev Account 14', email: 'dev14@example.com', pass: 'secret14', bio: 'Bio 14' },
    { name: 'Dev Account 15', email: 'dev15@example.com', pass: 'secret15', bio: 'Bio 15' },
    { name: 'Dev Account 16', email: 'dev16@example.com', pass: 'secret16', bio: 'Bio 16' },
    { name: 'Dev Account 17', email: 'dev17@example.com', pass: 'secret17', bio: 'Bio 17' },
    { name: 'Dev Account 18', email: 'dev18@example.com', pass: 'secret18', bio: 'Bio 18' },
    { name: 'Dev Account 19', email: 'dev19@example.com', pass: 'secret19', bio: 'Bio 19' },
    { name: 'Dev Account 20', email: 'dev20@example.com', pass: 'secret20', bio: 'Bio 20' },
    { name: 'Dev Account 21', email: 'dev21@example.com', pass: 'secret21', bio: 'Bio 21' },
    { name: 'Dev Account 22', email: 'dev22@example.com', pass: 'secret22', bio: 'Bio 22' },
    { name: 'Dev Account 23', email: 'dev23@example.com', pass: 'secret23', bio: 'Bio 23' },
    { name: 'Dev Account 24', email: 'dev24@example.com', pass: 'secret24', bio: 'Bio 24' },
    { name: 'Dev Account 25', email: 'dev25@example.com', pass: 'secret25', bio: 'Bio 25' },
  ];

  testAccounts.forEach((acc, index) => {
    describe(`User Account #${index + 1}: ${acc.email}`, () => {
      it(`harus berhasil mendaftarkan akun ${acc.email} dengan perlindungan password`, async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);
        mockPrisma.user.create.mockResolvedValue({
          id: `usr-${index + 1}`,
          name: acc.name,
          email: acc.email,
          bio: acc.bio,
          createdAt: new Date(),
        });

        const result = await UserService.createUser({
          name: acc.name,
          email: acc.email,
          password: acc.pass,
          bio: acc.bio,
        });

        expect(result.email).toBe(acc.email);
        expect((result as any).password).toBeUndefined();
      });

      it(`harus berhasil autentikasi login untuk ${acc.email}`, async () => {
        mockPrisma.user.findUnique.mockResolvedValue({
          id: `usr-${index + 1}`,
          name: acc.name,
          email: acc.email,
          password: acc.pass,
          bio: acc.bio,
          createdAt: new Date(),
        });

        const result = await UserService.loginUser(acc.email, acc.pass);

        expect(result.id).toBe(`usr-${index + 1}`);
        expect((result as any).password).toBeUndefined();
      });
    });
  });
});
