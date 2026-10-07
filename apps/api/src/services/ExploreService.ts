import prisma from '../config/database';

export const exploreUsers = async (params: { search?: string; skillType?: string; userId?: string }) => {
  const { search, skillType, userId } = params;
  
  const whereClause: any = {};
  
  if (userId) {
    whereClause.id = { not: userId };
  }

  if (search || skillType) {
    whereClause.skills = {
      some: {
        ...(skillType ? { skillType: skillType as any } : {}),
        ...(search ? { skillName: { contains: search } } : {})
      }
    };
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      skills: true,
    }
  });

  return {
    users: users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      bio: u.bio,
      skillsHave: u.skills.filter(s => s.skillType === 'HAVE'),
      skillsWant: u.skills.filter(s => s.skillType === 'WANT'),
    })),
    total: users.length
  };
};
