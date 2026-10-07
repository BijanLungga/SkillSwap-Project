# RPL-Project
# SkillSwap - Platform Pertukaran Keahlian Antar-Pengguna (Peer-to-Peer)

**SkillSwap** adalah platform web responsif berbasis komunitas yang dirancang untuk menghubungkan individu yang ingin mempelajari keahlian baru dengan orang lain yang memiliki keahlian tersebut, melalui sistem barter atau pertukaran keterampilan secara langsung (peer-to-peer).

---

## Tema & Gambaran Umum

> **"Platform Web Responsif Berbasis Komunitas untuk Pertukaran Keahlian (Barter Skill) Antar-Pengguna Berdasarkan Minat dan Kebutuhan Spesifik"**

Projek ini dikembangkan sebagai solusi bagi individu yang ingin menguasai keterampilan baru (seperti bahasa asing, pemrograman, desain, atau musik) secara fleksibel tanpa memerlukan biaya finansial, melainkan dengan menukar keahlian yang mereka kuasai. Aplikasi ini difokuskan pada fitur-fitur inti (core features) yang realistis untuk diselesaikan dalam durasi **12 pertemuan pengembangan**.

---

## Deskripsi Masalah

* **Masalah Utama:** Banyak orang ingin mempelajari keterampilan baru (misalnya desain grafis, bahasa asing, atau editing video), namun terkendala biaya kursus yang mahal atau kesulitan menemukan mentor yang tepat dengan sistem pembelajaran dua arah yang setara.
* **Dampak:** Potensi pengembangan diri terhambat, sementara banyak individu yang memiliki keahlian tertentu tidak memiliki wadah untuk membagikannya sekaligus mendapatkan keahlian baru sebagai timbal balik.

---

## Profil Target Pengguna

* **Pengguna Utama:** Pelajar, Mahasiswa, Pekerja Lepas (Freelancer), dan Profesional Muda (Usia 18–30 tahun).
* **Kebutuhan:**
* Ingin belajar keahlian baru secara praktis tanpa biaya (free/barter).
* Membagikan keahlian yang sudah dikuasai untuk membantu orang lain sekaligus mengasah kemampuan diri.
* Menemukan partner tukar keahlian dengan kriteria jadwal dan minat yang cocok.


* **Karakteristik:** Aktif secara digital dan terbiasa menggunakan aplikasi antarmuka mobile-friendly dan web-responsive.

---

## Manfaat Aplikasi

1. **Bagi Pengguna:** Memfasilitasi pertukaran ilmu dan keterampilan secara gratis melalui konsep barter kemampuan (Skill A for Skill B).
2. **Bagi Komunitas:** Membangun ekosistem kolaboratif di mana setiap anggota dapat berperan sekaligus sebagai pelajar (learner) dan pengajar (mentor).

---

## Fitur Inti (Scope 12 Pertemuan)

| No | Fitur | Deskripsi |
| --- | --- | --- |
| 1 | **Autentikasi & Profil Pengguna** | Pendaftaran dan login akun sederhana (Email & Password), pengisian profil mencakup Nama, Bio, Skill I Have (Keahlian yang dimiliki), dan Skill I Want (Keahlian yang ingin dipelajari). |
| 2 | **Eksplorasi & Pencarian Pengguna/Keahlian** | Pencarian dan penyaringan (filtering) daftar pengguna lain berdasarkan keahlian yang mereka tawarkan atau yang sedang mereka cari. |
| 3 | **Manajemen Permintaan Pertukaran (Swap Request)** | Fitur untuk mengajukan permintaan tukar keahlian (Send Swap Request), serta menerima atau menolak permintaan dari pengguna lain. |
| 4 | **Sistem Ruang Obrolan Sederhana (Chat Room)** | Ruang diskusi berupa pesan teks sederhana untuk koordinasi internal antar-pengguna yang telah disetujui permintaannya (matched). |
| 5 | **Dashboard / Daftar Pertukaran Saya** | Halaman khusus yang menampilkan status koneksi/permintaan pertukaran (Pending, Disetujui, Selesai) beserta daftar riwayat partner skill swap. |

---

## Fitur yang Tidak Dikerjakan (Out of Scope)

Untuk memastikan proyek selesai tepat waktu dalam **12 kali pertemuan**, fitur-fitur berikut tidak termasuk dalam cakupan pengembangan:

1. **Panggilan Video / Live Class Bawaan:** Tidak menyediakan fitur video conference internal (proses belajar mengajar dilakukan via tautan eksternal seperti Zoom/Google Meet atau pertemuan langsung).
2. **Sistem Rating, Ulasan, & Gamifikasi (Badges):** Belum ada penilaian sistem reputasi, bintang, ulasan antar-pengguna, atau sistem leveling.
3. **Sistem Monetisasi / Dompet Digital:** Tidak ada transaksi pembayaran uang asli atau sistem koin/kredit berbayar (murni barter keahlian secara sukarela).
4. **Notifikasi Push (Push Notifications):** Tidak ada pengiriman notifikasi instan ke perangkat pengguna secara real-time (pembaruan status hanya terlihat di dalam web).
5. **Autentikasi Media Sosial / OAuth:** Login terbatas menggunakan akun lokal (Email & Password), tidak menggunakan Google/Facebook Sign-In.

---

## Kriteria Aplikasi Dinyatakan Berhasil

Aplikasi **SkillSwap** dinyatakan selesai dan sukses dikembangkan jika memenuhi kriteria berikut pada Pertemuan ke-12:

### 1. Fungsionalitas Utama (Core Flow) Berjalan Smooth

* [ ] Pengguna dapat mendaftar akun dan melengkapi profil keahlian yang dimiliki serta yang ingin dipelajari.
* [ ] Pengguna dapat mencari pengguna lain berdasarkan kategori keahlian tertentu.
* [ ] Pengguna dapat mengirim permintaan pertukaran (Swap Request), dan pengguna penerima dapat menyetujui atau menolaknya.
* [ ] Pengguna yang telah saling terhubung (matched) dapat mengirim dan membaca pesan teks di ruang obrolan (chat).

### 2. Keberhasilan Teknis

* [ ] Semua operasi CRUD (Create, Read, Update, Delete) pada data Profil Keahlian dan Permintaan Tukar berjalan tanpa galat.
* [ ] Pengujian dasar (Black Box Testing) mencatat tidak adanya critical bug pada alur utama pendaftaran hingga pengiriman pesan.

### 3. Pengujian Antarmuka (UI/UX)

* [ ] Antarmuka aplikasi dapat diakses secara responsif baik melalui desktop maupun perangkat mobile.

* [ ] Pengguna dapat mengatur profil keahlian dan mencari partner secara akurat.
* [ ] Alur permintaan tukar (Swap Request) dari pending hingga disetujui berjalan lancar.
* [ ] Fitur chat berfungsi dengan baik bagi pengguna yang telah terhubung.
* [ ] Seluruh operasi CRUD stabil tanpa critical bug pada pengujian dasar.







# SkillSwap - Platform Pertukaran Keahlian Peer-to-Peer

## 1. Tujuan, Teknologi, dan Aturan Kode

**Tujuan Aplikasi:**  
Menghubungkan individu yang ingin mempelajari keahlian baru dengan orang lain yang memiliki keahlian tersebut melalui sistem barter atau pertukaran keterampilan secara langsung (*peer-to-peer*) tanpa biaya finansial. Aplikasi memfasilitasi pengelolaan profil keahlian, pencarian partner, pengajuan permintaan tukar, dan komunikasi dasar antar-pengguna.

### Tech Stack
* **Frontend:** React + TypeScript + Vite + Tailwind CSS   
* **Backend:** Node.js + TypeScript + Express   
* **Database:** MySQL   
* **ORM:** Prisma   
* **API Style:** REST API   
* **Real-time (Opsional):** REST API dengan *polling* atau *refresh* sederhana untuk *chat* agar lebih efisien dan mudah diselesaikan dalam 12 pertemuan.
* **Deployment/Local Env:** Docker Compose untuk Database   
* **Config:** `.env.example` untuk URL database dan *environment variables*

### Aturan Kode
* Jangan tambahkan komentar kecuali sangat diperlukan untuk logika yang rumit.   
* Gunakan `PascalCase` untuk *classes*, *types*, *interfaces*, *enums*, komponen React, model database, dan API DTOs.   
* Gunakan `camelCase` untuk variabel lokal dan properti JSON.   
* Jaga panjang baris kode di bawah 150 karakter.   
* Gunakan struktur folder yang bersih, sederhana, dan modular.   
* Gunakan bahasa Indonesia untuk semua label UI, tombol, pesan, dan validasi di frontend.

---

## 2. Entitas Utama & Aturan Database

### Entitas Utama
1. **User (Pengguna)**
   * Id
   * Name
   * Email
   * Bio
   * CreatedAt

2. **UserSkill (Keahlian Pengguna)**
   * Id
   * UserId
   * SkillName
   * SkillType (`HAVE` atau `WANT`)
   * CreatedAt

3. **SwapRequest (Permintaan Pertukaran)**
   * Id
   * SenderId
   * ReceiverId
   * Status (`PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`)
   * Message
   * CreatedAt

4. **ChatMessage (Pesan Obrolan)**
   * Id
   * SwapRequestId
   * SenderId
   * MessageText
   * CreatedAt

### Aturan Database
* Sebuah `SwapRequest` harus unik antara pasangan pengirim dan penerima yang aktif guna menghindari duplikasi permintaan ganda yang belum selesai.
* Jangan pernah menghapus data riwayat *swap request* atau obrolan yang sudah tersimpan (*keep history*).
* Gunakan migrasi Prisma (*Prisma Migrations*) dan sediakan *seed data* contoh pengguna awal beserta daftar keahlian mereka (`HAVE` & `WANT`).

---

## 3. Fitur Backend

1. **CRUD User & Profil Keahlian**
   * Endpoint untuk pendaftaran/pembuatan profil pengguna, mengambil detail pengguna, memperbarui profil, serta menambah atau menghapus data keahlian (`Skill I Have` & `Skill I Want`).

2. **Eksplorasi & Pencarian Partner**
   * Endpoint pencarian dan filter daftar pengguna lain berdasarkan keahlian yang mereka tawarkan (`Skill I Have`) atau keahlian yang sedang mereka cari (`Skill I Want`).

3. **Manajemen Swap Request**
   * Endpoint untuk mengirim permintaan tukar keahlian baru (`POST /api/swap-requests`), mengambil daftar permintaan masuk/keluar, serta memperbarui status permintaan menjadi `ACCEPTED`, `REJECTED`, atau `COMPLETED` (`PUT /api/swap-requests/:Id`).

4. **Sistem Chat Internal**
   * Endpoint untuk mengirim pesan teks (`POST /api/swap-requests/:Id/messages`) dan mengambil riwayat pesan (`GET /api/swap-requests/:Id/messages`) di dalam sesi pertukaran yang statusnya sudah disetujui (`ACCEPTED`).

5. **Dashboard API**
   * Endpoint yang mengembalikan ringkasan data pengguna (total keahlian terdaftar, total permintaan aktif, dan status koneksi partner).

---

## 4. Fitur Frontend & Halaman

1. **Dashboard**
   * Ringkasan statistik (total keahlian terdaftar, total permintaan aktif, sesi pertukaran berjalan).
   * Daftar rekomendasi partner potensial berdasarkan kecocokan keahlian (*Skill Match*).

2. **Manajemen Profil & Keahlian**
   * Formulir untuk mengubah data diri, bio, serta menambah atau menghapus daftar keahlian yang dikuasai (*Skill I Have*) dan yang ingin dipelajari (*Skill I Want*).

3. **Eksplorasi Partner**
   * Halaman pencarian dan filter pengguna lain berdasarkan kategori keahlian.
   * Tombol: `Kirim Permintaan Tukar (Swap Request)`.

4. **Manajemen Swap Request & Chat**
   * Daftar status permintaan pertukaran (Pending, Disetujui, Ditolak, Selesai).
   * Ruang obrolan sederhana (*chat room*) bagi pengguna yang sudah terhubung untuk koordinasi jadwal belajar.

5. **Persyaratan UI:**
   * Menggunakan **Bahasa Indonesia** untuk seluruh label, tombol, pesan, dan validasi.
   * Menggunakan lencana status (*badge*) dengan warna: 
     * Disetujui / Aktif: Hijau
     * Menunggu / Pending: Kuning / Oranye
     * Ditolak / Selesai: Merah / Abu-abu
   * Desain responsif (*desktop* dan *mobile*), tabel sederhana, kartu (*cards*), dialog konfirmasi sebelum menghapus data, dan *empty states*.

---

## 5. Rute API yang Dibutuhkan

* `GET /api/users`
* `POST /api/users`
* `GET /api/users/:Id`
* `PUT /api/users/:Id`
* `GET /api/users/:Id/skills`
* `POST /api/users/:Id/skills`
* `DELETE /api/skills/:Id`
* `GET /api/explore`
* `GET /api/swap-requests`
* `POST /api/swap-requests`
* `PUT /api/swap-requests/:Id`
* `GET /api/swap-requests/:Id/messages`
* `POST /api/swap-requests/:Id/messages`
* `GET /api/dashboard`

---

## 6. Struktur Monorepo & Deliverables

### Struktur Monorepo (TypeScript + npm workspaces)
```text
skill-swap/
  apps/
    web/
    api/
  packages/
    shared/
* [ ] Antarmuka dapat diakses secara responsif baik via desktop maupun mobile.
