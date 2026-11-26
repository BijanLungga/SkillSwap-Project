# Dokumentasi Arsitektur Folder & Kode SkillSwap

## 1. Ikhtisar Arsitektur Folder (Monorepo Decoupled)

Project **SkillSwap** menggunakan arsitektur **Modular Monorepo** berbasis `npm workspaces` dengan pembagian peran yang sangat tegas:

```text
SkillSwap-Project/
├── .github/                      # CI/CD Automation (GitHub Actions workflows)
│   └── workflows/
│       └── ci.yml                # Pipeline otomatis testing 252 UT pada tiap branch
├── apps/                         # Aplikasi mandiri yang dapat dijalankan (Deployable Apps)
│   ├── api/                      # Backend Service (Node.js, Express, TypeScript, Prisma)
│   └── web/                      # Frontend Application (React 18, Vite, Tailwind CSS)
├── packages/                     # Pustaka bersama (Shared Code & Types)
│   └── shared/                   # DTOs, Enums, Type Interfaces (Single Source of Truth)
├── docs/                         # Dokumentasi teknis, gaya kode, & DevLog
├── railway.json                  # Konfigurasi Cloud Container Deployment
└── package.json                  # Root orchestration & multi-package build scripts
```

---

## 2. Rincian Arsitektur Per Modul

### A. Backend (`apps/api/`) — Layered Architecture (N-Tier)
Backend dibangun menggunakan pola **Layered Architecture (Separation of Concerns)**:

```text
apps/api/src/
├── config/           # Konfigurasi singleton infrastruktur (Prisma Database Client)
├── routes/           # Endpoint URL mapping & HTTP method dispatcher (Express Router)
├── controllers/      # HTTP layer: Parsing request, parsing status code, format response
├── services/         # Core Business Logic: Validasi aturan bisnis, kalkulasi, kueri database
├── scripts/          # CLI tooling untuk developer (e.g., list-users)
├── __tests__/        # 11 Unit Test Suites (252 tests) untuk pengujian menyeluruh
├── app.ts            # Registrasi global middleware, CORS, & static serving SPA
└── server.ts         # Server HTTP listener & WebSocket push notification entry point
```

**Aliran Data (Request-Response Flow):**
$$\text{Client HTTP} \longrightarrow \text{Routes} \longrightarrow \text{Controllers} \longrightarrow \text{Services} \longrightarrow \text{Prisma ORM} \longrightarrow \text{MySQL}$$

---

### B. Frontend (`apps/web/`) — Feature & Component-Driven Architecture
Frontend menggunakan React 18 dengan pendekatan modular:

```text
apps/web/src/
├── components/       # Komponen UI modular & reusable (Navbar, Modal, Badge, Toast)
├── context/          # State management global (Auth sesi & WebSocket Notifications)
├── pages/            # View halaman utama aplikasi (Login, Dashboard, Profile, Explore, Swap)
├── services/         # HTTP Client (Axios wrapper untuk pemanggilan API)
├── App.tsx           # Router switcher & Application root provider
└── main.tsx          # React DOM entry point
```

---

### C. Shared Package (`packages/shared/`) — Single Source of Truth
Menyimpan definisi data bersama antar Frontend dan Backend agar tidak terjadi inkonsistensi tipe data:
- **DTOs (`ApiResponse`, `AuthResponse`)**: Standar format response JSON.
- **Enums (`SkillType`: HAVE/WANT, `SwapStatus`: PENDING/ACCEPTED/COMPLETED)**: Menjamin konsistensi state machine.
- **Interfaces (`User`, `Notification`, `Review`)**: Definisi kontrak tipe data bersama.

---

## 3. Alasan Memilih Arsitektur Folder Ini (Poin Presentasi Dosen)

Berikut adalah alasan teknis dan rasional kenapa memilih struktur folder ini:

### 1. Separation of Concerns (Pemisahan Tanggung Jawab)
- **Controller** hanya mengurusi protokol HTTP (`req` dan `res`), tidak boleh berisi kalkulasi bisnis rumit.
- **Service** hanya fokus pada logika bisnis murni dan manipulasi data. Hal ini membuat layer `Service` dapat diuji secara independen menggunakan Jest (**252 Unit Tests berjalan cepat dan terisolasi tanpa memerlukan server live**).

### 2. Single Source of Truth (Anti-Desinkronisasi Tipe Data)
- Dalam pengembangan full-stack TypeScript, sering terjadi ketidakcocokan tipe data antara data yang dikirim backend dan yang diterima frontend.
- Dengan adanya folder `packages/shared`, baik frontend maupun backend mengacu pada `interface` dan `enum` yang persis sama. Jika tipe status berubah, compiler TypeScript akan langsung memberi tahu error sebelum deploy.

### 3. Maintainability & Scalability (Mudah Dikembangkan Tim)
- Jika di masa depan ingin menambahkan aplikasi mobile (misal React Native) atau microservice baru, kita cukup menambahkannya di folder `apps/mobile` tanpa mengubah core logic dan shared types yang sudah ada.

### 4. Build & Deployment yang Bersih (Production-Ready)
- Menghindari kode frontend dan backend bercampur aduk dalam satu folder.
- Skrip root `package.json` dapat mengorkestrasi build berantai (`npm run build:api` dan `npm run build:web`) sehingga saat di-deploy ke Railway/VPS, sistem dapat menghasilkan artefak siap pakai yang efisien.
