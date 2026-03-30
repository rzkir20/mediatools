<template>
  <section class="relative overflow-hidden">
    <div
      class="absolute top-20 left-10 text-[18rem] font-heading font-black text-outline uppercase select-none pointer-events-none hidden xl:block leading-none"
    >
      DOWNLOADER
    </div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-8 pb-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-16">
        <div class="order-2 lg:order-1">
          <div class="mb-6 inline-flex items-center gap-3">
            <div class="w-12 h-[2px] bg-[#E4405F]" />
            <span
              class="uppercase tracking-[0.4em] text-xs font-heading font-black text-[#E4405F]"
              >Instagram</span
            >
          </div>

          <h1
            class="font-heading text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] mb-6 sm:mb-8"
          >
            Instagram <br />
            <span class="text-[#E4405F]">Downloader</span>
          </h1>

          <p class="text-white/50 text-base sm:text-lg max-w-lg mb-8 sm:mb-12">
            Download Reels, posts, and carousels. Paste any public Instagram
            post or Reel link and get your file in seconds.
          </p>

          <div id="download-input" class="relative w-full max-w-2xl mb-8 sm:mb-12">
            <div
              class="bg-[#1A1A1A] p-2 sm:p-3 rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 border border-white/5 shadow-2xl shadow-black/40 focus-within:border-[#E4405F]/50 transition-all"
            >
              <UiInput
                v-model="videoUrl"
                type="text"
                placeholder="Insert Instagram Post / Reel Link Here..."
                class="bg-transparent flex-1 min-w-0 py-3 sm:py-4 pl-4 sm:pl-5 text-sm sm:text-base text-white outline-none placeholder:text-white/20 font-medium border-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
              />
              <div class="flex items-center justify-end sm:justify-start gap-2 shrink-0">
                <button
                  type="button"
                  class="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all shrink-0"
                  title="Tempel dari clipboard"
                  @click="onPaste"
                >
                  <iconify-icon icon="lucide:clipboard-paste" class="text-lg" />
                  <span class="text-xs font-heading font-black uppercase tracking-widest hidden sm:inline">Tempel</span>
                </button>
                <button
                  type="button"
                  class="bg-[#E4405F] hover:bg-[#E4405F]/90 hover:scale-105 active:scale-95 transition-all text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-heading font-black uppercase text-xs sm:text-sm tracking-widest shadow-lg shadow-[#E4405F]/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
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
              icon="mdi:instagram"
              class="text-[80px] sm:text-[100px] md:text-[120px] text-[#E4405F]/30"
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
            <span class="text-sm text-white/50">Mengambil data post</span>
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
                  Your Instagram post/reel has been processed and is ready for
                  saving.
                </p>
              </div>
            </div>
          </div>

          <div
            class="relative z-10 grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start results-enter"
          >
            <div class="lg:col-span-4 group max-w-[280px] mx-auto lg:max-w-none lg:mx-0">
              <div
                class="relative aspect-4/6 bg-[#1A1A1A] rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-transform group-hover:scale-[1.01]"
              >
                <!-- Preview: foto / carousel (pakai proxy agar image tidak corrupt di browser) -->
                <template v-if="videoInfo?.images?.length">
                  <img
                    :src="
                      videoInfo.previewImageUrls?.[imageIndex] ||
                      videoInfo.images[imageIndex]
                    "
                    alt="Preview"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-if="videoInfo?.images && videoInfo.images.length > 1"
                    class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
                  >
                    <button
                      v-for="(_, i) in videoInfo?.images ?? []"
                      :key="i"
                      type="button"
                      class="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                      :class="
                        imageIndex === i
                          ? 'bg-white text-black'
                          : 'bg-white/30 text-white/80'
                      "
                      @click.stop="imageIndex = i"
                    >
                      {{ Number(i) + 1 }}
                    </button>
                  </div>
                  <button
                    v-if="videoInfo?.images && videoInfo.images.length > 1"
                    type="button"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 flex items-center justify-center text-white z-10 transition-all hover:scale-110"
                    :disabled="imageIndex === 0"
                    @click.stop="imageIndex = Math.max(0, imageIndex - 1)"
                  >
                    <iconify-icon icon="lucide:chevron-left" class="text-xl" />
                  </button>
                  <button
                    v-if="videoInfo?.images && videoInfo.images.length > 1"
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 flex items-center justify-center text-white z-10 transition-all hover:scale-110"
                    :disabled="
                      imageIndex >= (videoInfo?.images?.length ?? 0) - 1
                    "
                    @click.stop="
                      imageIndex = Math.min(
                        (videoInfo?.images?.length ?? 1) - 1,
                        imageIndex + 1,
                      )
                    "
                  >
                    <iconify-icon icon="lucide:chevron-right" class="text-xl" />
                  </button>
                </template>
                <!-- Preview: Reel/video — preview image (cover) + video (pakai proxy agar tidak corrupt) -->
                <template v-else>
                  <!-- Preview image (thumbnail/cover) — lewat proxy BE -->
                  <img
                    v-if="videoInfo.cover || videoInfo.previewImageUrls?.length"
                    :src="videoInfo.previewImageUrls?.[0] || videoInfo.cover"
                    alt="Preview Reel"
                    class="absolute inset-0 w-full h-full object-cover z-0"
                  />
                  <!-- Video player di atas cover (user bisa putar) -->
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
                  <!-- Tanpa cover & tanpa video: placeholder -->
                  <div
                    v-if="
                      !videoInfo.cover &&
                      (videoLoadFailed || !videoInfo.videoUrl)
                    "
                    class="absolute inset-0 flex items-center justify-center bg-neutral-800 z-0"
                  >
                    <iconify-icon
                      icon="lucide:image"
                      class="text-white/20 text-5xl"
                    />
                  </div>
                </template>
                <!-- Gradient & play icon overlay -->
                <div
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
                  <div class="w-12 h-[2px] bg-[#E4405F]" />
                  <span
                    class="uppercase tracking-[0.4em] text-xs font-heading font-black text-[#E4405F]"
                    >Instagram Result</span
                  >
                </div>
                <h1
                  class="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-3 sm:mb-4"
                >
                  <template
                    v-if="
                      (videoInfo.text || 'Instagram Post').split(' ').length > 1
                    "
                  >
                    <span class="text-white">{{
                      (videoInfo.text || "Instagram Post")
                        .split(" ")
                        .slice(0, -1)
                        .join(" ")
                    }}</span>
                    <span class="text-[#E4405F]">{{
                      (videoInfo.text || "Instagram Post")
                        .split(" ")
                        .slice(-1)[0]
                    }}</span>
                  </template>
                  <span v-else class="text-[#E4405F]">{{
                    videoInfo.text || "Instagram Post"
                  }}</span>
                </h1>
                <div
                  class="flex flex-wrap items-center gap-6 text-white/50 text-sm font-medium"
                >
                  <div v-if="videoInfo.author" class="flex items-center gap-2">
                    <div
                      class="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center"
                    >
                      <iconify-icon icon="lucide:user" class="text-white/60" />
                    </div>
                    <span class="text-white font-bold">{{
                      videoInfo.author.startsWith("@")
                        ? videoInfo.author
                        : `@${videoInfo.author}`
                    }}</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div
                  v-if="
                    videoInfo.videoUrl &&
                    (!videoInfo.images || videoInfo.images.length === 0)
                  "
                  class="space-y-3"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between bg-[#E4405F] hover:bg-[#E4405F]/90 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:shadow-[0_0_40px_rgba(228,64,95,0.3)] transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="downloadVideoLoading"
                    @click="onDownloadVideo"
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
                        >Format: MP4</span
                      >
                    </div>
                    <div
                      class="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"
                    >
                      <iconify-icon icon="lucide:download" class="text-xl sm:text-2xl" />
                    </div>
                  </button>
                  <p
                    class="text-center text-[10px] text-white/30 uppercase font-black tracking-widest"
                  >
                    Reel / video
                  </p>
                </div>

                <div
                  v-if="videoInfo.images && videoInfo.images.length > 0"
                  class="space-y-3"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between glass-panel text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:bg-white/10 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="downloadImagesLoading"
                    @click="onDownloadImages"
                  >
                    <div class="flex flex-col min-w-0">
                      <span
                        class="font-heading font-black text-base sm:text-xl uppercase italic"
                      >
                        {{
                          downloadImagesLoading
                            ? "Memproses..."
                            : "Download Image"
                        }}
                      </span>
                      <span
                        class="text-white/70 text-xs font-bold uppercase tracking-widest mt-1"
                      >
                        {{
                          (videoInfo?.images?.length ?? 0) > 1
                            ? `${imageIndex + 1} of ${videoInfo?.images?.length ?? 0}`
                            : "JPG/WEBP"
                        }}
                      </span>
                    </div>
                    <div
                      class="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"
                    >
                      <iconify-icon icon="lucide:image" class="text-xl sm:text-2xl" />
                    </div>
                  </button>
                  <p
                    class="text-center text-[10px] text-white/30 uppercase font-black tracking-widest"
                  >
                    Foto / carousel
                  </p>
                </div>
              </div>

              <div
                v-if="videoInfo.videoUrl && videoInfo.images?.length"
                class="pt-6 sm:pt-8 border-t border-white/5"
              >
                <div class="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <h3
                    class="text-sm font-heading font-black uppercase tracking-widest text-white/40"
                  >
                    More Options
                  </h3>
                  <div class="flex-1 h-px bg-white/5" />
                </div>
                <div class="flex flex-wrap gap-3 sm:gap-4">
                  <button
                    v-if="videoInfo.images && videoInfo.images.length > 0"
                    type="button"
                    class="px-4 sm:px-6 py-3 sm:py-4 glass-panel rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 hover:border-[#E4405F]/30 transition-all disabled:opacity-60"
                    :disabled="downloadImagesLoading"
                    @click="onDownloadImages"
                  >
                    <iconify-icon icon="lucide:image" class="text-[#E4405F]" />
                    <span class="text-xs sm:text-sm font-bold">Download Image</span>
                  </button>
                  <button
                    v-if="videoInfo.videoUrl"
                    type="button"
                    class="px-4 sm:px-6 py-3 sm:py-4 glass-panel rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 hover:border-[#E4405F]/30 transition-all disabled:opacity-60"
                    :disabled="downloadVideoLoading"
                    @click="onDownloadVideo"
                  >
                    <iconify-icon
                      icon="lucide:download"
                      class="text-[#E4405F]"
                    />
                    <span class="text-xs sm:text-sm font-bold">Download Video</span>
                  </button>
                </div>
              </div>

              <div class="pt-4">
                <button
                  type="button"
                  class="inline-flex items-center gap-3 text-[#E4405F] font-heading font-black uppercase text-sm tracking-widest hover:translate-x-2 transition-transform"
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
    <div class="flex items-center justify-between mb-8 sm:mb-12 flex-wrap gap-4">
      <div>
        <h2
          class="font-heading text-2xl sm:text-3xl md:text-4xl font-black uppercase italic"
        >
          Recent <span class="text-[#E4405F]">History</span>
        </h2>
        <p class="text-white/30 text-xs sm:text-sm mt-1 sm:mt-2">
          Your lately processed Instagram downloads
        </p>
      </div>
      <button
        type="button"
        class="text-[#E4405F] font-heading font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
        @click="clearHistory"
      >
        Clear History
      </button>
    </div>
    <!-- Skeleton saat history belum di-load dari localStorage (hindari flash "tidak ada history") -->
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
        <iconify-icon icon="lucide:history" class="text-4xl text-[#E4405F]" />
      </EmptyHeader>
      <EmptyContent>
        Belum ada riwayat. Isi link Instagram lalu klik Download untuk menambah.
      </EmptyContent>
    </Empty>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      <div
        v-for="item in historyItems ?? []"
        :key="item.id"
        class="group relative glass-panel rounded-2xl overflow-hidden hover:border-[#E4405F]/50 transition-all"
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
            <iconify-icon icon="lucide:image" class="text-white/20 text-4xl" />
          </div>
        </div>
        <div class="p-3 sm:p-4">
          <p
            class="text-[10px] font-heading font-black uppercase tracking-tighter text-[#E4405F]"
          >
            {{ item.type }}
          </p>
          <p class="text-xs font-bold truncate mt-1">{{ item.title }}</p>
        </div>
        <button
          type="button"
          class="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-[#E4405F] transition-all opacity-0 group-hover:opacity-100 touch-manipulation"
          title="Buka & download lagi"
          @click="openHistoryItem(item)"
        >
          <iconify-icon icon="lucide:download" class="text-white text-xs" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";
import { useStateInstagram } from "~/services/useStateInstagram";
import { Empty, EmptyHeader, EmptyContent } from "~/components/ui/empty";

const {
  videoUrl,
  downloadLoading,
  downloadError,
  downloadVideoLoading,
  downloadImagesLoading,
  videoLoadFailed,
  videoInfo,
  imageIndex,
  historyItems,
  historyReady,
  clearHistory,
  openHistoryItem,
  getHistoryPreviewUrl,
  onSearch,
  onDownloadVideo,
  onDownloadImages,
  onDownloadAnother,
} = useStateInstagram();

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
    toast.error("Akses clipboard ditolak. Izinkan akses atau tempel manual (Ctrl+V)");
  }
};
</script>
