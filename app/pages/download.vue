<template>
  <main class="relative overflow-hidden">
    <!-- Decorative background -->
    <div
      class="absolute top-20 left-10 text-[18rem] font-heading font-black text-outline uppercase select-none pointer-events-none hidden xl:block leading-none"
    >
      DOWNLOAD
    </div>

    <section class="container mx-auto px-4 sm:px-6 relative z-10 pt-10 sm:pt-12 pb-14 sm:pb-20">
      <!-- Hero -->
      <header class="max-w-3xl">
        <p
          class="inline-flex flex-wrap items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-white/60 ring-1 ring-white/10"
        >
          <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          Native apps untuk pengalaman lebih stabil & cepat
        </p>

        <h1 class="mt-6 text-3xl sm:text-4xl md:text-6xl font-black font-heading leading-[1.05]">
          Download <span class="text-brand-gradient">Media Tools</span>
        </h1>
        <p class="mt-4 text-sm sm:text-base text-white/70 max-w-2xl">
          Pilih sistem operasi, unduh installer, lalu ikuti langkah instalasi singkat. Kalau rilis untuk OS kamu belum
          tersedia, kamu bisa ikut daftar notifikasi rilis.
        </p>
      </header>

      <!-- Main content -->
      <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start">
        <!-- Left -->
        <div class="space-y-6">
          <!-- Platform selector -->
          <div class="rounded-3xl bg-white/5 border border-white/10 backdrop-blur p-5 sm:p-6">
            <div class="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <h2 class="text-lg sm:text-xl font-semibold">Pilih platform</h2>
                <p class="text-sm text-white/60 mt-1">
                  Rekomendasi otomatis untuk perangkatmu: <span class="text-white font-semibold">{{ recommendedLabel }}</span>
                </p>
              </div>
              <div class="inline-flex items-center gap-2 rounded-full bg-black/30 border border-white/10 px-3 py-1.5">
                <iconify-icon icon="lucide:shield-check" class="text-emerald-300" />
                <span class="text-[11px] font-semibold text-white/70">Verifikasi checksum disarankan</span>
              </div>
            </div>

            <div class="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                class="group rounded-2xl border px-4 py-4 text-left transition"
                :class="
                  selectedPlatform === 'android'
                    ? 'border-emerald-500/60 bg-emerald-500/10'
                    : 'border-white/15 bg-white/5 hover:bg-white/8 hover:border-white/25'
                "
                @click="selectedPlatform = 'android'"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
                    >
                      <iconify-icon icon="logos:android-icon" class="text-xl" />
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-white">Android</p>
                      <p class="text-xs text-white/50">APK installer</p>
                    </div>
                  </div>
                  <span
                    v-if="recommendedPlatform === 'android'"
                    class="text-[10px] font-black uppercase tracking-widest rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 px-2 py-1"
                    >Recommended</span
                  >
                </div>
              </button>

              <button
                type="button"
                class="group rounded-2xl border px-4 py-4 text-left transition"
                :class="
                  selectedPlatform === 'windows'
                    ? 'border-sky-500/60 bg-sky-500/10'
                    : 'border-white/15 bg-white/5 hover:bg-white/8 hover:border-white/25'
                "
                @click="selectedPlatform = 'windows'"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center"
                    >
                      <iconify-icon icon="lucide:app-window" class="text-xl text-white/80" />
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-white">Windows</p>
                      <p class="text-xs text-white/50">Installer (.exe)</p>
                    </div>
                  </div>
                  <span
                    v-if="recommendedPlatform === 'windows'"
                    class="text-[10px] font-black uppercase tracking-widest rounded-full bg-sky-500/15 text-sky-200 border border-sky-500/30 px-2 py-1"
                    >Recommended</span
                  >
                </div>
              </button>

              <button
                type="button"
                class="group rounded-2xl border px-4 py-4 text-left transition"
                :class="
                  selectedPlatform === 'linux'
                    ? 'border-amber-400/60 bg-amber-400/10'
                    : 'border-white/15 bg-white/5 hover:bg-white/8 hover:border-white/25'
                "
                @click="selectedPlatform = 'linux'"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center"
                    >
                      <iconify-icon icon="logos:linux-tux" class="text-xl" />
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-white">Linux</p>
                      <p class="text-xs text-white/50">AppImage / .deb</p>
                    </div>
                  </div>
                  <span
                    v-if="recommendedPlatform === 'linux'"
                    class="text-[10px] font-black uppercase tracking-widest rounded-full bg-amber-400/15 text-amber-200 border border-amber-400/30 px-2 py-1"
                    >Recommended</span
                  >
                </div>
              </button>
            </div>
          </div>

          <!-- Latest release card -->
          <div class="rounded-3xl bg-white/5 border border-white/10 shadow-[0_18px_45px_rgba(15,23,42,0.7)] p-5 sm:p-7 backdrop-blur">
            <div class="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p class="text-[11px] font-black uppercase tracking-[0.25em] text-white/40">
                  Latest release
                </p>
                <h3 class="mt-2 text-2xl sm:text-3xl font-black font-heading leading-tight">
                  {{ latest.version }} <span class="text-white/40">·</span>
                  <span class="text-white/70 text-base sm:text-lg font-semibold">{{ latestDateLabel }}</span>
                </h3>
                <p class="mt-2 text-sm text-white/60 max-w-xl">
                  {{ latest.summary }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <a
                  :href="latest.releaseNotesUrl || undefined"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
                  :class="!latest.releaseNotesUrl ? 'opacity-50 pointer-events-none' : ''"
                >
                  <iconify-icon icon="lucide:book-open" class="text-sm" />
                  Release notes
                </a>
              </div>
            </div>

            <div class="mt-6 grid gap-3">
              <div
                v-for="asset in selectedAssets"
                :key="asset.id"
                class="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div class="min-w-0">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <iconify-icon :icon="asset.icon" class="text-lg text-white/70" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold truncate">
                        {{ asset.name }}
                        <span class="text-white/40 font-medium">({{ asset.ext }})</span>
                      </p>
                      <p class="text-xs text-white/50">
                        {{ asset.sizeLabel }} · SHA-256 tersedia
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition"
                    :disabled="!asset.sha256"
                    :class="!asset.sha256 ? 'opacity-50 cursor-not-allowed' : ''"
                    @click="copyText(asset.sha256, 'Checksum disalin')"
                    title="Copy SHA-256"
                  >
                    <iconify-icon icon="lucide:copy" class="text-sm" />
                    Copy SHA
                  </button>
                  <a
                    :href="asset.url || undefined"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition"
                    :class="
                      asset.url
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'bg-white/10 text-white/40 border border-white/10 pointer-events-none'
                    "
                  >
                    <iconify-icon icon="lucide:download" class="text-sm" />
                    {{ asset.url ? 'Download' : 'Coming soon' }}
                  </a>
                </div>

                <div v-if="asset.sha256" class="mt-3 sm:mt-0 sm:ml-2 w-full sm:w-auto sm:max-w-[340px]">
                  <button
                    type="button"
                    class="w-full sm:w-auto text-left font-mono text-[11px] text-white/50 hover:text-white/70 transition truncate"
                    @click="copyText(asset.sha256, 'Checksum disalin')"
                    :title="asset.sha256"
                  >
                    {{ asset.sha256 }}
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-white/10 bg-white/3 p-4">
                <p class="text-sm font-semibold">Langkah instalasi</p>
                <ol class="mt-2 space-y-2 text-sm text-white/60 list-decimal list-inside">
                  <li>Unduh installer sesuai platform.</li>
                  <li>Jalankan installer dan ikuti wizard.</li>
                  <li>Buka app, lalu login (jika perlu) dan mulai download.</li>
                </ol>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/3 p-4">
                <p class="text-sm font-semibold">Tips aman</p>
                <ul class="mt-2 space-y-2 text-sm text-white/60">
                  <li class="flex gap-2">
                    <span class="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    <span>Verifikasi checksum SHA-256 setelah download.</span>
                  </li>
                  <li class="flex gap-2">
                    <span class="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    <span>Download hanya dari link resmi di halaman ini.</span>
                  </li>
                  <li class="flex gap-2">
                    <span class="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    <span>Jika gagal, coba ganti jaringan atau gunakan browser lain.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Waitlist (only if selected platform not available) -->
          <div v-if="!isSelectedPlatformAvailable" class="rounded-3xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-6">
            <div class="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 class="text-lg font-semibold">Notifikasi rilis untuk {{ selectedPlatformLabel }}</h3>
                <p class="text-sm text-white/60 mt-1">
                  Rilis untuk platform ini belum tersedia. Masukkan email untuk dapat kabar saat rilis.
                </p>
              </div>
              <span
                class="inline-flex items-center rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-200 ring-1 ring-amber-400/25"
              >
                Coming soon
              </span>
            </div>

            <div class="mt-4 flex flex-col sm:flex-row gap-3">
              <UiInput
                v-model="waitlistEmail"
                type="email"
                placeholder="email@kamu.com"
                class="h-11 rounded-2xl bg-black/35 border-white/10 text-white placeholder:text-white/30"
              />
              <button
                type="button"
                class="h-11 inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="!canSubmitWaitlist"
                @click="submitWaitlist"
              >
                Notify me
              </button>
            </div>
            <p class="mt-3 text-[11px] text-white/40">
              Kami simpan email kamu lokal (di browser) untuk sementara, agar kamu tidak perlu input ulang.
            </p>
          </div>
        </div>

        <!-- Right -->
        <aside class="space-y-6">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 class="text-sm font-semibold text-white mb-3">Kebutuhan sistem</h3>
            <ul class="space-y-3 text-sm text-white/70">
              <li class="flex gap-3">
                <span class="mt-2 h-1.5 w-1.5 rounded-full bg-white/40"></span>
                <span>Android: minimal Android 8+ (estimasi)</span>
              </li>
              <li class="flex gap-3">
                <span class="mt-2 h-1.5 w-1.5 rounded-full bg-white/40"></span>
                <span>Windows: Windows 10/11, 64-bit</span>
              </li>
              <li class="flex gap-3">
                <span class="mt-2 h-1.5 w-1.5 rounded-full bg-white/40"></span>
                <span>Linux: AppImage (portable) atau Debian-based (.deb)</span>
              </li>
            </ul>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 class="text-sm font-semibold text-white mb-3">FAQ singkat</h3>
            <dl class="space-y-4 text-sm text-white/70">
              <div>
                <dt class="font-medium text-white mb-1">Apakah aplikasi ini gratis?</dt>
                <dd>Ya, versi dasar gratis. Donasi membantu biaya server dan pengembangan.</dd>
              </div>
              <div>
                <dt class="font-medium text-white mb-1">Kenapa perlu checksum?</dt>
                <dd>Untuk memastikan file yang kamu unduh tidak rusak dan benar-benar dari sumber resmi.</dd>
              </div>
              <div>
                <dt class="font-medium text-white mb-1">Kalau tombol Download “Coming soon”?</dt>
                <dd>Artinya build untuk platform tersebut belum dirilis. Kamu bisa join notifikasi rilis.</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-3xl border border-white/5 bg-linear-to-br from-white/5 to-white/0 p-6">
            <h3 class="text-sm font-semibold text-white mb-2">Alternatif sementara</h3>
            <p class="text-sm text-white/60">
              Kamu tetap bisa pakai versi web untuk download TikTok/Instagram/YouTube/Facebook dan converter dokumen.
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
              <NuxtLink
                to="/"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
              >
                <iconify-icon icon="lucide:home" class="text-sm" />
                Buka Home
              </NuxtLink>
              <NuxtLink
                to="/donasi"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
              >
                <iconify-icon icon="lucide:heart" class="text-sm" />
                Donasi
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";

type Platform = "android" | "windows" | "linux";
type Asset = {
  id: string;
  platform: Platform;
  name: string;
  ext: string;
  icon: string;
  url: string;
  sizeLabel: string;
  sha256: string;
};

useSeoMeta({
  title: "Download - Media Tools",
  description: "Download aplikasi Media Tools untuk Android, Windows, dan Linux.",
});

const latest = {
  version: "v0.1.0",
  dateISO: "2026-02-27",
  summary: "Rilis awal aplikasi native Media Tools. Link unduhan akan muncul di sini saat build sudah siap.",
  releaseNotesUrl: "",
  assets: [
    {
      id: "android-apk",
      platform: "android",
      name: "Media Tools",
      ext: "APK",
      icon: "lucide:smartphone",
      url: "",
      sizeLabel: "—",
      sha256: "",
    },
    {
      id: "windows-exe",
      platform: "windows",
      name: "Media Tools Setup",
      ext: "EXE",
      icon: "lucide:monitor",
      url: "",
      sizeLabel: "—",
      sha256: "",
    },
    {
      id: "linux-appimage",
      platform: "linux",
      name: "Media Tools",
      ext: "AppImage",
      icon: "lucide:terminal",
      url: "",
      sizeLabel: "—",
      sha256: "",
    },
    {
      id: "linux-deb",
      platform: "linux",
      name: "Media Tools",
      ext: "DEB",
      icon: "lucide:package",
      url: "",
      sizeLabel: "—",
      sha256: "",
    },
  ] satisfies Asset[],
};

const selectedPlatform = ref<Platform>("android");
const recommendedPlatform = ref<Platform>("android");

const recommendedLabel = computed(() => {
  if (recommendedPlatform.value === "android") return "Android";
  if (recommendedPlatform.value === "windows") return "Windows";
  return "Linux";
});
const selectedPlatformLabel = computed(() => {
  if (selectedPlatform.value === "android") return "Android";
  if (selectedPlatform.value === "windows") return "Windows";
  return "Linux";
});

const latestDateLabel = computed(() => {
  const d = new Date(latest.dateISO);
  if (Number.isNaN(d.getTime())) return latest.dateISO;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(d);
});

const selectedAssets = computed(() =>
  latest.assets.filter((a) => a.platform === selectedPlatform.value),
);

const isSelectedPlatformAvailable = computed(() =>
  selectedAssets.value.some((a) => Boolean(a.url)),
);

const waitlistEmail = ref("");
const canSubmitWaitlist = computed(() => {
  const v = waitlistEmail.value.trim();
  return v.length >= 6 && v.includes("@") && v.includes(".");
});

watch(selectedPlatform, (p) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("mt_download_platform", p);
});

onMounted(() => {
  let hasStoredPlatform = false;
  try {
    const storedPlatform = window.localStorage.getItem("mt_download_platform") as Platform | null;
    if (storedPlatform === "android" || storedPlatform === "windows" || storedPlatform === "linux") {
      selectedPlatform.value = storedPlatform;
      hasStoredPlatform = true;
    }
    const storedEmail = window.localStorage.getItem("mt_waitlist_email") || "";
    if (storedEmail) waitlistEmail.value = storedEmail;
  } catch {
    // ignore
  }

  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator.platform || "").toLowerCase();

  if (ua.includes("android")) {
    recommendedPlatform.value = "android";
  } else if (
    ua.includes("windows") ||
    ua.includes("windows nt") ||
    platform.includes("win")
  ) {
    recommendedPlatform.value = "windows";
  } else if (ua.includes("linux") || platform.includes("linux")) {
    recommendedPlatform.value = "linux";
  } else {
    recommendedPlatform.value = "android";
  }

  // Kalau user belum pernah memilih platform sebelumnya, otomatis pilih rekomendasi device.
  if (!hasStoredPlatform) {
    selectedPlatform.value = recommendedPlatform.value;
  }
});

async function copyText(text: string, successMsg: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMsg);
  } catch {
    toast.error("Gagal menyalin. Coba salin manual.");
  }
}

function submitWaitlist() {
  if (!canSubmitWaitlist.value) return;
  const email = waitlistEmail.value.trim();
  try {
    window.localStorage.setItem("mt_waitlist_email", email);
  } catch {
    // ignore
  }
  toast.success("Berhasil tersimpan. Kami akan kabari saat rilis.");
}
</script>