# LOGGING.md — Konvensi Dev Log untuk Proyek SkillSwap

Dokumen ini mengatur bagaimana **AI agent** (dan kontributor manusia) mencatat pekerjaan yang dilakukan di proyek SkillSwap, supaya pemilik proyek selalu dapat menjawab: *"terakhir sedang mengerjakan apa? sudah fix apa? error apa yang masih terbuka?"* — walau pengerjaan berpindah-pindah sesi atau model AI.

Berkas log aktual berada di: **`docs/DevLog.md`**. Dokumen ini adalah **pedoman standar penulisannya**.

---

## 1. Kapan Harus Menulis Entri Log

Tulis satu entri baru setiap kali sebuah sesi kerja menghasilkan salah satu dari hal berikut:

- Fitur baru selesai dibuat atau disempurnakan.
- Bug berhasil diperbaiki (*bugfix*).
- Refactor atau restrukturisasi kode.
- Perubahan skema database Prisma atau migrasi.
- Suite pengujian / unit test baru ditambahkan.
- Error/kendala ditemukan namun belum terselesaikan (dicatat sebagai status `Open`).

> **Catatan:** Jangan mencatat hal remeh seperti perbaikan typo komentar atau spasi kosong untuk menjaga log tetap relevan dan informatif.

---

## 2. Lokasi & Struktur File

```text
docs/
└── DevLog.md      # Log kronologis terbalik (entri terbaru di PALING ATAS)
```

---

## 3. Format Entri (Wajib Diikuti)

```markdown
## [YYYY-MM-DD HH:MM WIB] — <Judul Singkat Pekerjaan>

- **Agent:** <nama model AI, mis. Gemini 3.8 Flash / Claude Sonnet 4.6 / Claude Opus 4.6 / Antigravity>
- **Tipe:** Fitur Baru | Fix Bug | Refactor | Migrasi DB | Pengujian/Testing | Dokumentasi
- **Status:** Selesai | Sebagian | Open/Belum Fix
- **Modul:** <mis. Autentikasi / Profil & Skill / Swap Request / Chat / Dashboard / Unit Test>
- **File terdampak:**
  - `path/ke/file1.ts`
  - `path/ke/file2.tsx`
- **Deskripsi:**
  Penjelasan singkat 1–4 kalimat mengenai apa yang dikerjakan, mengapa, dan bagaimana solusinya.
- **Error/Kendala (jika ada):**
  Pesan galat atau perilaku bug yang dialami serta akar penyebabnya (*root cause*).
- **Next Step (jika belum selesai):**
  Langkah tindak lanjut untuk sesi berikutnya.
```

### Aturan Penulisan Tanggal & Jam:
- Format wajib: `YYYY-MM-DD HH:MM WIB` (format 24 jam waktu Indonesia Barat).
- Agent AI wajib mencatat waktu riil saat pengerjaan berlangsung.
- Setiap entri baru selalu diletakkan di **bagian paling atas** file `docs/DevLog.md` (kronologis terbalik) tepat di bawah header pembuka.

