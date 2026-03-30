<template>
  <main class="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
    <!-- Hero -->
    <header class="max-w-3xl">
      <p
        class="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-white/60 ring-1 ring-white/10"
      >
        <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        Legal · Privacy Policy
      </p>

      <h1 class="mt-6 text-3xl sm:text-4xl md:text-6xl font-black font-heading leading-[1.05]">
        Privacy <span class="text-brand-gradient">Policy</span>
      </h1>
      <p class="mt-4 text-sm sm:text-base text-white/70 max-w-2xl">
        Kebijakan Privasi ini menjelaskan bagaimana <span class="font-semibold text-white">Media Tools</span> mengelola
        informasi ketika kamu menggunakan layanan kami (website & aplikasi).
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
          <h2 class="text-xl sm:text-2xl font-black font-heading">Intinya</h2>
          <ul class="mt-4 space-y-3 text-sm sm:text-base text-white/70">
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Kami tidak meminta kamu login untuk memakai fitur utama.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Kami memproses link/file yang kamu berikan untuk menghasilkan output yang kamu minta.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Kami berupaya meminimalkan data yang disimpan dan menggunakan praktik keamanan yang wajar.</span>
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
          <h3 class="text-lg font-semibold">Hubungi kami</h3>
          <p class="mt-2 text-sm text-white/60">
            Untuk pertanyaan terkait privasi, silakan hubungi melalui kanal resmi yang tersedia di website atau GitHub.
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
              to="/terms"
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
            >
              <iconify-icon icon="lucide:scroll-text" class="text-sm" />
              Terms
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
          <h3 class="text-sm font-semibold text-white mb-3">Kamu punya kontrol</h3>
          <ul class="space-y-3 text-sm text-white/60">
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-white/40"></span>
              <span>Kamu bisa menghapus data lokal (localStorage) lewat fitur “Clear browsing data” di browser.</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-white/40"></span>
              <span>Kamu bisa berhenti menggunakan layanan kapan saja.</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";

useSeoMeta({
  title: "Privacy - Media Tools",
  description: "Kebijakan privasi layanan Media Tools.",
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
    id: "what-we-collect",
    title: "1) Data yang kami kumpulkan",
    paragraphs: [
      "Kami mengumpulkan data seminimal mungkin untuk menjalankan layanan.",
    ],
    bullets: [
      "Data input yang kamu berikan: link/URL konten publik atau file yang kamu upload untuk konversi.",
      "Data teknis dasar: alamat IP, user-agent, dan log error/diagnostic untuk keamanan dan perbaikan bug (sepanjang diperlukan).",
      "Data lokal di perangkat kamu (opsional): beberapa preferensi/riwayat bisa disimpan di browser (localStorage) agar pengalaman lebih nyaman.",
    ],
  },
  {
    id: "how-we-use",
    title: "2) Cara kami menggunakan data",
    paragraphs: [
      "Kami menggunakan data hanya untuk menjalankan fungsi yang kamu minta dan menjaga layanan tetap aman dan stabil.",
    ],
    bullets: [
      "Memproses download/konversi dan mengirimkan hasilnya ke kamu.",
      "Mendeteksi penyalahgunaan dan melindungi layanan dari spam/abuse.",
      "Analisis error untuk meningkatkan kualitas layanan.",
    ],
  },
  {
    id: "sharing",
    title: "3) Berbagi data",
    paragraphs: [
      "Kami tidak menjual data pribadi kamu.",
      "Dalam beberapa kasus, data dapat diproses oleh penyedia infrastruktur (mis. hosting/CDN) untuk menjalankan layanan. Kami berupaya memilih penyedia yang kredibel dan membatasi akses sesuai kebutuhan.",
    ],
  },
  {
    id: "retention",
    title: "4) Retensi (berapa lama data disimpan)",
    paragraphs: [
      "Retensi dapat berbeda tergantung jenis data dan kebutuhan operasional.",
    ],
    bullets: [
      "Input/hasil proses: sebisa mungkin hanya disimpan sementara selama pemrosesan.",
      "Log teknis dan keamanan: dapat disimpan untuk periode terbatas untuk audit dan troubleshooting.",
      "Data lokal di browser: tetap ada sampai kamu menghapusnya.",
    ],
  },
  {
    id: "security",
    title: "5) Keamanan",
    paragraphs: [
      "Kami menerapkan langkah keamanan yang wajar untuk melindungi layanan dan data. Namun tidak ada metode transmisi/penyimpanan yang 100% aman.",
    ],
  },
  {
    id: "your-rights",
    title: "6) Hak dan pilihan kamu",
    paragraphs: [
      "Kamu dapat mengontrol beberapa data dari sisi perangkat (mis. menghapus localStorage, cache, atau data browsing).",
      "Jika kamu butuh bantuan terkait data yang mungkin tersimpan di sistem kami (mis. log), kamu bisa menghubungi kami.",
    ],
  },
  {
    id: "changes",
    title: "7) Perubahan kebijakan",
    paragraphs: [
      "Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Versi terbaru akan dipublikasikan di halaman ini.",
    ],
  },
] as const;
</script>
