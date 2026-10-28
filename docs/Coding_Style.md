# Coding Style Guide — SkillSwap

Dokumen ini menjadi rujukan standar gaya penulisan kode untuk seluruh kontributor proyek **SkillSwap**, mencakup Backend (Node.js/Express/TypeScript/Prisma) dan Frontend (React/TypeScript/Tailwind CSS). Tujuannya adalah menjamin konsistensi, keterbacaan, keamanan, dan kemudahan pemeliharaan sistem.

---

## 0. Prinsip Umum

1. **Konsistensi > Preferensi Pribadi.** Ikuti konvensi yang telah ditetapkan di basis kode, hindari gaya eksperimental individual.
2. **Explicit > Implicit.** Hindari "magic value"; gunakan enum eksplisit untuk status (`PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`) dan tipe keahlian (`HAVE`, `WANT`).
3. **Fail Safe, Fail Loud.** Tangani error dengan melempar pesan yang jelas di level service dan tangkap dengan response format standar di level controller.
4. **Security by Default.** Kredensial tidak boleh diekspos di response JSON. Validasi input wajib dilakukan sebelum data diproses ke database.
5. **Bahasa Penulisan:**
   - Nama file, variabel, function, class, interface, tipe data, dan komentar teknis ditulis dalam **Bahasa Inggris**.
   - Teks antarmuka pengguna (UI labels, tombol, pesan notifikasi, placeholder, validasi form) ditulis dalam **Bahasa Indonesia** yang komunikatif.
6. **Kebijakan Ikon (Tanpa Emoji):**
   - Dilarang menyisipkan emoji Unicode (seperti simbol emotikon atau status grafis Unicode) di dalam kode program, komentar, maupun commit message.
   - Gunakan ikon pack berbasis SVG (`lucide-react`) untuk elemen visual frontend.
   - Pada dokumentasi Markdown atau log teks, gunakan label semantik: `[SUKSES]`, `[GAGAL]`, `[PENDING]`, `[PERINGATAN]`.

---

## 1. Struktur Direktori & Konvensi Penamaan

### Struktur Monorepo:
```text
SkillSwap-Project/
├── apps/
│   ├── api/                  # Backend REST API
│   │   ├── prisma/           # schema.prisma, migration, seeder
│   │   └── src/
│   │       ├── config/       # Inisialisasi Prisma database client
│   │       ├── controllers/  # Request & Response HTTP handlers
│   │       ├── routes/       # Express route mapping
│   │       ├── services/     # Business logic & validasi data
│   │       ├── __tests__/    # Jest unit test suites
│   │       ├── app.ts        # Konfigurasi middleware Express
│   │       └── server.ts     # Entry point server listener
│   └── web/                  # Frontend SPA
│       └── src/
│           ├── components/   # UI reusable (Navbar, SkillBadge, Modal)
│           ├── pages/        # Views/Halaman utama (Dashboard, Explore, Profile, SwapRequests, Login)
│           ├── services/     # Axios API client functions
│           └── App.tsx       # Routing & session provider
└── packages/
    └── shared/               # Shared TypeScript models, enums, & DTOs
```

### Konvensi Penamaan:
- **PascalCase**: Nama class, model database, interface, enum, tipe DTO, komponen React (`Login.tsx`, `ConfirmDialog.tsx`), dan controller (`UserController.ts`).
- **camelCase**: Nama variabel, properti JSON, parameter function, method service (`createUser`, `getSwapRequests`).
- **kebab-case**: Nama folder non-source (`apps/api`, `apps/web`), nama package npm (`@skill-swap/api`), dan asset statis.
- **UPPER_SNAKE_CASE**: Nilai enum (`SkillType.HAVE`, `SwapStatus.ACCEPTED`) dan konstanta konfigurasi environment (`DATABASE_URL`, `PORT`).

---

## 2. Standar Backend (Node.js / Express / TypeScript / Prisma)

### 2.1 Format Response API Standar
Seluruh endpoint REST API wajib mengembalikan response JSON seragam:
```typescript
// Response Berhasil:
{
  "success": true,
  "data": { ... },
  "message": "Operasi berhasil dilakukan" // Opsional
}

// Response Gagal / Error:
{
  "success": false,
  "error": "Deskripsi pesan galat yang jelas"
}
```

### 2.2 Layering Architecture
1. **Routes (`routes/*.ts`)**: Hanya bertugas memetakan URL dan HTTP method ke controller yang bersangkutan.
2. **Controllers (`controllers/*.ts`)**: Mengambil data dari `req.body` / `req.params` / `req.query`, memanggil service, dan mengirim response status code yang tepat (`200`, `201`, `400`, `404`, `500`).
3. **Services (`services/*.ts`)**: Mengandung seluruh logika bisnis, validasi integritas aturan, dan query ke Prisma. Service **tidak boleh** mengakses objek Express `req` atau `res`.
4. **Config (`config/*.ts`)**: Menginisialisasi koneksi Prisma Client tunggal (*singleton*).

### 2.3 Keamanan Data Akun
- Setiap pendaftaran user baru (`createUser`) dan proses login (`loginUser`) wajib mengecualikan field `password` dari data yang dikembalikan ke controller:
  ```typescript
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
  ```

---

## 3. Standar Frontend (React / TypeScript / Tailwind CSS)

### 3.1 Komponen Fungsional
- Gunakan React Functional Components dengan TypeScript typing.
- Pisahkan komponen tampilan reusable ke folder `components/` dan halaman navigasi ke folder `pages/`.

### 3.2 Styling & Token Warna
- Gunakan utilitas Tailwind CSS tanpa inline styles acak.
- Warna semantik untuk Badge & Status:
  - **HAVE (Keahlian Dimiliki)**: Latar hijau lembut (`bg-green-100 text-green-800`).
  - **WANT (Keahlian Diinginkan)**: Latar biru lembut (`bg-blue-100 text-blue-800`).
  - **PENDING**: Kuning / Amber (`bg-yellow-100 text-yellow-800`).
  - **ACCEPTED**: Hijau (`bg-green-100 text-green-800`).
  - **REJECTED**: Merah (`bg-red-100 text-red-800`).
  - **COMPLETED**: Abu-abu netral (`bg-gray-100 text-gray-800`).

### 3.3 Penanganan Status Kosong & Loading
- Selalu sediakan fallback loading state (`Memuat...`) dan empty state (`EmptyState.tsx`) yang informatif bila koleksi data kosong.
- Tampilkan modal konfirmasi (`ConfirmDialog.tsx`) sebelum melakukan aksi destruktif seperti penghapusan keahlian.

---

## 4. Standar Pengujian (Unit Testing)

1. Semua unit test diletakkan di folder `apps/api/src/__tests__/`.
2. Gunakan `jest.mock('../config/database')` untuk mengisolasi layer basis data sehingga pengujian berjalan cepat tanpa dependensi server eksternal aktif.
3. Struktur penulisan test menggunakan `describe` dan `it` dengan kalimat penjelas berbahasa Indonesia yang mencerminkan *Acceptance Criteria*.
4. Setiap commit ke branch utama wajib memastikan `npm test` lolos dengan status **ALL PASSED**.

