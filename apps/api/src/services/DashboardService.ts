import prisma from '../config/database';

export const getDashboard = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { skills: true }
  });

  if (!user) throw new Error('User tidak ditemukan');

  const totalSkillsHave = user.skills.filter(s => s.skillType === 'HAVE').length;
  const totalSkillsWant = user.skills.filter(s => s.skillType === 'WANT').length;

  const swaps = await prisma.swapRequest.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }]
    },
    include: {
      sender: { select: { id: true, name: true, email: true, bio: true, skills: true } },
      receiver: { select: { id: true, name: true, email: true, bio: true, skills: true } }
    }
  });

  const totalActiveSwaps = swaps.filter(s => s.status === 'ACCEPTED').length;
  const totalPendingRequests = swaps.filter(s => s.status === 'PENDING').length;
  const totalCompletedSwaps = swaps.filter(s => s.status === 'COMPLETED').length;

  const partners = swaps
    .filter(s => s.status === 'ACCEPTED')
    .map(s => {
      const partner = s.senderId === userId ? s.receiver : s.sender;
      return {
        userId: partner.id,
        name: partner.name,
        email: partner.email,
        bio: partner.bio,
        swapRequestId: s.id,
        status: s.status,
        skills: partner.skills.map(sk => ({ skillName: sk.skillName, skillType: sk.skillType }))
      };
    });

  return {
    stats: {
      totalSkillsHave,
      totalSkillsWant,
      totalActiveSwaps,
      totalPendingRequests,
      totalCompletedSwaps
    },
    partners
  };
};
