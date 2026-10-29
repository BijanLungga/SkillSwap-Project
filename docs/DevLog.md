# Dev Log — SkillSwap

> Aturan penulisan entri: lihat `docs/Logging.md`. Entri terbaru selalu ditambahkan di **paling atas**, tepat di bawah baris ini.

---

## [2026-10-29 08:50 WIB] — Implementasi Fitur 8 (Notifikasi Push Real-time) & Fitur 10 (Sistem Ulasan & Reputasi Partner)

- **Agent:** Gemini 3.8 Flash
- **Tipe:** Pembangunan Fitur Baru & Penambahan Test Suite
- **Status:** Selesai
- **Modul:** Fullstack (Backend WebSocket/REST API + Frontend React/Tailwind + Prisma ORM)
- **File terdampak:**
  - `apps/api/prisma/schema.prisma` (model Notification & Review, relasi pada User & SwapRequest)
  - `packages/shared/src/types/index.ts` (tipe Notification, NotificationType, Review, UserReputation)
  - `apps/api/src/services/WebSocketService.ts` (baru: WebSocket connection manager ws://localhost:5000/ws)
  - `apps/api/src/services/NotificationService.ts` (baru: business logic notifikasi, badge count, auto-push)
  - `apps/api/src/services/ReviewService.ts` (baru: validasi 1-5 bintang, swap COMPLETED only, anti-duplikasi, reputasi agregat)
  - `apps/api/src/services/SwapRequestService.ts` (integrasi trigger notifikasi saat dibuat & status berubah)
  - `apps/api/src/services/ChatService.ts` (integrasi trigger notifikasi pesan baru)
  - `apps/api/src/controllers/NotificationController.ts` & `ReviewController.ts` (REST controllers)
  - `apps/api/src/routes/NotificationRoutes.ts` & `ReviewRoutes.ts` (Express routing)
  - `apps/api/src/server.ts` (attach HTTP Server + WebSocket Server)
  - `apps/api/src/__tests__/NotificationService.test.ts` (baru: 10 unit tests)
  - `apps/api/src/__tests__/ReviewService.test.ts` (baru: 9 unit tests)
  - `apps/web/src/context/NotificationContext.tsx` (baru: WebSocket client & desktop browser push notification)
  - `apps/web/src/components/NotificationDropdown.tsx` (baru: lonceng notifikasi, unread counter badge, mark all read)
  - `apps/web/src/components/NotificationToast.tsx` (baru: floating toast alert instan)
  - `apps/web/src/components/ReviewModal.tsx` (baru: modal rating bintang 1-5 interaktif & komentar ulasan)
  - `apps/web/src/components/ReputationBadge.tsx` (baru: widget rating reputasi bintang)
  - `apps/web/src/pages/SwapRequests.tsx` (tombol ulasan pada status COMPLETED)
  - `apps/web/src/pages/Profile.tsx` (bagian reputasi & testimoni partner)
  - `apps/web/src/pages/Explore.tsx` (tampilan reputasi pada kartu partner)
  - `README.md` (pembaruan status fitur 8 & 10 menjadi [Ada], unit test 52/52 passed)
- **Deskripsi:**
  Mengimplementasikan Fitur 8 (Notifikasi Push Real-time via WebSocket terintegrasi ke browser dan antarmuka dengan lonceng notifikasi dan toast alert) serta Fitur 10 (Sistem Ulasan & Reputasi Partner dengan rating bintang 1-5, validasi aturan bisnis pertukaran COMPLETED, pencegahan self-review & duplikasi, serta agregasi rating rata-rata). Menambahkan 2 test suites baru sehingga seluruh pengujian mencapai 52 unit tests ALL PASSED.
- **Error/Kendala:** Tidak ada.

---

## [2026-10-28 14:15 WIB] — Optimalisasi tsconfig.json dan Fix Extension Import Web

- **Agent:** Gemini 3.8 Flash
- **Tipe:** Refactor & Fix Bug
- **Status:** Selesai
- **Modul:** TypeScript Configuration & Build Pipeline
- **File terdampak:**
  - `apps/api/tsconfig.json` (upgrade target ke ES2022, strict mode true, types node & jest)
  - `apps/web/src/main.tsx` (fix import App tanpa ekstensi .tsx)
  - `.gitignore` (ignore build artifacts dist/ dan *.tsbuildinfo secara global)
- **Deskripsi:**
  Memperbaiki konfigurasi `apps/api/tsconfig.json` dengan mengaktifkan compiler options modern (ES2022, lib ES2022, strict mode, types node dan jest) sehingga bebas warning linting di VS Code. Memperbaiki error TS5097 pada `apps/web/src/main.tsx` sehingga perintah `npm run build` dan `npm test` lulus 100% pada seluruh workspace.
- **Error/Kendala:** Tidak ada.

---

## [2026-10-28 13:25 WIB] — Harmonisasi Standar Dokumentasi Template RPL & Restrukturisasi Docs

- **Agent:** Gemini 3.8 Flash
- **Tipe:** Dokumentasi & Refactor
- **Status:** Selesai
- **Modul:** Dokumentasi Proyek (`docs/`, `README.md`)
- **File terdampak:**
  - `docs/ide_proyek.md` (baru)
  - `docs/Agent.md` (baru)
  - `docs/Coding_Style.md` (baru)
  - `docs/Design_UI.md` (baru)
  - `docs/Logging.md` (baru)
  - `docs/DevLog.md` (baru)
  - `README.md` (pembaruan struktur standar)
- **Deskripsi:**
  Menyesuaikan arsitektur dokumentasi dan template proyek SkillSwap agar selaras dengan standar acuan RPL (Nexa framework). Menambahkan direktori `docs/` komprehensif mencakup panduan AI agent, konvensi gaya kode, spesifikasi desain antarmuka, aturan logging dev, serta dokumen ide proyek. Seluruh berkas disinkronkan ke remote repository GitHub.
- **Error/Kendala:** Tidak ada.

---

## [2026-10-28 13:20 WIB] — Penuntasan Pertemuan 7: Finalisasi MVP, Checklist Evaluasi, & HowToRun

- **Agent:** Gemini 3.8 Flash
- **Tipe:** Dokumentasi & Rilis MVP
- **Status:** Selesai
- **Modul:** Root Deliverables
- **File terdampak:**
  - `HowToRun.md` (baru)
  - `checklist_mvp.md` (baru)
  - `package.json` (tambah script `test` dan `test:api`)
- **Deskripsi:**
  Menuntaskan target Pertemuan 7 dengan menyediakan panduan langkah demi langkah menjalankan aplikasi secara mandiri (`HowToRun.md`), checklist evaluasi lengkap Pertemuan 5, 6, dan 7 beserta laporan kelulusan unit test dan panduan skenario video demo (`checklist_mvp.md`), serta konfigurasi script npm monorepo untuk eksekusi test langsung dari root.
- **Error/Kendala:** Tidak ada.

---

## [2026-10-28 13:16 WIB] — Pertemuan 6: Pembangunan Test Suite Jest & 5 File Unit Test Business Logic (33 Tests Passed)

- **Agent:** Gemini 3.8 Flash & Claude Opus 4.6
- **Tipe:** Pengujian/Testing
- **Status:** Selesai
- **Modul:** Backend Unit Testing (`apps/api/src/__tests__/`)
- **File terdampak:**
  - `apps/api/package.json` (instalasi `jest`, `ts-jest`, `@types/jest`, script `test`)
  - `apps/api/jest.config.js` (konfigurasi ts-jest preset)
  - `apps/api/src/__tests__/UserService.test.ts` (8 test)
  - `apps/api/src/__tests__/SkillService.test.ts` (5 test)
  - `apps/api/src/__tests__/SwapRequestService.test.ts` (10 test)
  - `apps/api/src/__tests__/ChatService.test.ts` (6 test)
  - `apps/api/src/__tests__/DashboardService.test.ts` (4 test)
- **Deskripsi:**
  Membangun infrastruktur unit test otomatis dengan Jest dan ts-jest untuk menguji seluruh aturan bisnis inti pada layer service. Mengisolasi query basis data menggunakan Prisma mock. Menghasilkan 5 berkas unit test dengan total 33 skenario pengujian yang mencakup validasi registrasi/login, inventaris skill HAVE/WANT, pembatasan swap request, otorisasi chat room, dan kalkulasi statistik dashboard.
- **Hasil Verifikasi:**
  - Perintah: `npm test`
  - Hasil: `5 Test Suites passed, 33 Tests passed (100% All Passed)`.

---

## [2026-10-07 22:15 WIB] — Pertemuan 5: Perbaikan Routing App.tsx, Passing Prop currentUser, & Skema Password Prisma

- **Agent:** Claude Sonnet 4.6
- **Tipe:** Fix Bug & Fitur Baru
- **Status:** Selesai
- **Modul:** Frontend Routing & Backend Prisma Schema
- **File terdampak:**
  - `apps/api/prisma/schema.prisma` (tambah field `password` pada model `User`)
  - `apps/api/src/server.ts` (perbaikan path import `./app` dan urutan inisialisasi `.env`)
  - `apps/api/src/app.ts` (pendaftaran rute API)
  - `apps/web/src/App.tsx` (routing dinamis, login provider, prop passing `currentUser` & `onUpdateUser`)
- **Deskripsi:**
  Memperbaiki kendala backend crash `Cannot find module ./app.js` dan kegagalan migrasi Prisma akibat field `password` yang belum terdaftar. Menulis ulang `App.tsx` dari komponen placeholder statis menjadi router lengkap berbasis React Router DOM dengan penanganan sesi `localStorage` dan parsing prop ke seluruh halaman.
- **Error/Kendala:** Blank screen putih pada dashboard setelah login karena prop `currentUser` awalnya undefined di `App.tsx`. Diatasi dengan parsing prop eksplisit.

---

## [2026-10-03 11:30 WIB] — Inisialisasi Arsitektur Fullstack Monorepo SkillSwap (MySQL Lokal XAMPP)

- **Agent:** Fullstack Builder Agent
- **Tipe:** Fitur Baru & Arsitektur
- **Status:** Selesai
- **Modul:** Backend API, Frontend Web, Shared Package
- **File terdampak:**
  - `packages/shared/src/` (definisi model, DTO, enums)
  - `apps/api/src/` (controllers, routes, services)
  - `apps/web/src/` (pages, components, Tailwind layout)
  - `apps/api/.env` (koneksi MySQL `mysql://root:@localhost:3306/skillswap_db`)
- **Deskripsi:**
  Mengganti dependensi Docker Compose menjadi MySQL lokal XAMPP sesuai preferensi pengguna. Menginisialisasi monorepo npm workspaces dan membangun seluruh endpoint dasar REST API beserta antarmuka React Tailwind.

