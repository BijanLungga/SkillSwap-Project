# SkillSwap — UI Design Specification

## Platform Pertukaran Keahlian Antar-Pengguna (Peer-to-Peer)

**Versi:** 1.0.0  
**Stack Antarmuka:** React 18 + TypeScript + Tailwind CSS + Lucide React Icons  

---

## 1. Prinsip Desain

Platform SkillSwap dirancang untuk menciptakan lingkungan belajar yang ramah, bersih, dan intuitif bagi pengguna dari berbagai latar belakang keterampilan.

1. **Kejelasan di Atas Dekorasi**: Antarmuka menghindari elemen visual berlebih atau gradien mencolok agar pengguna fokus pada informasi keahlian partner.
2. **Status Semantik yang Tegas**: Setiap status permintaan pertukaran dan tipe keahlian memiliki penanda warna dan label teks yang konsisten di seluruh halaman.
3. **Kenyamanan Input & Interaksi**: Formulir input keahlian dilengkapi kategori jelas (`HAVE` atau `WANT`), dan aksi penghapusan selalu dilindungi modal konfirmasi dialog.
4. **Desain Responsif Desktop & Mobile**: Tata letak grid dinamis yang menyesuaikan dari layar smartphone hingga monitor desktop.

---

## 2. Palet Warna (Color Palette)

### 2.1 Warna Utama (Brand Identity)
| Token | Kelas Tailwind | Nilai Hex | Penggunaan |
|---|---|---|---|
| `primary` | `indigo-600` | `#4F46E5` | Tombol aksi utama, tautan aktif, navbar brand |
| `primary-hover` | `indigo-700` | `#4338CA` | Hover tombol aksi utama |
| `primary-light` | `indigo-50` | `#EEF2FF` | Background tombol sekunder, highlight aktif |

### 2.2 Background & Surface
| Token | Kelas Tailwind | Nilai Hex | Penggunaan |
|---|---|---|---|
| `bg-base` | `gray-50` | `#F9FAFB` | Background utama aplikasi |
| `surface` | `white` | `#FFFFFF` | Kontainer kartu (card), modal, form panel |
| `border` | `gray-200` | `#E5E7EB` | Garis batas antar komponen, border kartu |

### 2.3 Tipografi & Teks
| Token | Kelas Tailwind | Nilai Hex | Penggunaan |
|---|---|---|---|
| `text-primary` | `gray-900` | `#111827` | Judul, heading, teks konten utama |
| `text-secondary` | `gray-600` | `#4B5563` | Deskripsi, label form, teks bantuan |
| `text-muted` | `gray-400` | `#9CA3AF` | Placeholder input, ikon non-aktif |

### 2.4 Status Semantik (Keahlian & Swap Request)
| Status / Tipe | Latar Belakang | Warna Teks | Keterangan |
|---|---|---|---|
| **HAVE (Dimiliki)** | `bg-green-100` | `text-green-800` | Keahlian yang dikuasai pengguna |
| **WANT (Diinginkan)** | `bg-blue-100` | `text-blue-800` | Keahlian yang ingin dipelajari |
| **PENDING** | `bg-yellow-100` | `text-yellow-800` | Permintaan menunggu persetujuan |
| **ACCEPTED** | `bg-green-100` | `text-green-800` | Permintaan disetujui / Sesi aktif |
| **REJECTED** | `bg-red-100` | `text-red-800` | Permintaan ditolak |
| **COMPLETED** | `bg-gray-100` | `text-gray-800` | Pertukaran telah selesai |

---

## 3. Komponen Antarmuka Utama

### 3.1 Navigasi (`Navbar.tsx`)
- Menampilkan logo SkillSwap, navigasi menu (`Dashboard`, `Profil`, `Eksplorasi`, `Permintaan Tukar`), identitas pengguna yang sedang login, dan tombol `Keluar`.
- Dilengkapi tombol menu hamburger untuk tampilan layar mobile.

### 3.2 Badge Keahlian (`SkillBadge.tsx`)
- Komponen chip interaktif dengan label nama keahlian dan tombol silang kecil (opsional) untuk menghapus keahlian pada halaman profil.

### 3.3 Modal Dialog Konfirmasi (`ConfirmDialog.tsx`)
- Dialog pop-up di tengah layar saat pengguna menekan tombol hapus keahlian, meminta konfirmasi `Batal` atau `Hapus` guna mencegah penghapusan tidak disengaja.

### 3.4 State Kosong (`EmptyState.tsx`)
- Komponen ramah yang memuat ikon SVG Lucide, judul penjelasan, dan teks instruksi saat daftar partner, daftar permintaan, atau keahlian belum memiliki data.

### 3.5 Panel Obrolan (`SwapRequests.tsx`)
- Terintegrasi langsung di samping daftar permintaan swap.
- Bubble obrolan pengirim berwarna indigo di sisi kanan, dan lawan bicara berwarna putih dengan border abu-abu di sisi kiri.

