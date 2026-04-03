# Media Tools

Media Tools adalah aplikasi web all-in-one untuk mengunduh konten media sosial dan mengonversi dokumen.  
Project ini dibangun dengan Nuxt 4 dan dirancang agar cepat, sederhana, dan mudah digunakan.

Website produksi: [https://mediatools.biz.id/](https://mediatools.biz.id/)

## Fitur Utama

- **Social media downloader**: TikTok, Instagram, Threads, Facebook, dan YouTube.
- **Document converter**:
  - Ke PDF: DOCX, Excel, PPT, HTML, JPG
  - Dari PDF: DOCX, Excel, PPT, image
- **Halaman download app native** untuk Android, Windows, dan Linux.
- **UI modern & responsif** dengan Tailwind CSS.
- **SEO ready** menggunakan konfigurasi Nuxt SEO meta.

## Teknologi yang Digunakan

- **Framework**: Nuxt 4 (Vue 3 + TypeScript)
- **Styling**: Tailwind CSS
- **UI utilities**: `vue-sonner`, `@vueuse/core`, `reka-ui`
- **Build tool**: Vite

## Persyaratan Sistem (Development)

- Node.js 18+ (disarankan Node.js versi LTS terbaru)
- npm / pnpm / yarn

## Cara Menjalankan Project

1. **Clone repository**

```bash
git clone <url-repository-anda>
cd <nama-folder-project>
```

2. **Install dependencies**

```bash
npm install
```

3. **Jalankan mode development**

```bash
npm run dev
```

4. **Buka di browser**

```text
http://localhost:3000
```

## Build dan Preview Production

```bash
# Build aplikasi
npm run build

# Preview hasil build
npm run preview
```

## Generate Static (Opsional)

```bash
npm run generate
```

## Environment Configuration

Project menggunakan runtime config Nuxt:

- `public.apiUrl`: endpoint API backend (jika dipakai)
- `public.siteUrl`: URL website utama (default: `https://mediatools.biz.id`)

Contoh file `.env`:

```env
NUXT_PUBLIC_API_URL=https://api.domainanda.com
NUXT_PUBLIC_SITE_URL=https://mediatools.biz.id
```

## Struktur Halaman Utama

- `/` : landing page + daftar semua tool
- `/download` : download aplikasi Android/Windows/Linux
- `/tiktok`, `/instagram`, `/threads`, `/facebook`, `/youtube`
- `/docx-to-pdf`, `/excel-to-pdf`, `/ppt-to-pdf`, `/html-to-pdf`, `/jpg-to-pdf`
- `/pdf-to-docx`, `/pdf-to-excel`, `/pdf-to-ppt`
- `/privacy`, `/terms`, `/donasi`

## Catatan Pengembangan

- Pastikan link download dan endpoint API selalu diperbarui sebelum deploy.
- Cek kembali metadata SEO per halaman agar konsisten dengan branding Media Tools.
- Lakukan pengujian responsif untuk mobile, tablet, dan desktop.

## Dukung Project Ini

- Jangan lupa follow akun TikTok: [@Rizki Ramadhan](https://www.tiktok.com/@rzkir.20)
- Jangan lupa follow akun Instagram: [@Rizki Ramadhan](https://www.instagram.com/rzkir.20)
- Jika project ini bermanfaat, jangan lupa berikan Star di GitHub.

## Lisensi

Project ini menggunakan lisensi MIT. Lihat detail pada file `LICENSE`.
