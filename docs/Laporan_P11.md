# Laporan Praktikum Pertemuan 11 (P11)

**Topik:** Software Release Management, Branching Workflow, & CI/CD Automated Testing  
**Nama Mahasiswa:** Bijan Lungga Bhasmara  
**NIM:** 2510101028  
**Aplikasi:** SkillSwap (Peer-to-Peer Skill Barter Platform)  
**Repository:** https://github.com/BijanLungga/SkillSwap-Project  

---

## 1. Struktur Branching Git (v1.0, v1.0_dev, v1.1)

```text
PS D:\Semester 3\RPL> git --no-pager branch -a
  main
  v1.0
* v1.0_dev
  v1.1
```

- **`v1.0`** : Branch base release / versi stabil awal aplikasi.
- **`v1.0_dev`** : Branch aktif pengembangan fitur baru, fixing bug, dan penambahan suite 252 Unit Test (UT).
- **`v1.1`** : Branch rilis pembaruan (*next release*) setelah seluruh pengujian pada `v1.0_dev` lolos uji.

---

## 2. Bukti Pengujian & Penjelasan Skenario

### A. Skenario Unit Test FAILED (Simulasi Error)

```text
RUNS  src/__tests__/UserService.test.ts
Test Suites: 1 failed, 10 passed, 11 total
Tests:       1 failed, 251 passed, 252 total
Snapshots:   0 total
Time:        4.256 s, estimated 9 s
```

- **Deskripsi:** Menunjukkan simulasi kegagalan pada branch `v1.0_dev`, di mana terdapat 1 unit test yang sengaja dibuat gagal dari total 252 tests.
- **Efek Terhadap Sistem (Poin Inti Jawaban Tugas):**
  1. **Otomatis Menghentikan Pipeline (Build Abort):** Sistem CI (GitHub Actions) mendeteksi kode galat (*exit code non-zero*), sehingga status build otomatis menjadi **Merah / FAILED** (tanda silang X).
  2. **Membatalkan Proses Deploy (Prevent Deployment):** Karena tahap pengujian gagal, proses auto-deploy ke cloud hosting (Railway) dibatalkan secara otomatis.
  3. **Lingkungan Produksi Tetap Aman (Zero-Downtime Protection):** Aplikasi yang sedang diakses pengguna/reviewer di internet tidak akan terpengaruh atau mengalami crash, karena server tetap menjalankan versi stabil sebelumnya.

---

### B. Skenario Unit Test ALL PASSED (Hijau)

```text
Test Suites: 11 passed, 11 total
Tests:       252 passed, 252 total
Snapshots:   0 total
Time:        4.195 s
Ran all test suites.
```

- **Deskripsi:** Menunjukkan eksekusi pengujian setelah seluruh kode diperbaiki, menghasilkan kelulusan 100% (**252 passed dari 252 tests**) di seluruh 11 test suites Jest.
- **Efek Terhadap Sistem:**
  1. **Validasi Kualitas Kode:** Memastikan seluruh fungsi inti (autentikasi akun, validasi batas keahlian, alur barter skill, hak akses chat, notifikasi real-time, dan ulasan rating) bekerja normal tanpa bug.
  2. **Izin Rilis Diberikan:** Memenuhi seluruh syarat *Quality Gate*, sehingga pipeline CI memberikan status **HIJAU / SUCCESS** untuk lanjut ke tahap perilisan otomatis.

---

### C. Otomasi CI di GitHub Actions & Status LIVE

```text
✔ feat(test): add 200 unit tests suite for p11 verification [v1.1]    (24s)
✔ feat(test): add 200 unit tests suite for p11 verification [v1.0_dev] (29s)
```

- **Deskripsi:** Menunjukkan alur otomasi workflow `SkillSwap CI / Automated Testing` di GitHub Actions yang berhasil lolos dengan status **Centang Hijau (Success)** pada branch pengembangan (`v1.0_dev`) maupun branch rilis (`v1.1`).
- **Efek Terhadap Sistem:**
  1. **Pemicu Auto Build & Deploy:** Karena seluruh pengujian otomatis di cloud dinyatakan lulus, sistem deployment (Railway) langsung otomatis mengompilasi kode TypeScript backend dan React frontend.
  2. **Aplikasi Siap Diuji (Live):** Versi rilis terbaru langsung aktif secara otomatis di domain publik tanpa perlu upload manual, sehingga reviewer bisa langsung mencoba fitur aplikasi secara online.
