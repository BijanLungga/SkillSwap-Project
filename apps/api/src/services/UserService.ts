import prisma from '../config/database';

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, bio: true, createdAt: true },
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, bio: true, createdAt: true,
      skills: true,
    },
  });
};

export const createUser = async (data: { name: string; email: string; password: string; bio?: string }) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email sudah terdaftar');

  const user = await prisma.user.create({ data });
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Email atau password salah');
  if (user.password !== password) throw new Error('Email atau password salah');

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUser = async (id: string, data: { name?: string; bio?: string }) => {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, bio: true, createdAt: true },
  });
  return user;
};
