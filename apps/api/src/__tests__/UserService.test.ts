import prisma from '../config/database';
import * as UserService from '../services/UserService';

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

describe('UserService - Business Logic & Acceptance Criteria', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('harus mengembalikan daftar seluruh pengguna', async () => {
      const mockUsers = [
        { id: 'u1', name: 'Alice', email: 'alice@example.com', bio: 'Designer', createdAt: new Date() },
        { id: 'u2', name: 'Bob', email: 'bob@example.com', bio: 'Developer', createdAt: new Date() },
      ];
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await UserService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserById', () => {
    it('harus mengembalikan data user spesifik beserta keahliannya', async () => {
      const mockUser = {
        id: 'u1',
        name: 'Alice',
        email: 'alice@example.com',
        bio: 'Designer',
        createdAt: new Date(),
        skills: [{ id: 's1', skillName: 'UI Design', skillType: 'HAVE' }],
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserService.getUserById('u1');

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'u1' },
        select: { id: true, name: true, email: true, bio: true, createdAt: true, skills: true },
      });
    });

    it('harus mengembalikan null jika user tidak ditemukan', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await UserService.getUserById('unknown-id');

      expect(result).toBeNull();
    });
  });

  describe('createUser (Registrasi)', () => {
    it('harus berhasil membuat user baru tanpa mengembalikan password plain text', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const createdRecord = {
        id: 'u1',
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
        bio: 'Hello world',
        createdAt: new Date(),
      };
      mockPrisma.user.create.mockResolvedValue(createdRecord);

      const result = await UserService.createUser({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
        bio: 'Hello world',
      });

      expect(result).not.toHaveProperty('password');
      expect(result.name).toBe('Alice');
      expect(result.email).toBe('alice@example.com');
    });

    it('harus menolak registrasi jika email sudah terdaftar sebelumnya', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'alice@example.com' });

      await expect(
        UserService.createUser({
          name: 'Alice Duplikat',
          email: 'alice@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Email sudah terdaftar');
    });
  });

  describe('loginUser (Autentikasi)', () => {
    it('harus berhasil login ketika email dan password sesuai', async () => {
      const mockUser = {
        id: 'u1',
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
        bio: 'Designer',
        createdAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserService.loginUser('alice@example.com', 'password123');

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('u1');
      expect(result.email).toBe('alice@example.com');
    });

    it('harus menolak login jika email tidak ditemukan di database', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(UserService.loginUser('notfound@example.com', 'password123')).rejects.toThrow(
        'Email atau password salah'
      );
    });

    it('harus menolak login jika password tidak cocok', async () => {
      const mockUser = {
        id: 'u1',
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password123',
        bio: 'Designer',
        createdAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(UserService.loginUser('alice@example.com', 'wrongpassword')).rejects.toThrow(
        'Email atau password salah'
      );
    });
  });

  describe('updateUser (Perbarui Profil)', () => {
    it('harus berhasil memperbarui nama dan bio pengguna', async () => {
      const updatedUser = {
        id: 'u1',
        name: 'Alice Baru',
        email: 'alice@example.com',
        bio: 'Senior Product Designer',
        createdAt: new Date(),
      };
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser('u1', {
        name: 'Alice Baru',
        bio: 'Senior Product Designer',
      });

      expect(result.name).toBe('Alice Baru');
      expect(result.bio).toBe('Senior Product Designer');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { name: 'Alice Baru', bio: 'Senior Product Designer' },
        select: { id: true, name: true, email: true, bio: true, createdAt: true },
      });
    });
  });
});

