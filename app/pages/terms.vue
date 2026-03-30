<template>
  <main class="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
    <!-- Hero -->
    <header class="max-w-3xl">
      <p
        class="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-white/60 ring-1 ring-white/10"
      >
        <span class="inline-block h-1.5 w-1.5 rounded-full bg-[#FF3D57]"></span>
        Legal · Terms of Service
      </p>

      <h1 class="mt-6 text-3xl sm:text-4xl md:text-6xl font-black font-heading leading-[1.05]">
        Terms <span class="text-brand-gradient">of Service</span>
      </h1>
      <p class="mt-4 text-sm sm:text-base text-white/70 max-w-2xl">
        Syarat dan ketentuan ini mengatur penggunaan layanan <span class="font-semibold text-white">Media Tools</span>
        (website & aplikasi). Dengan mengakses atau menggunakan layanan, kamu setuju dengan Terms ini.
      </p>

      <div class="mt-6 flex flex-wrap gap-2 text-[11px] sm:text-xs text-white/50">
        <span class="rounded-full border border-white/10 bg-black/30 px-3 py-1.5">
          Berlaku sejak: <span class="text-white/70 font-semibold">{{ effectiveDateLabel }}</span>
        </span>
        <span class="rounded-full border border-white/10 bg-black/30 px-3 py-1.5">
          Terakhir diperbarui: <span class="text-white/70 font-semibold">{{ updatedDateLabel }}</span>
        </span>
      </div>
    </header>

    <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start">
      <!-- Content -->
      <section class="space-y-6">
        <div class="rounded-3xl bg-white/5 border border-white/10 backdrop-blur p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-black font-heading">Ringkasan (singkat)</h2>
          <ul class="mt-4 space-y-3 text-sm sm:text-base text-white/70">
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Gunakan layanan secara legal dan bertanggung jawab.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Kamu bertanggung jawab atas link/file yang kamu proses dan hak atas kontennya.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Layanan disediakan “apa adanya”; kami berusaha stabil tapi tidak menjamin tanpa gangguan.</span>
            </li>
          </ul>
        </div>

        <div class="rounded-3xl bg-white/5 border border-white/10 backdrop-blur p-6 sm:p-8 space-y-10">
          <article v-for="s in sections" :key="s.id" :id="s.id" class="scroll-mt-28">
            <h2 class="text-lg sm:text-xl font-semibold text-white">
              {{ s.title }}
            </h2>
            <div class="mt-3 space-y-3 text-sm sm:text-base text-white/70 leading-relaxed">
              <p v-for="(p, i) in s.paragraphs" :key="i">{{ p }}</p>
              <ul v-if="s.bullets?.length" class="mt-3 space-y-2">
                <li v-for="(b, i) in s.bullets" :key="i" class="flex gap-3">
                  <span class="mt-2 h-1.5 w-1.5 rounded-full bg-white/35"></span>
                  <span>{{ b }}</span>
                </li>
              </ul>
            </div>
          </article>
        </div>

        <div class="rounded-3xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-6">
          <h3 class="text-lg font-semibold">Kontak</h3>
          <p class="mt-2 text-sm text-white/60">
            Jika kamu punya pertanyaan tentang Terms ini, hubungi kami melalui kanal resmi yang tersedia di halaman
            utama atau profil GitHub.
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <NuxtLink
              to="/"
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
            >
              <iconify-icon icon="lucide:home" class="text-sm" />
              Home
            </NuxtLink>
            <NuxtLink
              to="/privacy"
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
            >
              <iconify-icon icon="lucide:shield" class="text-sm" />
              Privacy Policy
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Sidebar -->
      <aside class="space-y-6">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 class="text-sm font-semibold text-white mb-3">Daftar isi</h3>
          <div class="space-y-2 text-sm text-white/60">
            <a
              v-for="s in sections"
              :key="s.id"
              :href="`#${s.id}`"
              class="block rounded-xl border border-white/10 bg-black/25 px-3 py-2 hover:bg-white/5 hover:text-white transition"
            >
              {{ s.title }}
            </a>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 class="text-sm font-semibold text-white mb-3">Catatan penting</h3>
          <p class="text-sm text-white/60 leading-relaxed">
            Ini bukan nasihat hukum. Jika kamu butuh terms yang disesuaikan untuk kebutuhan bisnis tertentu, konsultasikan
            dengan profesional hukum.
          </p>
        </div>
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";

useSeoMeta({
  title: "Terms - Media Tools",
  description: "Syarat dan ketentuan penggunaan layanan Media Tools.",
});

const effectiveISO = "2026-02-27";
const updatedISO = "2026-02-27";

const effectiveDateLabel = computed(() => {
  const d = new Date(effectiveISO);
  if (Number.isNaN(d.getTime())) return effectiveISO;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(d);
});

const updatedDateLabel = computed(() => {
  const d = new Date(updatedISO);
  if (Number.isNaN(d.getTime())) return updatedISO;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(d);
});

const sections = [
  {
    id: "acceptance",
    title: "1) Penerimaan Terms",
    paragraphs: [
      "Dengan mengakses, menggunakan, atau mengunduh aplikasi/layanan Media Tools, kamu menyatakan telah membaca, memahami, dan setuju terikat oleh Terms ini.",
      "Jika kamu tidak setuju, mohon jangan gunakan layanan.",
    ],
  },
  {
    id: "eligibility",
    title: "2) Kelayakan Pengguna",
    paragraphs: [
      "Kamu bertanggung jawab memastikan kamu memiliki kapasitas hukum untuk menyetujui Terms ini. Jika kamu menggunakan layanan atas nama organisasi, kamu menyatakan memiliki wewenang untuk mengikat organisasi tersebut.",
    ],
  },
  {
    id: "acceptable-use",
    title: "3) Penggunaan yang Diizinkan",
    paragraphs: [
      "Media Tools menyediakan fitur unduh konten publik dan konversi dokumen untuk memudahkan pengguna. Kamu wajib menggunakan layanan ini sesuai hukum yang berlaku dan kebijakan pihak ketiga (mis. platform sosial media).",
    ],
    bullets: [
      "Jangan gunakan layanan untuk melanggar hak cipta, privasi, atau hak pihak lain.",
      "Jangan melakukan scraping/abuse/traffic yang tidak wajar, DDoS, atau percobaan eksploitasi.",
      "Jangan mencoba mengakses sistem/endpoint yang tidak diizinkan.",
    ],
  },
  {
    id: "content-responsibility",
    title: "4) Tanggung Jawab Konten",
    paragraphs: [
      "Kamu bertanggung jawab penuh atas link, file, dan konten yang kamu proses melalui layanan (termasuk memastikan kamu memiliki hak/izin yang diperlukan).",
      "Kami tidak mengklaim kepemilikan atas konten pihak ketiga yang kamu unduh atau proses.",
    ],
  },
  {
    id: "availability",
    title: "5) Ketersediaan Layanan",
    paragraphs: [
      "Kami berusaha menjaga layanan tetap tersedia, namun layanan dapat mengalami gangguan, perubahan, pembatasan, atau dihentikan sewaktu-waktu (mis. untuk maintenance, keamanan, atau alasan operasional).",
    ],
  },
  {
    id: "disclaimer",
    title: "6) Disclaimer",
    paragraphs: [
      "Layanan disediakan “apa adanya” dan “sebagaimana tersedia”. Kami tidak memberikan jaminan tersurat maupun tersirat terkait keandalan, akurasi, kesesuaian untuk tujuan tertentu, atau bebas dari error.",
    ],
  },
  {
    id: "limitation",
    title: "7) Batasan Tanggung Jawab",
    paragraphs: [
      "Sejauh diizinkan oleh hukum, kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, konsekuensial, atau kehilangan data yang timbul dari penggunaan layanan.",
    ],
  },
  {
    id: "changes",
    title: "8) Perubahan Terms",
    paragraphs: [
      "Kami dapat memperbarui Terms ini dari waktu ke waktu. Perubahan akan berlaku saat dipublikasikan di halaman ini. Melanjutkan penggunaan layanan setelah perubahan berarti kamu menerima Terms yang diperbarui.",
    ],
  },
] as const;
</script>
