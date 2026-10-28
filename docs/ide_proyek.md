## TUGAS MATKUL RPL - Semester 3 - Bijan Lungga Bhasmara || 2510101028 

## TEMA: SkillSwap: Platform Pertukaran Keahlian Antar-Pengguna (Peer-to-Peer)

> **"Platform Web Responsif Berbasis Komunitas untuk Pertukaran Keahlian (Barter Skill) Antar-Pengguna Berdasarkan Minat dan Kebutuhan Spesifik"**

---

### 1. Masalah Nyata yang Akan Diselesaikan

Banyak individu (pelajar, mahasiswa, pekerja lepas, dan profesional muda) memiliki keinginan kuat untuk mempelajari keterampilan baru seperti pemrograman, desain grafis, bahasa asing, atau musik. Namun, mereka menghadapi sejumlah kendala nyata:

* **Tingginya biaya kursus dan pelatihan profesional**, yang sering kali tidak terjangkau bagi pelajar atau pemula.
* **Kesulitan menemukan partner belajar dua arah yang setara**, di mana proses belajar-mengajar dapat berlangsung saling menguntungkan (*win-win*) tanpa beban finansial.
* **Ketiadaan platform terstruktur untuk barter keterampilan**, sehingga potensi individu yang memiliki keahlian tertentu tidak tersalurkan dan mereka kesulitan mendapatkan keahlian baru sebagai timbal balik.
* **Kurangnya wadah koordinasi yang aman dan terfokus**, menyebabkan komunikasi pertukaran ilmu sering terfragmentasi di media sosial tanpa kejelasan jadwal dan komitmen.

---

### 2. Profil Target Pengguna

* **Mahasiswa & Pelajar (Usia 18–25 tahun)**:
  Ingin mempelajari keahlian praktis pendukung studi atau karir (misalnya coding, editing video, TOEFL) tanpa biaya, dengan menukarkan keahlian dasar yang mereka miliki.
* **Pekerja Lepas (Freelancer) & Profesional Muda (Usia 22–30 tahun)**:
  Ingin melakukan *upskilling* atau *cross-skilling* (misalnya desainer UI yang ingin belajar dasar frontend React, atau copywriter yang ingin belajar SEO) secara fleksibel dan kolaboratif.
* **Pembelajar Mandiri (Self-Learner / Komunitas Hobi)**:
  Mencari rekan diskusi untuk praktik bahasa asing, alat musik, atau keterampilan kreatif lainnya secara teratur.

---

### 3. Manfaat Aplikasi

* **Bagi Pengguna**:
  Memfasilitasi pemerataan ilmu pengetahuan dan peningkatan keterampilan tanpa hambatan biaya finansial melalui skema pertukaran kemampuan langsung (*Skill A for Skill B*).
* **Bagi Komunitas**:
  Membangun ekosistem belajar kolaboratif di mana setiap anggota dapat bertindak sekaligus sebagai pembelajar (*learner*) dan pengajar (*mentor*).
* **Bagi Efisiensi Waktu**:
  Menyediakan filter pencarian instan berdasarkan keahlian yang dimiliki (`HAVE`) dan yang diinginkan (`WANT`), sehingga proses pencocokan partner (*partner matching*) berlangsung cepat dan akurat.
* **Bagi Transparansi Interaksi**:
  Menyediakan alur status pertukaran yang jelas (*PENDING* $\rightarrow$ *ACCEPTED* / *REJECTED* $\rightarrow$ *COMPLETED*) serta ruang obrolan terintegrasi untuk menjaga komitmen belajar.

---

### 4. Daftar Fitur Inti (Scope MVP 12 Pertemuan)

1. **Sistem Autentikasi Pengguna**:
   Pendaftaran akun dan login menggunakan kredensial email dan password dengan perlindungan data keamanan dasar.
2. **Manajemen Profil & Portofolio Keahlian**:
   Pengelolaan data diri (nama, bio singkat) serta penambahan/penghapusan tag keahlian yang dimiliki (`HAVE`) dan keahlian yang ingin dipelajari (`WANT`).
3. **Eksplorasi & Pencarian Partner (Skill Matching)**:
   Fitur pencarian dan filter pengguna lain berdasarkan keahlian yang ditawarkan atau yang sedang dicari secara responsif.
4. **Manajemen Permintaan Pertukaran (Swap Request State Machine)**:
   Pengajuan permohonan barter skill dengan pesan ajakan, validasi pencegahan permohonan ke diri sendiri dan duplikasi, serta aksi terima (*ACCEPTED*) atau tolak (*REJECTED*).
5. **Ruang Obrolan Terintegrasi (Chat Room)**:
   Ruang pesan teks langsung antar-partner yang telah saling menyetujui pertukaran untuk koordinasi materi dan jadwal belajar.
6. **Dasbor Ringkasan & Partner Terhubung**:
   Visualisasi metrik statistik (jumlah keahlian HAVE/WANT, pertukaran aktif, permintaan menunggu) dan daftar partner aktif.

---

### 5. Fitur yang Tidak Dikerjakan (Out of Scope)

Untuk memastikan proyek selesai tepat waktu dalam **12 kali pertemuan**, batasan cakupan ditetapkan:

1. **Panggilan Video / Live Class Bawaan**: Sesi belajar tatap muka dilakukan via tautan eksternal (Google Meet, Zoom) atau pertemuan langsung.
2. **Sistem Rating, Ulasan Bintang, & Gamifikasi (Leveling/Badges)**: Tidak ada sistem reputasi poin atau tier level.
3. **Sistem Transaksi Moneter & Dompet Digital**: Tidak ada pembayaran uang tunai, token berbayar, atau sistem deposit koin.
4. **Notifikasi Push Real-time ke Perangkat**: Pembaharuan status dan pesan ditampilkan langsung di dalam antarmuka web melalui mekanisme polling berkala.
5. **Autentikasi OAuth Pihak Ketiga (Google/GitHub Login)**: Autentikasi terbatas pada akun lokal database.

---

### 6. Kriteria Aplikasi Dinyatakan Berhasil

* **Fungsionalitas Alur Utama (Core Flow) Berjalan Utuh**:
  Registrasi Akun $\rightarrow$ Input Keahlian HAVE & WANT $\rightarrow$ Cari Partner di Eksplorasi $\rightarrow$ Kirim Permintaan Tukar $\rightarrow$ Partner Menerima Permintaan $\rightarrow$ Koordinasi via Chat Room.
* **Integritas Aturan Bisnis**:
  - Sistem menolak pengiriman permintaan tukar ke akun sendiri.
  - Sistem menolak permintaan ganda jika masih ada sesi PENDING atau ACCEPTED aktif.
  - Pesan chat hanya dapat dikirimkan jika status permintaan adalah ACCEPTED dan pengirim adalah pihak yang bersangkutan.
* **Kestabilan Teknis & Pengujian**:
  - Seluruh unit test business logic (5 test suites, 33 unit tests) berstatus **ALL PASSED**.
  - Operasi CRUD pada data pengguna, keahlian, permintaan, dan chat berjalan tanpa galat database.
* **Antarmuka Pengguna (UI/UX)**:
  - Antarmuka web responsif diakses melalui layar desktop maupun mobile.
  - Komponen dialog konfirmasi mencegah penghapusan keahlian secara tidak sengaja.
  - Indikator status semantik jelas (Hijau = ACCEPTED/HAVE, Kuning = PENDING, Biru = WANT, Merah = REJECTED).

