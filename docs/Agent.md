# AGENT.md — Panduan AI Agent untuk Proyek SkillSwap

Dokumen ini dibaca oleh **AI coding agent apa pun** (Claude Code, Cursor, GitHub Copilot Chat/Agent, Codex, Windsurf, Gemini CLI, Antigravity, dll.) sebelum mengerjakan task di repo ini. Tujuannya: hasil kerja tetap konsisten meskipun dikerjakan lintas model atau sesi yang berbeda-beda.

> **Urutan baca wajib bagi agent:** `AGENT.md` (dokumen ini) → `docs/Coding_Style.md` → `docs/Logging.md` → baru mulai kerja.

---

## 1. Konteks Proyek (Ringkas)

- **Nama Proyek:** SkillSwap — Platform Pertukaran Keahlian Antar-Pengguna (Peer-to-Peer).
- **Domain:** Komunitas edukasi, barter keterampilan mandiri, pencocokan partner (*skill matching*), koordinasi jadwal belajar.
- **Tech Stack:**
  - **Backend:** Node.js, Express, TypeScript, Prisma ORM, MySQL (XAMPP).
  - **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons.
  - **Shared Types:** TypeScript workspace monorepo (`packages/shared`).
  - **Testing:** Jest, ts-jest (5 Test Suites, 33 Unit Tests, All Passed).
- **Arsitektur:** Monorepo dengan npm workspaces (`apps/api`, `apps/web`, `packages/shared`).
- Detail lengkap requirement dan kriteria keberhasilan ada di `docs/ide_proyek.md` dan `checklist_mvp.md`.

---

## 2. Aturan Main (Berlaku untuk Semua Agent, Model Apa Pun)

1. **Baca sebelum menulis.** Jangan generate ulang file yang sudah ada tanpa membaca isinya terlebih dahulu. Jangan berasumsi letak file atau nama function — selalu periksa langsung di direktori kerja.
2. **Ikuti `docs/Coding_Style.md` secara ketat.** Penamaan file, layering backend (`routes → controllers → services → config`), format response REST API (`{ success, data, error, message }`), dan konvensi penamaan Prisma wajib konsisten.
3. **Jangan hardcode credential atau database secret.** Gunakan `apps/api/.env` dan template `apps/api/.env.example` untuk konfigurasi environment (`PORT`, `DATABASE_URL`).
4. **Patuhi aturan keamanan data pengguna.** Jangan pernah menyertakan plain text password pada response API `createUser`, `loginUser`, atau endpoint profil.
5. **Jaga integritas database relational.** Relasi penghapusan memakai `Cascade` hanya bila didefinisikan di `schema.prisma`. Jangan lakukan hard delete pada riwayat obrolan atau pertukaran yang sudah memiliki histori.
6. **Validasi aturan bisnis di layer service.**
   - Larangan permintaan barter ke akun sendiri.
   - Larangan duplikasi permintaan pending atau accepted.
   - Otorisasi pengiriman pesan chat hanya untuk swap berstatus `ACCEPTED` dan anggota yang sah.
7. **Dilarang merusak test suite yang sudah ada.** Setiap penambahan atau perubahan fitur wajib menjaga status unit test tetap **ALL PASSED**. Jalankan `npm test` sebelum menganggap tugas selesai.
8. **Dilarang menggunakan emoji Unicode** di dalam kode program, nama variabel, komentar teknis, log `docs/DevLog.md`, commit message, maupun teks UI. Gunakan teks semantik (`[SUKSES]`, `[GAGAL]`, `[PENDING]`) atau ikon SVG Lucide.
9. **Kewajiban Logging.** Setiap sesi pengerjaan fitur baru, perbaikan bug, atau refactor wajib dicatat di `docs/DevLog.md` mengikuti format `docs/Logging.md`.

---

## 3. Alur Kerja Standar per Task

1. **Pahami task**: Baca requirement, acceptance criteria terkait, dan periksa kode yang sudah ada.
2. **Rencanakan singkat**: Tentukan berkas yang akan dibuat atau diubah, dampak ke database atau endpoint API.
3. **Implementasi kode**: Tulis kode bersih, terstruktur, mengikuti `docs/Coding_Style.md`.
4. **Verifikasi & Uji**:
   - Jalankan `npm test` untuk memastikan semua unit test lulus.
   - Verifikasi tidak ada error kompilasi TypeScript atau linting.
5. **Catat ke DevLog**: Tambahkan entri baru di paling atas file `docs/DevLog.md`.
6. **Commit & Push**: Buat Git commit dengan pesan ringkas, jelas, dan bermakna.

---

## 4. Identitas Agent

Setiap agent yang menyelesaikan sesi pekerjaan wajib mencantumkan identitas model AI yang digunakan pada kolom `Agent` di `docs/DevLog.md` (misalnya `Gemini 3.8 Flash`, `Claude Sonnet 4.6`, `GPT-OSS 120B`).

