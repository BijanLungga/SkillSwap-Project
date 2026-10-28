# SkillSwap — Platform Pertukaran Keahlian Peer-to-Peer

> **Platform Web Responsif Berbasis Komunitas untuk Pertukaran Keahlian (Barter Skill) Antar-Pengguna Berdasarkan Minat dan Kebutuhan Spesifik**

Aplikasi ini dikembangkan untuk memfasilitasi individu yang ingin mempelajari keterampilan baru (misalnya pemrograman, desain grafis, bahasa asing, atau musik) secara gratis melalui barter keahlian langsung (*peer-to-peer*) tanpa melibatkan transaksi uang.

---

## 📑 Dokumen Proyek & Panduan
- 📖 [Panduan Menjalankan Lengkap (HowToRun.md)](./HowToRun.md)
- ✅ [Checklist Evaluasi MVP Pertemuan 5, 6, & 7 (checklist_mvp.md)](./checklist_mvp.md)

---

## 🚀 Fitur Utama (MVP Scope)

1. **Autentikasi Pengguna**: Registrasi akun baru dan login dengan email & password.
2. **Manajemen Profil & Keahlian**: Kelola nama, bio, serta keahlian yang dimiliki (`HAVE`) dan yang ingin dipelajari (`WANT`).
3. **Eksplorasi Partner**: Cari dan filter pengguna lain berdasarkan nama atau keahlian yang ditawarkan/dicari.
4. **Manajemen Swap Request**: Kirim permintaan barter skill, terima (`ACCEPTED`), atau tolak (`REJECTED`) permintaan masuk.
5. **Ruang Obrolan (Chat Room)**: Fasilitas koordinasi teks antar-partner yang telah disetujui permintaannya.
6. **Dashboard Interaktif**: Statistik real-time (jumlah skill, permintaan pending, swap aktif) serta daftar partner terhubung.

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM |
| **Database** | MySQL (via XAMPP) |
| **Testing** | Jest, ts-jest (Unit Testing All Passed) |
| **Architecture** | Monorepo dengan npm workspaces (`apps/web`, `apps/api`, `packages/shared`) |

---

## ⚡ Cara Cepat Menjalankan Aplikasi

### 1. Prasyarat
- **Node.js** v18+ sudah terpasang
- **XAMPP** sudah terpasang (nyalakan **MySQL** di XAMPP hingga status hijau)

### 2. Setup Database & Dependencies
```bash
# 1. Install dependencies
npm install

# 2. Setup file .env pada apps/api/.env
# Pastikan isinya:
# PORT=5000
# DATABASE_URL="mysql://root:@localhost:3306/skillswap_db"

# 3. Sinkronisasi database & Prisma Client
cd apps/api
npx prisma db push
cd ../..
```

### 3. Jalankan Aplikasi (Buka 2 Terminal)

**Terminal 1 — Backend API:**
```bash
cd apps/api
npx ts-node-dev --respawn --transpile-only src/server.ts
```
*(Server berjalan di `http://localhost:5000`)*

**Terminal 2 — Frontend Web:**
```bash
npm run dev:web
```
*(Frontend berjalan di `http://localhost:5173`)*

Buka browser di **http://localhost:5173**!

---

## 🧪 Eksekusi Unit Test (Wajib All Passed)

Jalankan pengujian unit test dari root project:
```bash
npm test
```
Atau:
```bash
cd apps/api
npx jest --verbose
```

**Hasil: 5 Test Suites Passed, 33 Tests Passed (100% Passed)**

---

## 📁 Struktur Monorepo

```text
SkillSwap-Project/
├── apps/
│   ├── api/                  # Backend Express + Prisma
│   │   ├── prisma/
│   │   │   └── schema.prisma # Schema database MySQL
│   │   ├── src/
│   │   │   ├── __tests__/    # 5 File Unit Test Business Logic (Jest)
│   │   │   ├── config/       # Koneksi database Prisma
│   │   │   ├── controllers/  # Request & Response Handlers
│   │   │   ├── routes/       # Definisi endpoint RESTful
│   │   │   ├── services/     # Aturan bisnis (Business Logic)
│   │   │   ├── app.ts        # Inisialisasi Express & middleware
│   │   │   └── server.ts     # Entry point server
│   │   └── package.json
│   └── web/                  # Frontend React + Vite
│       └── src/
│           ├── components/   # Navbar, SkillBadge, StatusBadge, ConfirmDialog, EmptyState
│           ├── pages/        # Login, Dashboard, Profile, Explore, SwapRequests
│           ├── services/     # Axios client API service
│           └── App.tsx       # State sesi & router halaman
├── packages/
│   └── shared/               # Shared DTOs, Enums, & Interfaces
├── HowToRun.md               # Panduan teknis instalasi & eksekusi
├── checklist_mvp.md          # Checklist tugas Pertemuan 5, 6, & 7
└── README.md                 # Dokumentasi umum repositori
```

---

## 📋 Ringkasan Endpoint REST API

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/users` | Registrasi user baru |
| `POST` | `/api/users/login` | Autentikasi user |
| `GET` | `/api/users/:id` | Detail profil pengguna |
| `PUT` | `/api/users/:id` | Perbarui nama & bio pengguna |
| `GET` | `/api/users/:id/skills` | Ambil daftar keahlian pengguna |
| `POST` | `/api/users/:id/skills` | Tambah keahlian (`HAVE` / `WANT`) |
| `DELETE` | `/api/skills/:id` | Hapus keahlian berdasarkan ID |
| `GET` | `/api/explore` | Cari pengguna berdasarkan nama/skill |
| `GET` | `/api/swap-requests` | Daftar permintaan tukar (masuk & keluar) |
| `POST` | `/api/swap-requests` | Kirim permohonan barter skill baru |
| `PUT` | `/api/swap-requests/:id` | Update status (`ACCEPTED` / `REJECTED`) |
| `GET` | `/api/swap-requests/:id/messages` | Riwayat obrolan barter skill |
| `POST` | `/api/swap-requests/:id/messages` | Kirim pesan koordinasi obrolan |
| `GET` | `/api/dashboard` | Statistik kuadran & partner aktif |
