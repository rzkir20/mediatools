<template>
  <section class="relative overflow-hidden">
    <div
      class="absolute top-20 left-10 text-[18rem] font-heading font-black text-outline uppercase select-none pointer-events-none hidden xl:block leading-none"
    >
      DOWNLOADER
    </div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div
        class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-8 pb-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-16"
      >
        <div class="order-2 lg:order-1">
          <div class="mb-6 inline-flex items-center gap-3">
            <div class="w-12 h-[2px] bg-[#1877F2]" />
            <span
              class="uppercase tracking-[0.4em] text-xs font-heading font-black text-[#1877F2]"
              >Facebook</span
            >
          </div>

          <h1
            class="font-heading text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] mb-6 sm:mb-8"
          >
            Facebook <br />
            <span class="text-[#1877F2]">Downloader</span>
          </h1>

          <p class="text-white/50 text-base sm:text-lg max-w-lg mb-8 sm:mb-12">
            Download video &amp; foto dari Facebook, fb.watch, dan link
            <code class="px-1.5 py-0.5 rounded bg-white/5 text-xs align-middle">facebook.com/share/p/...</code>.
            Tempel link post publik lalu unduh dalam hitungan detik.
          </p>

          <div
            id="download-input"
            class="relative w-full max-w-2xl mb-8 sm:mb-12"
          >
            <div
              class="bg-[#1A1A1A] p-2 sm:p-3 rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 border border-white/5 shadow-2xl shadow-black/40 focus-within:border-[#1877F2]/50 transition-all"
            >
              <UiInput
                v-model="videoUrl"
                type="text"
                placeholder="Insert link: fb.watch, facebook.com/watch, atau facebook.com/share/p/..."
                class="bg-transparent flex-1 min-w-0 py-3 sm:py-4 pl-4 sm:pl-5 text-sm sm:text-base text-white outline-none placeholder:text-white/20 font-medium border-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
              />
              <div
                class="flex items-center justify-end sm:justify-start gap-2 shrink-0"
              >
                <button
                  type="button"
                  class="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all shrink-0"
                  title="Tempel dari clipboard"
                  @click="onPaste"
                >
                  <iconify-icon icon="lucide:clipboard-paste" class="text-lg" />
                  <span
                    class="text-xs font-heading font-black uppercase tracking-widest hidden sm:inline"
                    >Tempel</span
                  >
                </button>
                <button
                  type="button"
                  class="bg-[#1877F2] hover:bg-[#1877F2]/90 hover:scale-105 active:scale-95 transition-all text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-heading font-black uppercase text-xs sm:text-sm tracking-widest shadow-lg shadow-[#1877F2]/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  :disabled="downloadLoading"
                  @click="onSearch"
                >
                  {{ downloadLoading ? "..." : "Download" }}
                </button>
              </div>
            </div>
            <p v-if="downloadError" class="mt-3 text-sm text-red-400">
              {{ downloadError }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-4 sm:gap-8">
            <span
              class="text-xs uppercase font-heading font-black text-white/30 tracking-widest"
              >Supported :</span
            >
            <div class="flex gap-4 sm:gap-6">
              <iconify-icon
                icon="lucide:monitor"
                class="text-xl text-white/50 hover:text-white cursor-pointer transition-colors"
              />
              <iconify-icon
                icon="lucide:smartphone"
                class="text-xl text-white/50 hover:text-white cursor-pointer transition-colors"
              />
            </div>
          </div>
        </div>

        <div
          class="order-1 lg:order-2 relative flex justify-center lg:justify-end w-full min-w-0 max-w-[280px] sm:max-w-[320px] md:max-w-none mx-auto lg:mx-0"
        >
          <div
            class="w-full aspect-4/5 bg-[#1A1A1A] rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center"
          >
            <iconify-icon
              icon="mdi:facebook"
              class="text-[80px] sm:text-[100px] md:text-[120px] text-[#1877F2]/30"
            />
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="relative mt-8 sm:mt-12 w-full">
        <div
          v-if="videoInfo"
          class="absolute top-20 left-4 text-[12rem] xl:text-[18rem] font-heading font-black text-outline uppercase select-none pointer-events-none hidden xl:block leading-none"
        >
          SUCCESS
        </div>

        <div
          v-if="downloadLoading"
          class="relative z-10 results-enter flex justify-center items-center py-24"
        >
          <div class="flex flex-col items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center"
            >
              <span
                class="w-8 h-8 border-2 border-white/80 border-t-transparent rounded-full animate-spin"
              />
            </div>
            <span class="text-white font-medium">Memuat...</span>
            <span class="text-sm text-white/50">Mengambil data video</span>
          </div>
        </div>

        <template v-else-if="videoInfo">
          <div class="relative z-10 mb-6 sm:mb-10 results-enter">
            <div
              class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-2xl"
            >
              <div
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"
              >
                <iconify-icon
                  icon="lucide:check-circle"
                  class="text-white text-lg sm:text-xl"
                />
              </div>
              <div>
                <p
                  class="font-heading font-black text-sm uppercase tracking-wider text-emerald-400"
                >
                  Ready for Download
                </p>
                <p class="text-white/60 text-xs">
                  Video Facebook siap diunduh. Klik tombol Download untuk mulai mengunduh.
                </p>
              </div>
            </div>
          </div>

          <div
            class="relative z-10 grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start results-enter"
          >
            <div
              class="lg:col-span-4 group max-w-[280px] mx-auto lg:max-w-none lg:mx-0"
            >
              <div
                class="relative aspect-4/6 bg-[#1A1A1A] rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-transform group-hover:scale-[1.01]"
              >
                <!-- Cover / image fallback (poster or single image) -->
                <img
                  v-if="videoInfo.cover"
                  :src="videoInfo.cover"
                  alt="Preview"
                  class="absolute inset-0 w-full h-full object-cover z-0"
                />
                <video
                  v-if="
                    (videoInfo.previewVideoUrl || videoInfo.videoUrl) &&
                    !videoLoadFailed
                  "
                  :src="videoInfo.previewVideoUrl || videoInfo.videoUrl"
                  :poster="videoInfo.cover || undefined"
                  class="absolute inset-0 w-full h-full object-cover z-1"
                  controls
                  muted
                  loop
                  playsinline
                  preload="metadata"
                  @error="videoLoadFailed = true"
                />
                <div
                  v-if="
                    !videoInfo.cover && (videoLoadFailed || !videoInfo.videoUrl)
                  "
                  class="absolute inset-0 flex items-center justify-center bg-neutral-800 z-0"
                >
                  <iconify-icon
                    icon="lucide:video"
                    class="text-white/20 text-5xl"
                  />
                </div>
                <!-- Gradient + play icon only when video -->
                <div
                  v-if="videoInfo.previewVideoUrl || videoInfo.videoUrl"
                  class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-8 pointer-events-none"
                >
                  <div
                    class="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 sm:mb-4"
                  >
                    <iconify-icon
                      icon="lucide:play"
                      class="text-white text-xl sm:text-2xl ml-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-8 space-y-6 md:space-y-10">
              <div>
                <div class="inline-flex items-center gap-3 mb-4 sm:mb-6">
                  <div class="w-12 h-[2px] bg-[#1877F2]" />
                  <span
                    class="uppercase tracking-[0.4em] text-xs font-heading font-black text-[#1877F2]"
                    >Facebook Result</span
                  >
                </div>
                <h1
                  class="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-3 sm:mb-4"
                >
                  <template
                    v-if="
                      (videoInfo.text || 'Facebook Video').split(' ').length > 1
                    "
                  >
                    <span class="text-white">{{
                      (videoInfo.text || "Facebook Video")
                        .split(" ")
                        .slice(0, -1)
                        .join(" ")
                    }}</span>
                    <span class="text-[#1877F2]">{{
                      (videoInfo.text || "Facebook Video")
                        .split(" ")
                        .slice(-1)[0]
                    }}</span>
                  </template>
                  <span v-else class="text-[#1877F2]">{{
                    videoInfo.text || "Facebook Video"
                  }}</span>
                </h1>
                <div
                  v-if="videoInfo.duration && videoInfo.videoUrl"
                  class="flex flex-wrap items-center gap-6 text-white/50 text-sm font-medium"
                >
                  <span class="flex items-center gap-2">
                    <iconify-icon icon="lucide:clock" class="text-white/60" />
                    {{ videoInfo.duration }} detik
                  </span>
                </div>
              </div>

              <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                <!-- Download Video (satu tombol, pakai kualitas terpilih) -->
                <div
                  v-if="videoInfo.videoUrl"
                  class="space-y-3"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between bg-[#1877F2] hover:bg-[#1877F2]/90 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:shadow-[0_0_40px_rgba(24,119,242,0.3)] transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="downloadVideoLoading || (showDownloadProgressModal && !downloadSuccess)"
                    @click="handleDownloadVideo"
                  >
                    <div class="flex flex-col min-w-0">
                      <span
                        class="font-heading font-black text-base sm:text-xl uppercase italic"
                      >
                        {{
                          downloadVideoLoading
                            ? "Memproses..."
                            : "Download Video"
                        }}
                      </span>
                      <span
                        class="text-white/70 text-xs font-bold uppercase tracking-widest mt-1"
                      >
                        Format: MP4
                      </span>
                    </div>
                    <div
                      class="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"
                    >
                      <iconify-icon
                        icon="lucide:download"
                        class="text-xl sm:text-2xl"
                      />
                    </div>
                  </button>
                  <p
                    class="text-center text-[10px] text-white/30 uppercase font-black tracking-widest"
                  >
                    Unduh video Facebook
                  </p>
                </div>
              </div>

              <div class="pt-4">
                <button
                  type="button"
                  class="inline-flex items-center gap-3 text-[#1877F2] font-heading font-black uppercase text-sm tracking-widest hover:translate-x-2 transition-transform"
                  @click="onDownloadAnother"
                >
                  <iconify-icon icon="lucide:arrow-left" class="text-lg" />
                  Download Another
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>

  <!-- Recent History -->
  <section
    class="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-24 border-t border-white/5"
  >
    <div
      class="flex items-center justify-between mb-8 sm:mb-12 flex-wrap gap-4"
    >
      <div>
        <h2
          class="font-heading text-2xl sm:text-3xl md:text-4xl font-black uppercase italic"
        >
          Recent <span class="text-[#1877F2]">History</span>
        </h2>
        <p class="text-white/30 text-xs sm:text-sm mt-1 sm:mt-2">
          Riwayat unduhan Facebook Anda
        </p>
      </div>
      <button
        type="button"
        class="text-[#1877F2] font-heading font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
        @click="clearHistory"
      >
        Clear History
      </button>
    </div>
    <div
      v-if="!historyReady"
      class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
    >
      <div
        v-for="i in 5"
        :key="i"
        class="glass-panel rounded-2xl overflow-hidden animate-pulse"
      >
        <div class="aspect-4/5 bg-white/5" />
        <div class="p-4 space-y-2">
          <div class="h-3 w-16 bg-white/10 rounded" />
          <div class="h-4 w-full bg-white/10 rounded" />
        </div>
      </div>
    </div>
    <Empty
      v-else-if="!historyItems?.length"
      class="border-white/5 py-4 md:py-16 text-white/30 flex flex-col text-center items-center justify-center gap-4"
    >
      <EmptyHeader>
        <iconify-icon icon="lucide:history" class="text-4xl text-[#1877F2]" />
      </EmptyHeader>
      <EmptyContent>
        Belum ada riwayat. Isi link Facebook lalu klik Download untuk menambah.
      </EmptyContent>
    </Empty>
    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
    >
      <div
        v-for="item in historyItems ?? []"
        :key="item.id"
        class="group relative glass-panel rounded-2xl overflow-hidden hover:border-[#1877F2]/50 transition-all"
      >
        <div class="aspect-4/5 bg-neutral-900 relative">
          <img
            :src="getHistoryPreviewUrl(item)"
            :alt="item.title"
            class="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity"
            @error="
              (e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                const pl = img.nextElementSibling as HTMLElement;
                if (pl) {
                  pl.classList.remove('hidden');
                  pl.style.display = 'flex';
                }
              }
            "
          />
          <div
            class="absolute inset-0 hidden items-center justify-center bg-neutral-800"
            aria-hidden="true"
          >
            <iconify-icon icon="lucide:video" class="text-white/20 text-4xl" />
          </div>
        </div>
        <div class="p-3 sm:p-4">
          <p
            class="text-[10px] font-heading font-black uppercase tracking-tighter text-[#1877F2]"
          >
            {{ item.type }}
          </p>
          <p class="text-xs font-bold truncate mt-1">{{ item.title }}</p>
        </div>
        <button
          type="button"
          class="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition-all opacity-0 group-hover:opacity-100 touch-manipulation"
          title="Buka & download lagi"
          @click="openHistoryItem(item)"
        >
          <iconify-icon icon="lucide:download" class="text-white text-xs" />
        </button>
      </div>
    </div>
  </section>

  <!-- Download Progress Modal (sama seperti TikTok) -->
  <LoadingProgress
    :open="showDownloadProgressModal"
    :progress="downloadProgress"
    :status-text="downloadStatusText"
    :stage-label="downloadStageLabel"
    :file-name="downloadFileName"
    :loaded-bytes="downloadLoadedBytes"
    :total-bytes="downloadTotalBytes"
    :speed-bytes-per-sec="downloadSpeedBytesPerSec"
    :remaining-sec="downloadRemainingSec"
    :success="downloadSuccess"
    :completed-file-name="downloadCompleteFilename"
    :metadata="downloadProgressMetadata"
    @close="closeProgressModal"
    @save="onProgressModalSave"
    @download-new="onProgressModalDownloadNew"
  />
</template>

<script setup lang="ts">
import { watch } from "vue";
import { toast } from "vue-sonner";
import { useStateFacebook } from "~/services/useStateFacebook";
import { Empty, EmptyHeader, EmptyContent } from "~/components/ui/empty";
import LoadingProgress from "~/components/LoadingProgress.vue";

const {
  videoUrl,
  downloadLoading,
  downloadError,
  downloadVideoLoading,
  videoLoadFailed,
  videoInfo,
  historyItems,
  historyReady,
  clearHistory,
  openHistoryItem,
  getHistoryPreviewUrl,
  onSearch,
  onDownloadVideo,
  onDownloadAnother,
  showDownloadProgressModal,
  downloadProgress,
  downloadStatusText,
  downloadStageLabel,
  downloadFileName,
  downloadLoadedBytes,
  downloadTotalBytes,
  downloadSpeedBytesPerSec,
  downloadRemainingSec,
  downloadSuccess,
  downloadCompleteFilename,
  downloadProgressMetadata,
  downloadProgressError,
  closeProgressModal,
  onProgressModalSave,
  onProgressModalDownloadNew,
} = useStateFacebook();

watch(downloadProgressError, (err) => {
  if (err) {
    toast.error(err);
  }
});

const onPaste = async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text?.trim()) {
      videoUrl.value = text.trim();
      toast.success("Link berhasil ditempel");
    } else {
      toast.error("Clipboard kosong atau bukan teks");
    }
  } catch {
    toast.error(
      "Akses clipboard ditolak. Izinkan akses atau tempel manual (Ctrl+V)",
    );
  }
};

async function handleDownloadVideo() {
  try {
    await onDownloadVideo();
  } catch {
    toast.error("Gagal unduh video");
  }
}
</script>
