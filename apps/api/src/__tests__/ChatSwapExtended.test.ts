import * as ChatService from '../services/ChatService';
import * as SwapRequestService from '../services/SwapRequestService';
import prisma from '../config/database';

jest.mock('../config/database', () => {
  return {
    __esModule: true,
    default: {
      chatMessage: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      swapRequest: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      notification: {
        create: jest.fn(),
      },
    },
  };
});

const mockPrisma = prisma as unknown as {
  chatMessage: {
    findMany: jest.Mock;
    create: jest.Mock;
  };
  swapRequest: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  notification: {
    create: jest.Mock;
  };
};

describe('Extended Chat and Swap Coordination Tests (UT-200 Suite)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const chatScenarios = [
    'Halo, kapan kita bisa mulai belajar bareng?',
    'Saya siap jam 7 malam ini ya.',
    'Bisa lewat Google Meet atau Discord?',
    'Materi React-nya sudah saya siapkan.',
    'Oke, saya akan jelaskan bagian TypeScript-nya dulu.',
    'Link repository sudah saya kirim ya.',
    'Terima kasih banyak atas penjelasannya!',
    'Ada pertanyaan lagi sebelum kita lanjut?',
    'Besok kita lanjut sesi praktek ya.',
    'Pertukaran keahlian ini sangat seru.',
    'Saya coba jalankan kodenya dulu sebentar.',
    'Semua tes unit-nya berhasil berjalan lancar!',
    'Bagian mana yang perlu di-review lagi?',
    'Sudah selesai untuk modul hari ini.',
    'Sampai jumpa di sesi berikutnya!',
    'Catatan belajar sudah saya rangkum di dokumen.',
    'Bisa tolong cek branch terbaru di repo?',
    'Kodingan sudah saya push ke remote.',
    'Mantap, saya merge ke branch dev sekarang.',
    'Semua fitur sudah terverifikasi dengan baik.',
    'Siap untuk rilis versi berikutnya.',
    'Tolong beri rating dan ulasan di akhir sesi ya.',
    'Sudah saya selesaikan status pertukarannya.',
    'Rating 5 bintang sudah saya kirimkan.',
    'Terima kasih atas kolaborasinya!'
  ];

  chatScenarios.forEach((msgText, idx) => {
    describe(`Chat & Swap Coordination Case #${idx + 1}`, () => {
      it(`harus memvalidasi dan mengirim pesan obrolan: "${msgText}"`, async () => {
        const swapId = `swap-c-${idx + 1}`;
        const senderId = `user-s-${idx + 1}`;
        const receiverId = `user-r-${idx + 1}`;

        mockPrisma.swapRequest.findUnique.mockResolvedValue({
          id: swapId,
          senderId,
          receiverId,
          status: 'ACCEPTED',
          sender: { name: 'Alice' },
          receiver: { name: 'Bob' },
        });

        const mockCreatedMsg = {
          id: `msg-${idx + 1}`,
          swapRequestId: swapId,
          senderId,
          messageText: msgText,
          createdAt: new Date(),
          sender: { id: senderId, name: 'Alice', email: 'alice@test.com' },
        };
        mockPrisma.chatMessage.create.mockResolvedValue(mockCreatedMsg);
        mockPrisma.notification.create.mockResolvedValue({ id: 'notif-c-1' });

        const result = await ChatService.sendMessage(swapId, senderId, msgText);

        expect(result.messageText).toBe(msgText);
        expect(result.swapRequestId).toBe(swapId);
      });

      it(`harus berhasil mengambil riwayat swap request status ACCEPTED #${idx + 1}`, async () => {
        const userId = `user-s-${idx + 1}`;
        const mockSwaps = [
          {
            id: `swap-c-${idx + 1}`,
            senderId: userId,
            receiverId: `user-r-${idx + 1}`,
            status: 'ACCEPTED',
            createdAt: new Date(),
            sender: { id: userId, name: 'Alice', email: 'alice@test.com' },
            receiver: { id: `user-r-${idx + 1}`, name: 'Bob', email: 'bob@test.com' },
          },
        ];
        mockPrisma.swapRequest.findMany.mockResolvedValue(mockSwaps);

        const result = await SwapRequestService.getSwapRequests(userId);

        expect(result.length).toBe(1);
        expect(result[0].status).toBe('ACCEPTED');
      });
    });
  });
});
