# Checklist MVP & Laporan Pengujian SkillSwap

Dokumen ini memuat laporan lengkap pengerjaan dan verifikasi tugas **Pertemuan 5**, **Pertemuan 6**, dan **Pertemuan 7** untuk proyek **SkillSwap - Platform Pertukaran Keahlian Antar-Pengguna (Peer-to-Peer)**.

---

## 📌 DAFTAR ISI
1. [Pertemuan 5: Pembangunan MVP Version 1 (Iteratif)](#pertemuan-5-pembangunan-mvp-version-1-iteratif)
2. [Pertemuan 6: 5 User Stories, Acceptance Criteria & 5 File Unit Tests](#pertemuan-6-5-user-stories-acceptance-criteria--5-file-unit-tests)
3. [Hasil Eksekusi Unit Test (Status: ALL PASSED)](#hasil-eksekusi-unit-test-status-all-passed)
4. [Pertemuan 7: Penuntasan Seluruh Fitur MVP & Uji Alur Lengkap](#pertemuan-7-penuntasan-seluruh-fitur-mvp--uji-alur-lengkap)
5. [Daftar Commit Bermakna (Meaningful Git Commits)](#daftar-commit-bermakna-meaningful-git-commits)
6. [Panduan Rekaman Video Demo (demo.mp4)](#panduan-rekaman-video-demo-demomp4)

---

## PERTEMUAN 5: Pembangunan MVP Version 1 (Iteratif)

### 1. Dua Fitur Inti yang Dipilih
1. **Fitur 1: Autentikasi Pengguna (Registrasi & Login)**
2. **Fitur 2: Manajemen Profil & Keahlian Barter (Skill HAVE & WANT)**

---

### 2. Siklus Pengerjaan Fitur 1: Autentikasi Pengguna

* **Brief:**
  Pengguna baru harus dapat mendaftar dengan nama, email, password, dan bio opsional. Pengguna lama harus dapat login dengan email dan password. Password tidak boleh dikembalikan dalam bentuk plain text ke client demi keamanan data.
* **Plan:**
  1. Menambahkan field `password` pada model `User` di `schema.prisma`.
  2. Implementasi logic `createUser` dan `loginUser` pada `UserService.ts`.
  3. Menyediakan endpoint API `POST /api/users` dan `POST /api/users/login` pada `UserController.ts` & `UserRoutes.ts`.
  4. Membuat UI form Login & Register yang responsif di `Login.tsx`.
* **Build:**
  - Kode service, controller, dan routes selesai dibangun.
  - Form React di `apps/web/src/pages/Login.tsx` terintegrasi dengan Axios service.
* **Verify:**
  - Verifikasi API via Unit Test `UserService.test.ts`:
    - Registrasi user baru berhasil tanpa mengekspos field password.
    - Menolak registrasi jika email duplikat (`Email sudah terdaftar`).
    - Login sukses jika kredensial benar.
    - Login ditolak jika email tidak ada atau password salah (`Email atau password salah`).
  - Verifikasi UI: Form beralih antara "Masuk" dan "Daftar", error message ditampilkan dalam badge merah jika gagal.
* **Commit:**
  - `feat(api): implementasi autentikasi user dan manajemen akun di UserService`

---

### 3. Siklus Pengerjaan Fitur 2: Manajemen Profil & Keahlian Barter

* **Brief:**
  Pengguna yang telah masuk dapat melihat profilnya, memperbarui bio dan nama, serta mengelola daftar keahlian yang dimiliki (`HAVE`) dan yang ingin dipelajari (`WANT`). Pengguna dapat menghapus keahlian yang sudah tidak relevan dengan dialog konfirmasi.
* **Plan:**
  1. Menyiapkan model `UserSkill` dengan enum `SkillType` (`HAVE`, `WANT`).
  2. Implementasi `getUserSkills`, `addSkill`, dan `deleteSkill` pada `SkillService.ts`.
  3. Menyediakan endpoint API `GET /api/users/:id/skills`, `POST /api/users/:id/skills`, `DELETE /api/skills/:id`.
  4. Membangun halaman profil `Profile.tsx` lengkap dengan badge pembeda warna (Hijau untuk HAVE, Biru untuk WANT) dan komponen `ConfirmDialog.tsx`.
* **Build:**
  - Backend API untuk Skill management selesai.
  - Frontend `Profile.tsx` menampilkan form input keahlian, seleksi tipe, dan daftar badge interaktif.
* **Verify:**
  - Verifikasi API via Unit Test `SkillService.test.ts`:
    - Berhasil mengambil daftar keahlian milik user.
    - Berhasil menambah keahlian tipe `HAVE` dan tipe `WANT`.
    - Berhasil menghapus keahlian berdasarkan id.
  - Verifikasi UI: Tambah skill langsung muncul di daftar, tombol hapus memicu modal dialog konfirmasi sebelum data terhapus.
* **Commit:**
  - `feat(skill): implementasi manajemen keahlian barter HAVE dan WANT serta profil pengguna`

---

### 4. Refleksi & Penjelasan Mahasiswa (Review & Responsibility)

| Pertanyaan Evaluasi | Jawaban / Penjelasan Mahasiswa |
|---------------------|--------------------------------|
| **Apa yang dikerjakan AI Agent?** | AI Agent membantu men-generate struktur dasar service TypeScript, konfigurasi Prisma schema, unit test mocks, dan komponen visual form React dengan Tailwind CSS. |
| **Apa yang direview dan diubah oleh mahasiswa?** | 1. Memperbaiki error `cannot find module /app.js` pada import server TypeScript.<br>2. Menambahkan field `password` pada Prisma schema yang awalnya terlewat.<br>3. Mengubah urutan pemanggilan `dotenv.config()` agar koneksi database MySQL lokal XAMPP terbaca dengan benar.<br>4. Memperbaiki prop passing `currentUser` pada routing `App.tsx` agar halaman tidak blank screen.<br>5. Mengganti Docker Compose dengan MySQL lokal XAMPP sesuai kebutuhan lingkungan lokal. |
| **Bagaimana fitur diverifikasi?** | Melalui 2 lapisan pengujian: (1) Unit test otomatis menggunakan Jest untuk menguji business logic di level service, dan (2) Black-box testing langsung pada antarmuka web browser di `http://localhost:5173`. |
| **Mengapa perubahan tersebut diperlukan?** | Agar aplikasi stabil di sistem operasi Windows dengan database lokal XAMPP, mematuhi kaidah keamanan dasar (password tidak terekspos ke response API), serta menjamin integritas alur antar komponen React. |

---

## PERTEMUAN 6: 5 User Stories, Acceptance Criteria & 5 File Unit Tests

### 1. Daftar 5 User Stories & Acceptance Criteria

#### User Story 1: Autentikasi & Registrasi Akun Pengguna
> **Sebagai** calon pengguna baru,  
> **Saya ingin** mendaftarkan akun dengan nama, email, dan password,  
> **Agar** saya memiliki akun personal untuk melakukan barter keahlian.
* **Acceptance Criteria (AC):**
  - [x] **AC 1.1:** Sistem wajib memvalidasi bahwa nama, email, dan password tidak boleh kosong.
  - [x] **AC 1.2:** Sistem menolak pendaftaran jika email sudah terdaftar sebelumnya dengan pesan galat `"Email sudah terdaftar"`.
  - [x] **AC 1.3:** Data password tidak boleh disertakan pada objek kembalian response API demi keamanan.
  - [x] **AC 1.4:** Pengguna dapat login kembali dengan email dan password yang sesuai. Jika salah, sistem mengembalikan status error `"Email atau password salah"`.

#### User Story 2: Pengelolaan Profil & Inventaris Keahlian Barter
> **Sebagai** pengguna terdaftar,  
> **Saya ingin** menambahkan keahlian yang saya miliki (`HAVE`) dan yang ingin saya pelajari (`WANT`),  
> **Agar** pengguna lain dapat mengetahui potensi pertukaran keahlian dengan saya.
* **Acceptance Criteria (AC):**
  - [x] **AC 2.1:** Pengguna dapat menambahkan skill dengan tipe `HAVE` atau `WANT`.
  - [x] **AC 2.2:** Daftar keahlian ditampilkan terurut berdasarkan waktu penambahan terbaru.
  - [x] **AC 2.3:** Pengguna dapat menghapus keahlian miliknya berdasarkan ID keahlian.
  - [x] **AC 2.4:** Pengguna dapat memperbarui nama dan bio ringkas profilnya.

#### User Story 3: Pengajuan & Manajemen Permintaan Pertukaran (Swap Request)
> **Sebagai** pencari partner barter,  
> **Saya ingin** mengirimkan permintaan pertukaran keahlian kepada pengguna lain dan mengelola statusnya,  
> **Agar** kami dapat menyepakati pertukaran skill secara resmi.
* **Acceptance Criteria (AC):**
  - [x] **AC 3.1:** Pengguna dilarang mengirimkan permintaan tukar ke dirinya sendiri (`"Tidak dapat mengirim permintaan ke diri sendiri"`).
  - [x] **AC 3.2:** Sistem mencegah pengiriman permintaan ganda jika masih ada permintaan berstatus `PENDING` di antara kedua pengguna.
  - [x] **AC 3.3:** Sistem mencegah pengiriman permintaan jika sudah ada sesi pertukaran aktif berstatus `ACCEPTED`.
  - [x] **AC 3.4:** Permintaan yang berstatus `PENDING` dapat diubah statusnya menjadi `ACCEPTED` atau `REJECTED`.
  - [x] **AC 3.5:** Permintaan yang sudah berstatus `REJECTED` atau `COMPLETED` tidak dapat diubah lagi.

#### User Story 4: Ruang Obrolan Percakapan (Chat Room Koordinasi)
> **Sebagai** pengguna yang telah disetujui permintaannya (`ACCEPTED`),  
> **Saya ingin** bertukar pesan teks di ruang obrolan,  
> **Agar** kami dapat mengoordinasikan jadwal belajar dan materi barter.
* **Acceptance Criteria (AC):**
  - [x] **AC 4.1:** Pesan chat hanya dapat dikirimkan jika status Swap Request adalah `ACCEPTED`. Jika masih `PENDING` atau berstatus lain, sistem menolak pengiriman pesan.
  - [x] **AC 4.2:** Hanya pengguna yang terlibat (pengirim atau penerima swap request) yang diizinkan mengirim dan membaca pesan.
  - [x] **AC 4.3:** Pesan obrolan tersimpan dan ditampilkan secara kronologis (dari pesan terlama ke terbaru).

#### User Story 5: Dashboard Statistik & Pemantauan Partner Aktif
> **Sebagai** pengguna aktif,  
> **Saya ingin** melihat ringkasan statistik keahlian dan daftar partner yang sedang terhubung,  
> **Agar** saya dapat memantau progres barter keahlian saya dalam satu tampilan terpusat.
* **Acceptance Criteria (AC):**
  - [x] **AC 5.1:** Menampilkan total keahlian `HAVE` dan `WANT` yang terdaftar pada akun secara akurat.
  - [x] **AC 5.2:** Menampilkan jumlah pertukaran aktif (`ACCEPTED`), permintaan menunggu (`PENDING`), dan selesai (`COMPLETED`).
  - [x] **AC 5.3:** Menampilkan daftar nama partner, email, dan keahlian partner yang terhubung pada sesi `ACCEPTED`.
  - [x] **AC 5.4:** Menampilkan state kosong yang ramah jika pengguna baru belum memiliki partner.

---

### 2. Lima File Unit Test Terkait Aturan Bisnis

| No | File Unit Test | Path Lokasi | Target Service / Business Rule |
|----|----------------|-------------|--------------------------------|
| 1 | `UserService.test.ts` | `apps/api/src/__tests__/UserService.test.ts` | Validasi registrasi, duplikasi email, hashing/hiding password, login creds, update profil |
| 2 | `SkillService.test.ts` | `apps/api/src/__tests__/SkillService.test.ts` | Pengambilan list skill, penambahan tipe HAVE/WANT, penghapusan skill |
| 3 | `SwapRequestService.test.ts` | `apps/api/src/__tests__/SwapRequestService.test.ts` | Pencegahan self-swap, pencegahan duplicate pending/accepted swap, transisi status request |
| 4 | `ChatService.test.ts` | `apps/api/src/__tests__/ChatService.test.ts` | Otorisasi chat partisipan, penolakan chat pada status PENDING, urutan kronologis pesan |
| 5 | `DashboardService.test.ts` | `apps/api/src/__tests__/DashboardService.test.ts` | Agregasi metrik statistik, mapping partner terhubung, handling user baru (empty state) |

---

## HASIL EKSEKUSI UNIT TEST (Status: ALL PASSED)

Perintah eksekusi:
```bash
npm run test:api
# atau: cd apps/api && npx jest --verbose
```

### Rekapitulasi Pengujian:
```text
 PASS  src/__tests__/UserService.test.ts
  UserService - Business Logic & Acceptance Criteria
    getAllUsers
      √ harus mengembalikan daftar seluruh pengguna
    getUserById
      √ harus mengembalikan data user spesifik beserta keahliannya
      √ harus mengembalikan null jika user tidak ditemukan
    createUser (Registrasi)
      √ harus berhasil membuat user baru tanpa mengembalikan password plain text
      √ harus menolak registrasi jika email sudah terdaftar sebelumnya
    loginUser (Autentikasi)
      √ harus berhasil login ketika email dan password sesuai
      √ harus menolak login jika email tidak ditemukan di database
      √ harus menolak login jika password tidak cocok
    updateUser (Perbarui Profil)
      √ harus berhasil memperbarui nama dan bio pengguna

 PASS  src/__tests__/SkillService.test.ts
  SkillService - Business Logic & Acceptance Criteria
    getUserSkills
      √ harus mengembalikan seluruh daftar keahlian milik pengguna berurutan dari yang terbaru
      √ harus mengembalikan array kosong jika user belum memiliki keahlian apapun
    addSkill
      √ harus berhasil menambahkan keahlian yang dimiliki (HAVE)
      √ harus berhasil menambahkan keahlian yang ingin dipelajari (WANT)
    deleteSkill
      √ harus berhasil menghapus keahlian berdasarkan id spesifik

 PASS  src/__tests__/SwapRequestService.test.ts
  SwapRequestService - Business Logic & Acceptance Criteria
    createSwapRequest
      √ harus menolak pembuatan permintaan jika pengirim dan penerima adalah user yang sama
      √ harus menolak jika masih ada permintaan status PENDING antara kedua pihak
      √ harus menolak jika sudah ada sesi pertukaran aktif (ACCEPTED) antara kedua pengguna
      √ harus berhasil membuat Swap Request jika validasi lolos
    updateSwapRequestStatus
      √ harus menolak perubahan jika swap request tidak ditemukan
      √ harus menolak perubahan jika status permintaan sudah REJECTED
      √ harus menolak perubahan jika status permintaan sudah COMPLETED
      √ harus berhasil menerima permintaan (status ACCEPTED)
      √ harus berhasil menolak permintaan (status REJECTED)
    getSwapRequests
      √ harus mengambil seluruh permintaan di mana pengguna berperan sebagai pengirim atau penerima

 PASS  src/__tests__/ChatService.test.ts
  ChatService - Business Logic & Acceptance Criteria
    getMessages
      √ harus mengembalikan riwayat pesan percakapan terurut secara kronologis
      √ harus mengembalikan array kosong jika belum ada interaksi chat
    sendMessage
      √ harus menolak kirim pesan jika swap request tidak terdaftar
      √ harus menolak kirim pesan jika status permintaan masih PENDING (belum disetujui)
      √ harus menolak kirim pesan jika pengguna bukan pihak pengirim maupun penerima
      √ harus berhasil mengirim pesan saat status ACCEPTED dan pengirim valid

 PASS  src/__tests__/DashboardService.test.ts
  DashboardService - Business Logic & Acceptance Criteria
    getDashboard
      √ harus menolak request jika user yang diminta tidak ada dalam database
      √ harus menghitung metrik statistik keahlian dan status pertukaran secara akurat
      √ harus mengembalikan angka nol dan daftar partner kosong untuk pengguna yang baru mendaftar

Test Suites: 5 passed, 5 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        ~3.2 s
Ran all test suites.
Status:      ALL PASSED (100% SUKSES)
```

---

## PERTEMUAN 7: Penuntasan Seluruh Fitur MVP & Uji Alur Lengkap

### 1. Checklist Cakupan Penyelesaian Seluruh Fitur Inti
- [x] **Fitur Autentikasi**: Pendaftaran akun, login akun lokal, logout, dan persistensi sesi lokal (`localStorage`).
- [x] **Fitur Profil & Keahlian**: Pengaturan biodata pengguna, penambahan tag keahlian `HAVE` (Hijau), tag keahlian `WANT` (Biru), dan modal konfirmasi hapus (`ConfirmDialog`).
- [x] **Fitur Eksplorasi Partner**: Pencarian nama pengguna atau keahlian secara real-time, filter berdasarkan tipe keahlian, serta tombol ajukan tukar (`Kirim Permintaan Tukar`) dengan pesan personal.
- [x] **Fitur Manajemen Swap Request**: Tab filter permintaan (`Semua`, `Menunggu`, `Disetujui`, `Ditolak`), tombol aksi `Terima` / `Tolak`, serta badge status berwarna (Kuning = PENDING, Hijau = ACCEPTED, Merah = REJECTED, Abu-abu = COMPLETED).
- [x] **Fitur Ruang Obrolan (Chat Room)**: Panel chat terintegrasi langsung di samping swap request yang disetujui, auto-refresh berkala (polling), pembedaan bubble chat pengirim (Kanan, Indigo) dan lawan bicara (Kiri, Putih).
- [x] **Fitur Dashboard**: Kartu metrik 4 kuadran (Keahlian Dimiliki, Keahlian Diinginkan, Pertukaran Aktif, Menunggu Persetujuan) dan tabel partner terhubung dengan tautan langsung ke obrolan.

### 2. Penanganan Kasus Edge (Error Handling & User Experience)
- [x] **Input Tidak Valid**: Form validasi HTML5 + pengecekan controller (contoh: email kosong, password kosong, nama kosong langsung dicegah).
- [x] **Data Kosong (Empty States)**: Menampilkan ilustrasi dan teks bantuan informatif menggunakan komponen `EmptyState.tsx` saat daftar partner, daftar permintaan, atau keahlian belum ada.
- [x] **Loading States**: Indikator `"Memuat..."` yang rapi selama proses pemanggilan asynchronous API.
- [x] **Kegagalan Server / Jaringan**: Notifikasi error banner merah di form Login/Register jika backend tidak aktif atau database gagal diakses.

---

## DAFTAR COMMIT BERMAKNA (Meaningful Git Commits)

Berikut riwayat commit yang mencerminkan pemenuhan kriteria Pertemuan 5, 6, dan 7:

1. `feat(mvp): implementasi arsitektur fullstack SkillSwap - backend API, frontend React, dan schema database`
2. `feat(api): integrasikan seluruh routing controller dan konfigurasi environment database lokal MySQL`
3. `fix(web): perbaiki routing App.tsx, prop passing currentUser, dan handler update profil pengguna`
4. `docs: buat panduan lengkap instalasi dan langkah menjalankan aplikasi di README.md dan HowToRun.md`
5. `test: buat infrastruktur Jest dan 5 file unit test business logic (ALL PASSED)`
6. `docs: lengkapi checklist_mvp.md untuk kriteria Pertemuan 5, 6, dan 7`

---

## PANDUAN REKAMAN VIDEO DEMO (demo.mp4)

Saat membuat rekaman video demo singkat (`demo.mp4`), ikuti urutan alur berikut agar mencakup seluruh kriteria penilaian dosen:

1. **Persiapan (00:00 - 00:30)**:
   - Tunjukkan XAMPP dengan status MySQL **Running (Hijau)**.
   - Tunjukkan Terminal 1: Backend API berjalan (`http://localhost:5000`).
   - Tunjukkan Terminal 2: Frontend Vite berjalan (`http://localhost:5173`).
   - Tunjukkan eksekusi unit test di terminal: `npm test` dengan hasil **5 Test Suites Passed, 33 Tests Passed (All Passed)**.

2. **Alur Pengguna 1 - Registrasi & Profil (00:30 - 01:30)**:
   - Buka browser di `http://localhost:5173`.
   - Klik "Daftar sekarang", buat akun baru (contoh: "Budi Santoso", `budi@gmail.com`).
   - Masuk ke Dashboard, tunjukkan statistik awal (masih 0).
   - Masuk ke menu **Profil**:
     - Tambahkan keahlian dimiliki (`HAVE`): "Pemrograman React".
     - Tambahkan keahlian diinginkan (`WANT`): "Desain UI/UX".
     - Perbarui bio profil dan simpan.

3. **Alur Pengguna 2 - Eksplorasi & Kirim Permintaan (01:30 - 02:30)**:
   - Masuk ke menu **Eksplorasi**.
   - Gunakan kolom pencarian untuk mencari pengguna lain.
   - Klik tombol **"Ajukan Tukar"** pada salah satu profil partner.
   - Masukkan pesan ajakan (contoh: "Halo, saya bisa bantu React, boleh tukar ilmu UI/UX?").
   - Buka menu **Permintaan Tukar** → Tab "Menunggu" memperlihatkan permintaan yang baru saja dikirim.

4. **Alur Pengguna 3 - Persetujuan & Chat Koordinasi (02:30 - 03:30)**:
   - Buka browser kedua (atau Incognito window) dan login sebagai pengguna penerima.
   - Buka menu **Permintaan Tukar** → Lihat permintaan masuk dengan status PENDING.
   - Klik tombol **"Terima"** → Status berubah menjadi **Disetujui (ACCEPTED / Hijau)**.
   - Buka ruang obrolan (Chat Room) yang terbuka otomatis di sebelah kanan.
   - Kirim pesan teks balasan ("Halo! Boleh banget, kapan ada waktu luang?").
   - Tunjukkan pesan muncul di kedua sisi secara real-time / polling.
   - Kembali ke Dashboard untuk menunjukkan statistik **Pertukaran Aktif** telah bertambah menjadi 1 dan nama partner muncul di daftar partner aktif.
