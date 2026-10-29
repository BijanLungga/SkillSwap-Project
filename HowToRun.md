# Cara Menjalankan Aplikasi SkillSwap

## Prasyarat

Pastikan sudah terinstall di komputer:

| Software | Versi Minimum | Link Download |
|----------|--------------|---------------|
| Node.js | v18+ | https://nodejs.org/ |
| Laragon / XAMPP | Terbaru | https://laragon.org/ atau https://www.apachefriends.org/ |
| Git | Terbaru | https://git-scm.com/ |

---

## Setup Pertama Kali

### 1. Clone Repository

```bash
git clone https://github.com/BijanLungga/SkillSwap-Project.git
cd SkillSwap-Project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Database

Buat file `apps/api/.env`:

```env
PORT=5000
DATABASE_URL="mysql://root:@localhost:3306/skillswap_db"
```

> **Catatan:** Jika MySQL menggunakan password, ubah menjadi `mysql://root:PASSWORD@localhost:3306/skillswap_db`. Untuk Laragon default password kosong (`""`).

### 4. Nyalakan MySQL (Laragon atau XAMPP)

- **Opsi Laragon (Disarankan):**
  1. Buka aplikasi **Laragon**.
  2. Klik tombol **"Start All"**.
  3. Pastikan MySQL aktif pada port `3306`.

- **Opsi XAMPP:**
  1. Buka **XAMPP Control Panel**.
  2. Klik **Start** pada modul **MySQL** hingga berwarna hijau.

### 5. Sinkronisasi Database

```bash
cd apps/api
npx prisma db push
cd ../..
```

Perintah ini akan otomatis:
- Membuat database `skillswap_db`
- Membuat semua tabel sesuai schema Prisma
- Meng-generate Prisma Client

---

## Menjalankan Aplikasi

> ⚠️ **Pastikan MySQL di Laragon / XAMPP sudah Running sebelum memulai.**

Buka **2 terminal terpisah**:

### Terminal 1 — Backend API

```bash
npm run dev:api
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

### Akses Aplikasi

Buka browser dan akses:
```
http://localhost:5173
```

---

## Cara Melihat Akun & Password yang Pernah Dibuat

Untuk melihat seluruh akun yang sudah terdaftar di database secara instan, jalankan perintah ini dari terminal:

```bash
npm run users
```

Perintah di atas akan menampilkan tabel seluruh akun di terminal:
- **Nama**
- **Email**
- **Password**
- **Waktu Terdaftar**

---

## Menjalankan Unit Test

Dari root project:
```bash
npm test
```

Hasil: **7 Test Suites Passed, 52 Tests Passed (ALL PASSED)**.

---

## Menghentikan Aplikasi

Tekan **`Ctrl + C`** di masing-masing terminal.

### Jika Port 5000 Masih Terpakai

```bash
# Cari PID proses
netstat -ano | findstr :5000

# Matikan proses (ganti 12345 dengan PID yang muncul)
taskkill /PID 12345 /F
```

---

## Urutan Menjalankan (Setiap Saat)

```
1. Nyalakan Laragon (Klik "Start All") atau XAMPP (Start MySQL)
2. Jalankan Backend (Terminal 1)
3. Jalankan Frontend (Terminal 2)
4. Buka http://localhost:5173
```

---

## Troubleshooting

| Error | Solusi |
|-------|--------|
| `Cannot find module ./app` | Pastikan `server.ts` mengimport `'./app'` tanpa `.js` |
| `Environment variable not found: DATABASE_URL` | Pastikan file `apps/api/.env` sudah ada dan berisi `DATABASE_URL` |
| `Can't reach database server at localhost:3306` | Nyalakan MySQL di Laragon (klik "Start All") atau XAMPP terlebih dahulu |
| `address already in use :::5000` | Kill proses lama: `taskkill /PID <pid> /F` |
| `Unknown argument 'password'` | Jalankan `npx prisma db push` dari folder `apps/api` |
| Tombol tidak bisa diklik | Pastikan backend sudah berjalan di port 5000 |
| Blank screen putih setelah login | Buka DevTools (F12) → Console, cek error JavaScript |

