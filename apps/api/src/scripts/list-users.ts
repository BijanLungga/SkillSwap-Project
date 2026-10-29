import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('\n================ DAFTAR AKUN PENGGUNA (SKILLSWAP) ================');
    if (users.length === 0) {
      console.log('Belum ada akun pengguna yang terdaftar di database.');
      console.log('Silakan daftar akun baru di halaman web http://localhost:5173\n');
    } else {
      console.log(`Ditemukan ${users.length} akun pengguna:\n`);
      const tableData = users.map((u, i) => ({
        No: i + 1,
        Nama: u.name,
        Email: u.email,
        Password: u.password,
        Terdaftar: new Date(u.createdAt).toLocaleString('id-ID'),
      }));
      console.table(tableData);
      console.log('==================================================================\n');
    }
  } catch (error: any) {
    console.error('\n[GAGAL MENGHUBUNGI DATABASE]');
    console.error('Pastikan Laragon sudah berjalan dan tombol "Start All" sudah diklik.');
    console.error('Error detail:', error.message, '\n');
  } finally {
    await prisma.$disconnect();
  }
}

main();

