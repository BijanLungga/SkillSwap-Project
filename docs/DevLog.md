# Dev Log — SkillSwap

> Aturan penulisan entri: lihat `docs/Logging.md`. Entri terbaru selalu ditambahkan di **paling atas**, tepat di bawah baris ini.

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
