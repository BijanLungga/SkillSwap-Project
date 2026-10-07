# SkillSwap — Platform Pertukaran Keahlian Peer-to-Peer

> Platform web komunitas untuk menghubungkan individu yang ingin mempelajari keahlian baru dengan orang yang memiliki keahlian tersebut, melalui sistem barter skill secara langsung (peer-to-peer) tanpa biaya finansial.

---

## Fitur Utama

- **Autentikasi** — Daftar & masuk menggunakan email dan password
- **Profil & Keahlian** — Tambah/hapus keahlian yang dimiliki (`HAVE`) dan ingin dipelajari (`WANT`)
- **Eksplorasi Partner** — Cari dan filter pengguna lain berdasarkan keahlian
- **Swap Request** — Kirim, terima, atau tolak permintaan pertukaran keahlian
- **Chat** — Ruang obrolan antar pengguna yang sudah terhubung (status `ACCEPTED`)
- **Dashboard** — Ringkasan statistik dan daftar partner aktif

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + TypeScript + Express |
| Database | MySQL (via XAMPP) |
| ORM | Prisma |
| Shared Types | npm workspace (`packages/shared`) |

---

## Prasyarat

Pastikan sudah terinstall di komputer kamu:

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- [XAMPP](https://www.apachefriends.org/) (untuk MySQL)
- Git

---

## Cara Menjalankan (Setup Pertama Kali)

### 1. Clone Repository

```bash
git clone https://github.com/BijanLungga/SkillSwap-Project.git
cd SkillSwap-Project
```

### 2. Install Semua Dependencies

```bash
npm install
```

### 3. Buat File `.env` untuk Backend

Buat file baru di `apps/api/.env`:

```env
PORT=5000
DATABASE_URL="mysql://root:@localhost:3306/skillswap_db"
```

> **Catatan:** Jika MySQL kamu menggunakan password, ganti `root:` menjadi `root:PASSWORD_KAMU`.

### 4. Nyalakan MySQL di XAMPP

1. Buka **XAMPP Control Panel**
2. Klik **Start** pada baris **MySQL**
3. Tunggu sampai status berubah menjadi **hijau (Running)**

### 5. Sync Database & Generate Prisma Client

Jalankan dari folder `apps/api`:

```bash
cd apps/api
npx prisma db push
```

Perintah ini akan:
- Membuat database `skillswap_db` secara otomatis
- Membuat semua tabel sesuai schema
- Meng-generate Prisma Client

Kembali ke folder root:

```bash
cd ../..
```

---

## Cara Menjalankan Aplikasi (Setiap Saat)

> ⚠️ **Pastikan MySQL di XAMPP sudah Running sebelum memulai.**

Buka **2 terminal terpisah** di folder root project:

### Terminal 1 — Backend API

```bash
cd apps/api
npx ts-node-dev --respawn --transpile-only src/server.ts
```

Tunggu hingga muncul:
```
[SkillSwap API] Server berjalan di http://localhost:5000
```

### Terminal 2 — Frontend Web

```bash
npm run dev:web
```

Tunggu hingga muncul:
```
  ➜  Local:   http://localhost:5173/
```

### Buka di Browser

```
http://localhost:5173
```

---

## Cara Menghentikan Aplikasi

Tekan **`Ctrl + C`** di masing-masing terminal.

Jika ada error `address already in use :::5000`, jalankan:

```bash
# Cari PID proses di port 5000
netstat -ano | findstr :5000

# Matikan proses (ganti 12345 dengan PID yang muncul)
taskkill /PID 12345 /F
```

---

## Urutan Wajib Setiap Kali Mau Pakai SkillSwap

```
1. Nyalakan XAMPP → Start MySQL
2. Jalankan Backend (Terminal 1)
3. Jalankan Frontend (Terminal 2)
4. Buka http://localhost:5173
```

---

## Struktur Project

```
SkillSwap-Project/
├── apps/
│   ├── api/                  # Backend Express + Prisma
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── config/       # Koneksi database
│   │   │   ├── controllers/  # Request handler
│   │   │   ├── routes/       # Route definitions
│   │   │   └── services/     # Business logic
│   │   └── .env              # Environment variables (buat sendiri)
│   └── web/                  # Frontend React + Vite
│       └── src/
│           ├── components/   # Komponen reusable
│           ├── pages/        # Halaman utama
│           └── services/     # Axios API calls
└── packages/
    └── shared/               # TypeScript types bersama
```

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/users` | Daftar akun baru |
| `POST` | `/api/users/login` | Login |
| `GET` | `/api/users/:id` | Detail pengguna |
| `PUT` | `/api/users/:id` | Update profil |
| `GET` | `/api/users/:id/skills` | Daftar keahlian |
| `POST` | `/api/users/:id/skills` | Tambah keahlian |
| `DELETE` | `/api/skills/:id` | Hapus keahlian |
| `GET` | `/api/explore` | Cari partner |
| `GET` | `/api/swap-requests` | Daftar swap request |
| `POST` | `/api/swap-requests` | Kirim swap request |
| `PUT` | `/api/swap-requests/:id` | Update status request |
| `GET` | `/api/swap-requests/:id/messages` | Riwayat chat |
| `POST` | `/api/swap-requests/:id/messages` | Kirim pesan |
| `GET` | `/api/dashboard` | Data dashboard |

---

## Troubleshooting

| Error | Solusi |
|---|---|
| `Cannot find module /app.js` | Pastikan `server.ts` mengimport `'./app'` tanpa `.js` |
| `Environment variable not found: DATABASE_URL` | Pastikan file `apps/api/.env` sudah dibuat dan berisi `DATABASE_URL` |
| `Can't reach database server at localhost:3306` | Nyalakan MySQL di XAMPP terlebih dahulu |
| `address already in use :::5000` | Ada proses lain di port 5000, matikan dengan `taskkill /PID <pid> /F` |
| `Unknown argument 'password'` | Jalankan `npx prisma db push` dari folder `apps/api` untuk sync schema |
| Tombol tidak bisa diklik di web | Pastikan backend sudah jalan di port 5000 |

---

## Kontribusi

1. Fork repository ini
2. Buat branch baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m "feat: deskripsi fitur"`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat Pull Request
