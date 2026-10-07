import prisma from '../config/database';

export const getUserSkills = async (userId: string) => {
  return prisma.userSkill.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
};

export const addSkill = async (userId: string, skillName: string, skillType: 'HAVE' | 'WANT') => {
  return prisma.userSkill.create({ data: { userId, skillName, skillType } });
};

export const deleteSkill = async (id: string) => {
  return prisma.userSkill.delete({ where: { id } });
};
