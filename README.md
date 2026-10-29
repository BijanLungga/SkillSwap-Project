# SkillSwap — Platform Pertukaran Keahlian Antar-Pengguna (Peer-to-Peer)

**SkillSwap** adalah aplikasi web responsif berbasis komunitas yang dirancang untuk memfasilitasi pertukaran keterampilan secara langsung (*peer-to-peer barter skill*) antar-pengguna berdasarkan minat dan kebutuhan belajar spesifik, tanpa melibatkan transaksi finansial.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma ORM, MySQL (XAMPP)
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons
- **Testing:** Jest, ts-jest (Preset Node/TypeScript)
- **Arsitektur:** Decoupled Monorepo (npm workspaces: `apps/api`, `apps/web`, `packages/shared`), RESTful API

---

## Prerequisites

Sebelum mulai, pastikan hal berikut sudah terpasang di komputer Anda:

| Kebutuhan | Keterangan |
| :--- | :--- |
| **Node.js** | Versi 18 atau lebih baru (`node -v`). Download di [nodejs.org](https://nodejs.org/). |
| **Database** | **Laragon** (Disarankan) atau **XAMPP** untuk server MySQL lokal (port 3306). |
| **Git** | Untuk clone dan manajemen versi kode (`git --version`). |
| **Port bebas** | Port `5000` (API) dan `5173` (Frontend Web) tidak sedang dipakai aplikasi lain. |

> **Catatan untuk pengguna Windows:** Seluruh perintah di panduan ini dijalankan di **PowerShell** atau terminal bawaan VS Code / IDE.

---

## Quick Start — Panduan Menjalankan Aplikasi

### 1. Masuk ke Folder Project & Install Dependencies

```bash
cd "d:\Semester 3\RPL"
npm install
```

### 2. Buat File `.env` untuk Backend API

Template konfigurasi tersimpan di `apps/api/.env.example`. Buat file `apps/api/.env` dengan konfigurasi berikut:

```dotenv
PORT=5000
DATABASE_URL="mysql://root:@localhost:3306/skillswap_db"
```

> **Catatan:** Jika akun MySQL Anda menggunakan password, sesuaikan nilai `DATABASE_URL` menjadi `mysql://root:PASSWORD_ANDA@localhost:3306/skillswap_db`. Untuk Laragon default password kosong (`""`).

### 3. Nyalakan Layanan MySQL di Laragon / XAMPP

- **Menggunakan Laragon (Disarankan):**
  1. Buka aplikasi **Laragon**.
  2. Klik tombol **"Start All"**.
  3. Pastikan MySQL berstatus aktif (port `3306`).
- **Menggunakan XAMPP:**
  1. Buka **XAMPP Control Panel**.
  2. Klik tombol **Start** pada baris modul **MySQL** (port `3306`).

### 4. Sinkronisasi Skema Database & Generate Prisma Client

Jalankan perintah berikut dari folder `apps/api`:

```bash
cd apps/api
npx prisma db push
cd ../..
```

Perintah ini akan secara otomatis membuat basis data `skillswap_db`, menyinkronkan seluruh tabel relasional (`User`, `UserSkill`, `SwapRequest`, `ChatMessage`), serta meng-generate Prisma Client.

### 5. Jalankan Aplikasi (Buka 2 Terminal Terpisah)

#### Terminal 1 — Backend API Server:
```bash
cd apps/api
npx ts-node-dev --respawn --transpile-only src/server.ts
```
*Output yang diharapkan saat server berhasil berjalan:*
```text
[SkillSwap API] Server berjalan di http://localhost:5000
```

#### Terminal 2 — Frontend Web Application:
```bash
npm run dev:web
```
*Output yang diharapkan saat frontend siap:*
```text
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 6. Verifikasi Health Endpoint Backend

Untuk memastikan backend API merespons dengan normal, buka tab browser baru atau jalankan:

```bash
curl http://localhost:5000/api/health
```

Respons yang diharapkan:
```json
{
  "status": "ok",
  "service": "SkillSwap API",
  "timestamp": "2026-10-28T13:30:00.000Z"
}
```

### 7. Menjalankan Unit Test (Wajib All Passed)

Pengujian unit test dijalankan menggunakan Jest untuk memvalidasi seluruh aturan bisnis pada level service. Anda dapat menjalankannya langsung dari root project:

```bash
npm test
```

Atau dari direktori backend API:
```bash
cd apps/api
npx jest --verbose
```

**Ekspektasi Hasil Pengujian (Status: ALL PASSED):**
```text
PASS src/__tests__/SkillService.test.ts
PASS src/__tests__/DashboardService.test.ts
PASS src/__tests__/UserService.test.ts
PASS src/__tests__/NotificationService.test.ts
PASS src/__tests__/ReviewService.test.ts
PASS src/__tests__/ChatService.test.ts
PASS src/__tests__/SwapRequestService.test.ts

Test Suites: 7 passed, 7 total
Tests:       52 passed, 52 total
Snapshots:   0 total
Time:        ~3.8 s
Ran all test suites.
```

### 8. Akses Aplikasi & Akun Demo

Buka peramban (browser) di alamat:
```
http://localhost:5173
```

Anda dapat langsung membuat akun baru melalui menu **"Belum punya akun? Daftar sekarang"**, atau menggunakan salah satu akun demo berikut:

| Nama Pengguna | Alamat Email | Password | Keahlian Dimiliki (HAVE) | Keahlian Diinginkan (WANT) |
| :--- | :--- | :--- | :--- | :--- |
| **Alice** | `alice@example.com` | `123456` | UI/UX Design, Figma | React TypeScript, Python |
| **Bob** | `bob@example.com` | `123456` | Fullstack Web, Node.js | Graphic Design, UI/UX |
| **Charlie** | `charlie@example.com` | `123456` | Music Production, Audio | Digital Marketing |

### 9. Menghentikan Aplikasi (Stop & Cleanup)

Tekan kombinasi tombol **`Ctrl + C`** pada masing-masing jendela terminal yang sedang aktif.

Jika port 5000 masih tertahan oleh proses latar belakang Windows, gunakan perintah pemutus proses berikut:
```powershell
netstat -ano | findstr :5000
taskkill /PID <NOMOR_PID> /F
```

---

## Troubleshooting

| Masalah | Kemungkinan Penyebab | Tindakan Solusi |
| :--- | :--- | :--- |
| `Can't reach database server at localhost:3306` | Layanan MySQL pada XAMPP belum dijalankan | Buka XAMPP Control Panel lalu klik **Start** pada modul MySQL. |
| `address already in use :::5000` | Port 5000 masih dipakai proses node sebelumnya | Cari PID dengan `netstat -ano \| findstr :5000` lalu matikan dengan `taskkill /PID <PID> /F`. |
| `Environment variable not found: DATABASE_URL` | File `apps/api/.env` belum dibuat atau path salah | Pastikan file `apps/api/.env` sudah ada dan memuat variabel `DATABASE_URL`. |
| `Unknown argument password` pada Prisma | Prisma client belum di-generate ulang | Jalankan `npx prisma db push` dari dalam folder `apps/api`. |
| Vite proxy error `aggregateerror` saat registrasi | Server backend API belum berjalan | Jalankan Terminal 1 (`npx ts-node-dev ... src/server.ts`) sebelum berinteraksi di browser. |
| Halaman blank putih setelah login | State user belum termuat dengan benar | Refresh browser (Ctrl+F5) atau hapus riwayat sesi `localStorage` via DevTools (F12). |

---

## Struktur Project

```text
SkillSwap-Project/
├── apps/
│   ├── api/                      # Backend REST API (Node.js + Express + Prisma)
│   │   ├── prisma/
│   │   │   ├── schema.prisma     # Definisi skema basis data MySQL
│   │   │   └── seed.ts           # Script database seeder opsional
│   │   ├── src/
│   │   │   ├── config/           # Inisialisasi Prisma Client singleton
│   │   │   ├── controllers/      # HTTP Request & Response handlers
│   │   │   ├── routes/           # Pemetaan endpoint Express router
│   │   │   ├── services/         # Business logic & validasi aturan aplikasi
│   │   │   ├── __tests__/        # 5 Suite Unit Test Jest (UserService, Skill, Swap, Chat, Dashboard)
│   │   │   ├── app.ts            # Registrasi middleware Express & CORS
│   │   │   └── server.ts         # Server entry point & listener
│   │   ├── jest.config.js        # Konfigurasi ts-jest runner
│   │   ├── tsconfig.json         # Konfigurasi compiler TypeScript API
│   │   └── package.json
│   └── web/                      # Frontend SPA (React 18 + Vite + Tailwind CSS)
│       └── src/
│           ├── components/       # UI Reusable (Navbar, SkillBadge, StatusBadge, ConfirmDialog, EmptyState)
│           ├── pages/            # View halaman utama (Login, Dashboard, Profile, Explore, SwapRequests)
│           ├── services/         # Axios API service caller
│           └── App.tsx           # Router & provider sesi autentikasi pengguna
├── packages/
│   └── shared/                   # DTOs, Enums, & Model Interfaces bersama
├── docs/                         # Dokumentasi Arsitektur & Standar Pengembangan
│   ├── ide_proyek.md             # Dokumen proposal ide tugas matkul RPL
│   ├── Agent.md                  # Panduan operasional AI coding agent
│   ├── Coding_Style.md           # Standar gaya penulisan kode backend & frontend
│   ├── Design_UI.md              # Spesifikasi token warna & komponen UI
│   ├── Logging.md                # Konvensi dev log berkala
│   └── DevLog.md                 # Log kronologis riwayat pengerjaan proyek
├── HowToRun.md                   # Panduan cepat eksekusi aplikasi
├── checklist_mvp.md              # Laporan checklist evaluasi Pertemuan 5, 6, & 7
└── README.md                     # Dokumentasi utama repositori
```

---

## Security Notes

- Kredensial sensitif seperti kata sandi dan URL basis data dikelola melalui berkas `.env` dan **tidak di-commit ke repositori Git**.
- File `apps/api/.env.example` disediakan sebagai acuan konfigurasi tanpa memuat rahasia produksi.
- Kueri basis data dilindungi dari ancaman SQL Injection melalui pemanfaatan Prisma ORM Parameterized Queries.
- Validasi logika bisnis ketat diterapkan pada layer service untuk mencegah manipulasi data oleh pihak yang tidak berhak (*Anti-IDOR* dan *Access Ownership Check* pada chat room).
- Respons JSON API pada proses pendaftaran dan login secara ketat mengecualikan data password.

---

## Dokumen Lengkap

### Dokumen Produk & Ide
| Berkas | Deskripsi |
| :--- | :--- |
| [`docs/ide_proyek.md`](docs/ide_proyek.md) | Konsep ide proyek, perumusan masalah, profil target pengguna, fitur inti, dan kriteria keberhasilan. |
| [`checklist_mvp.md`](checklist_mvp.md) | Laporan evaluasi tugas Pertemuan 5, 6, dan 7, bukti unit test, dan panduan skenario rekaman demo video. |
| [`HowToRun.md`](HowToRun.md) | Panduan teknis lengkap langkah demi langkah menjalankan seluruh aplikasi dari awal. |

### Dokumen Panduan Pengembangan
| Berkas | Deskripsi |
| :--- | :--- |
| [`docs/Agent.md`](docs/Agent.md) | Panduan standar perilaku AI coding agent (aturan main, alur kerja task, larangan khusus). |
| [`docs/Coding_Style.md`](docs/Coding_Style.md) | Standar penulisan kode backend (Express/Prisma) dan frontend (React/Tailwind), konvensi penamaan, dan format API. |
| [`docs/Design_UI.md`](docs/Design_UI.md) | Spesifikasi antarmuka: palet warna, tipografi, status badge semantik, dan panduan komponen UI. |
| [`docs/Logging.md`](docs/Logging.md) | Aturan dan konvensi penulisan dev log kerja berkala ke dalam `docs/DevLog.md`. |
| [`docs/DevLog.md`](docs/DevLog.md) | Catatan log kronologis pengerjaan fitur, perbaikan bug, refactor, dan penambahan test suite. |

---

## Masalah yang Diselesaikan

1. **Kendala Biaya Pelatihan Tinggi** — Memungkinkan individu mempelajari keahlian baru secara gratis melalui pertukaran kemampuan dua arah (*Skill A for Skill B*).
2. **Kesulitan Menemukan Partner Belajar yang Cocok** — Menyediakan fitur pencarian dan pencocokan partner (*Skill Matching*) berdasarkan keahlian yang dimiliki (`HAVE`) dan yang ingin dipelajari (`WANT`).
3. **Komunikasi yang Terfragmentasi** — Mengintegrasikan manajemen status permintaan tukar (*State Machine*) dan ruang pesan teks langsung (*Chat Room*) dalam satu platform terpadu.
4. **Ketiadaan Pemantauan Progres Barter** — Dasbor analitik ringkas menampilkan metrik kuadran dan daftar kontak partner aktif yang sedang terhubung.

---

## Target Pengguna

| Profil Pengguna | Karakteristik & Kebutuhan Utama |
| :--- | :--- |
| **Mahasiswa & Pelajar** | Mempelajari keahlian pendukung kuliah (pemrograman, bahasa asing) tanpa biaya finansial dengan menukarkan keahlian yang dimiliki. |
| **Freelancer & Profesional Muda** | Memperluas keahlian lintas bidang (*cross-skilling*) untuk meningkatkan daya saing portofolio kerja secara kolaboratif. |
| **Pembelajar Mandiri (Self-Learner)** | Mencari rekan belajar yang memiliki minat setara untuk sesi latihan rutin dan berbagi pengalaman praktis. |

---

## Fitur Inti (Core Features Status)

Status fitur ditandai secara transparan: **[Ada]** = telah selesai diimplementasikan pada kode, **[Rencana]** = pengembangan lanjutan pasca-MVP 12 pertemuan.

1. **[Ada] Autentikasi Pengguna** — Registrasi akun baru, validasi kredensial login, proteksi data password, dan logout sesi.
2. **[Ada] Pengelolaan Profil & Biodata** — Pembaruan nama lengkap dan bio profil pengguna.
3. **[Ada] Manajemen Inventaris Keahlian Barter** — Penambahan dan penghapusan keahlian tipe `HAVE` (Dimiliki) dan `WANT` (Diinginkan) dengan dialog konfirmasi.
4. **[Ada] Eksplorasi & Pencarian Partner** — Pencarian pengguna secara real-time berdasarkan kata kunci nama atau keahlian, lengkap dengan filter tipe keahlian dan rating partner.
5. **[Ada] Siklus Permintaan Pertukaran (Swap Request State Machine)** — Alur status `PENDING` $\rightarrow$ `ACCEPTED` / `REJECTED` / `COMPLETED`, dilengkapi pencegahan permohonan ke diri sendiri dan permohonan ganda.
6. **[Ada] Ruang Obrolan Terintegrasi (Chat Room)** — Pengiriman pesan teks koordinasi antar-partner pada pertukaran yang telah disetujui (`ACCEPTED`) dengan polling otomatis berkala.
7. **[Ada] Dasbor Statistik & Partner Terhubung** — Metrik statistik 4 kuadran dan tabel partner terhubung dengan tautan langsung ke obrolan.
8. **[Ada] Notifikasi Push Real-time** — Pengiriman pemberitahuan langsung ke browser saat menerima permintaan barter, persetujuan/penolakan, atau pesan baru via WebSockets terintegrasi.
9. **[Rencana] Panggilan Video Pembelajaran** — Ruang tatap muka virtual bawaan di dalam aplikasi.
10. **[Ada] Sistem Ulasan & Reputasi Partner** — Pemberian rating bintang (1-5) dan testimoni ulasan setelah sesi pertukaran selesai (`COMPLETED`), serta kalkulasi reputasi partner.

---

## Target Keberhasilan Aplikasi

- Alur utama berjalan lancar dari awal hingga akhir: Pendaftaran Akun $\rightarrow$ Tambah Keahlian $\rightarrow$ Cari Partner $\rightarrow$ Ajukan Tukar $\rightarrow$ Terima Permintaan $\rightarrow$ Koordinasi via Chat Room $\rightarrow$ Selesaikan Pertukaran $\rightarrow$ Beri Ulasan & Rating.
- Integritas aturan bisnis terjaga: 100% permintaan tukar ke diri sendiri dan permintaan ganda tertolak oleh validasi service.
- Seluruh unit test business logic: **52 dari 52 tests PASSED (100% kelulusan di 7 test suites)**.
- Antarmuka web responsif dan bebas galat antarmuka (0 critical bugs pada pengujian alur utama).


