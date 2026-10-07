import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.chatMessage.deleteMany();
  await prisma.swapRequest.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Wijaya',
      email: 'alice@example.com',
      password: '123456',
      bio: 'Seorang desainer grafis yang ingin belajar pemrograman web.',
      skills: {
        create: [
          { skillName: 'Desain Grafis', skillType: 'HAVE' },
          { skillName: 'UI/UX Design', skillType: 'HAVE' },
          { skillName: 'Adobe Illustrator', skillType: 'HAVE' },
          { skillName: 'JavaScript', skillType: 'WANT' },
          { skillName: 'React', skillType: 'WANT' },
        ],
      },
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Santoso',
      email: 'bob@example.com',
      password: '123456',
      bio: 'Full-stack developer yang ingin belajar desain dan musik.',
      skills: {
        create: [
          { skillName: 'JavaScript', skillType: 'HAVE' },
          { skillName: 'React', skillType: 'HAVE' },
          { skillName: 'Node.js', skillType: 'HAVE' },
          { skillName: 'Desain Grafis', skillType: 'WANT' },
          { skillName: 'Gitar', skillType: 'WANT' },
        ],
      },
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie Pratama',
      email: 'charlie@example.com',
      password: '123456',
      bio: 'Musisi dan pengajar bahasa Inggris.',
      skills: {
        create: [
          { skillName: 'Gitar', skillType: 'HAVE' },
          { skillName: 'Piano', skillType: 'HAVE' },
          { skillName: 'Bahasa Inggris', skillType: 'HAVE' },
          { skillName: 'Python', skillType: 'WANT' },
          { skillName: 'UI/UX Design', skillType: 'WANT' },
        ],
      },
    },
  });

  const swapAccepted = await prisma.swapRequest.create({
    data: {
      senderId: alice.id,
      receiverId: bob.id,
      status: 'ACCEPTED',
      message: 'Hai Bob! Saya ingin belajar JavaScript, dan saya bisa mengajari desain grafis. Tertarik?',
    },
  });

  await prisma.swapRequest.create({
    data: {
      senderId: charlie.id,
      receiverId: alice.id,
      status: 'PENDING',
      message: 'Halo Alice, saya ingin belajar UI/UX Design. Saya bisa mengajari bahasa Inggris.',
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        swapRequestId: swapAccepted.id,
        senderId: alice.id,
        messageText: 'Hai Bob! Kapan kita bisa mulai sesi pertukaran?',
      },
      {
        swapRequestId: swapAccepted.id,
        senderId: bob.id,
        messageText: 'Hai Alice! Bagaimana kalau hari Sabtu jam 10 pagi?',
      },
      {
        swapRequestId: swapAccepted.id,
        senderId: alice.id,
        messageText: 'Oke, setuju! Saya siapkan materi desain grafis dasarnya.',
      },
    ],
  });

  console.log('Seed data berhasil ditambahkan!');
  console.log(`Users: ${alice.name}, ${bob.name}, ${charlie.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
