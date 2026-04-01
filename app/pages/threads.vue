<template>
  <section class="relative overflow-hidden">
    <div
      class="absolute top-20 left-10 text-[18rem] font-heading font-black text-outline uppercase select-none pointer-events-none hidden xl:block leading-none"
    >
      THREADS
    </div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-8 pb-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-16">
        <div class="order-2 lg:order-1">
          <div class="mb-6 inline-flex items-center gap-3">
            <div class="w-12 h-[2px] bg-[#FF3D57]" />
            <span class="uppercase tracking-[0.4em] text-xs font-heading font-black text-[#FF3D57]">
              Be Different
            </span>
          </div>

          <h1 class="font-heading text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] mb-6 sm:mb-8">
            Threads Post <br />
            <span class="text-[#FF3D57]">Downloader</span>
          </h1>

          <p class="text-white/50 text-base sm:text-lg max-w-lg mb-8 sm:mb-12">
            Download media dari Threads dalam satu klik. Ambil video, gambar, dan caption dengan cepat.
          </p>

          <div id="download-input" class="relative w-full max-w-2xl mb-8 sm:mb-12">
            <div
              class="bg-[#1A1A1A] p-2 sm:p-3 rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 border border-white/5 shadow-2xl shadow-black/40 focus-within:border-[#FF3D57]/50 transition-all"
            >
              <UiInput
                v-model="threadUrl"
                type="text"
                placeholder="Insert Threads Post Link Here..."
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
                  class="bg-gradient-coral hover:scale-105 active:scale-95 transition-all text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-heading font-black uppercase text-xs sm:text-sm tracking-widest shadow-lg shadow-[#FF3D57]/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  :disabled="downloadLoading"
                  @click="onSearch"
                >
                  {{ downloadLoading ? "..." : "Download" }}
                </button>
              </div>
            </div>
            <p v-if="downloadError" class="mt-3 text-sm text-red-400">{{ downloadError }}</p>
          </div>

          <div class="flex flex-wrap items-center gap-4 sm:gap-8">
            <span class="text-xs uppercase font-heading font-black text-white/30 tracking-widest">Supported :</span>
            <div class="flex gap-4 sm:gap-6">
              <iconify-icon icon="lucide:monitor" class="text-xl text-white/50 hover:text-white cursor-pointer transition-colors" />
              <iconify-icon icon="lucide:smartphone" class="text-xl text-white/50 hover:text-white cursor-pointer transition-colors" />
              <iconify-icon icon="lucide:tablet" class="text-xl text-white/50 hover:text-white cursor-pointer transition-colors" />
              <iconify-icon icon="lucide:laptop" class="text-xl text-white/50 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div class="order-1 lg:order-2 relative">
          <div class="absolute -top-10 -right-10 w-full h-full pointer-events-none opacity-20">
            <svg viewBox="0 0 400 400" class="w-full h-full text-[#FF3D57]">
              <path d="M10,200 Q100,100 200,200 T390,200" fill="none" stroke="currentColor" stroke-width="2" class="wavy-line" />
              <path d="M10,250 Q100,150 200,250 T390,250" fill="none" stroke="currentColor" stroke-width="1" class="wavy-line" style="animation-delay: -1s" />
            </svg>
          </div>
          <div class="relative z-10 flex justify-center lg:justify-end">
            <div
              class="w-full max-w-[280px] sm:max-w-[380px] md:max-w-[500px] h-[220px] sm:h-[280px] md:h-[350px] bg-[#1A1A1A] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div class="h-8 bg-[#252525] flex items-center px-4 gap-2">
                <div class="w-2 h-2 rounded-full bg-[#FF3D57]" />
                <div class="w-2 h-2 rounded-full bg-white/10" />
                <div class="w-2 h-2 rounded-full bg-white/10" />
              </div>
              <div class="p-4 sm:p-6 md:p-8">
                <div class="w-2/3 h-3 sm:h-4 bg-white/5 rounded mb-2 sm:mb-4" />
                <div class="w-full h-8 sm:h-12 bg-white/5 rounded-full mb-4 sm:mb-8" />
                <div class="grid grid-cols-2 gap-2 sm:gap-4">
                  <div class="h-16 sm:h-24 md:h-32 bg-[#FF3D57]/10 rounded-lg sm:rounded-xl border border-[#FF3D57]/20" />
                  <div class="h-16 sm:h-24 md:h-32 bg-white/5 rounded-lg sm:rounded-xl border border-white/5" />
                </div>
              </div>
              <div
                class="absolute -bottom-10 -left-10 w-[180px] h-[360px] bg-black rounded-[3rem] border-4 border-[#252525] overflow-hidden shadow-2xl hidden md:block"
              >
                <div class="absolute top-0 w-full h-6 bg-[#252525]" />
                <img
                  src="https://images.unsplash.com/photo-1640397983578-2f7b52c4f151?auto=format&fit=crop&q=80&w=400"
                  alt=""
                  class="w-full h-full object-cover opacity-60"
                />
                <div class="absolute inset-0 bg-linear-to-t from-black to-transparent flex flex-col justify-end p-6">
                  <div class="w-full h-10 bg-gradient-coral rounded-lg flex items-center justify-center mb-4">
                    <span class="text-[10px] font-heading font-black uppercase tracking-widest">Download Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute -top-2 right-4 sm:right-10 floating-emoji hidden sm:block">
            <iconify-icon icon="noto:sparkles" class="text-3xl md:text-4xl" />
          </div>
          <div class="absolute bottom-12 left-0 sm:bottom-20 floating-emoji hidden sm:block" style="animation-delay: -1.5s">
            <iconify-icon icon="noto:fire" class="text-4xl md:text-5xl" />
          </div>
        </div>
      </div>

      <div class="relative mt-8 sm:mt-12 w-full">
        <div
          v-if="videoInfo"
          class="absolute top-20 left-4 text-[12rem] xl:text-[18rem] font-heading font-black text-outline uppercase select-none pointer-events-none hidden xl:block leading-none"
        >
          SUCCESS
        </div>
        <div v-if="downloadLoading" class="relative z-10 results-enter flex justify-center items-center py-24">
          <div class="flex flex-col items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <span class="w-8 h-8 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
            </div>
            <span class="text-white font-medium">Memuat...</span>
            <span class="text-sm text-white/50">Mengambil data Threads</span>
          </div>
        </div>

        <template v-else-if="videoInfo">
          <div class="relative z-10 mb-6 sm:mb-10 results-enter">
            <div
              class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 max-w-2xl"
            >
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <iconify-icon icon="lucide:check-circle" class="text-white text-xl" />
              </div>
              <div>
                <p class="font-heading font-black text-sm uppercase tracking-wider text-emerald-400">Ready for Download</p>
                <p class="text-white/60 text-xs">
                  Post Threads berhasil diproses dan siap diunduh.
                </p>
              </div>
            </div>
          </div>

          <div class="relative z-10 grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start results-enter">
            <div class="lg:col-span-4 group max-w-[280px] mx-auto lg:max-w-none lg:mx-0">
              <div
                class="relative aspect-9/16 bg-[#1A1A1A] rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-transform group-hover:scale-[1.01]"
              >
                <template v-if="videoInfo.mediaItems?.length">
                  <video
                    v-if="videoInfo.mediaItems[imageIndex]?.type === 'video'"
                    :key="`success-v-${imageIndex}`"
                    :src="videoInfo.mediaItems[imageIndex]?.previewUrl"
                    class="w-full h-full object-cover"
                    controls
                    playsinline
                  />
                  <img
                    v-else
                    :key="`success-i-${imageIndex}`"
                    :src="videoInfo.mediaItems[imageIndex]?.previewUrl"
                    alt="Preview"
                    class="w-full h-full object-cover"
                  />

                  <div v-if="videoInfo.mediaItems.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    <button
                      v-for="(_, i) in videoInfo.mediaItems"
                      :key="i"
                      type="button"
                      class="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                      :class="imageIndex === i ? 'bg-white text-black' : 'bg-white/30 text-white/80'"
                      @click.stop="imageIndex = i"
                    >
                      {{ Number(i) + 1 }}
                    </button>
                  </div>

                  <button
                    v-if="videoInfo.mediaItems.length > 1"
                    type="button"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 flex items-center justify-center text-white z-10 transition-all hover:scale-110"
                    :disabled="imageIndex === 0"
                    @click.stop="imageIndex = Math.max(0, imageIndex - 1)"
                  >
                    <iconify-icon icon="lucide:chevron-left" class="text-xl" />
                  </button>
                  <button
                    v-if="videoInfo.mediaItems.length > 1"
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 flex items-center justify-center text-white z-10 transition-all hover:scale-110"
                    :disabled="imageIndex >= videoInfo.mediaItems.length - 1"
                    @click.stop="imageIndex = Math.min(videoInfo.mediaItems.length - 1, imageIndex + 1)"
                  >
                    <iconify-icon icon="lucide:chevron-right" class="text-xl" />
                  </button>
                </template>
                <div v-else class="w-full h-full flex items-center justify-center text-white/40">
                  No preview
                </div>
                <div
                  class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-8 pointer-events-none"
                />
              </div>
            </div>

            <div class="lg:col-span-8 space-y-6 md:space-y-10">
              <div>
                <div class="inline-flex items-center gap-3 mb-6">
                  <div class="w-12 h-[2px] bg-[#FF3D57]" />
                  <span class="uppercase tracking-[0.4em] text-xs font-heading font-black text-[#FF3D57]">
                    Threads Result
                  </span>
                </div>
                <h1 class="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-3 sm:mb-4">
                  <span class="text-white line-clamp-2">{{ videoInfo.text || "Threads Post" }}</span>
                </h1>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div class="space-y-3">
                  <button
                    type="button"
                    class="w-full flex items-center justify-between bg-gradient-coral text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:shadow-[0_0_40px_rgba(255,61,87,0.3)] transition-all group"
                    @click="onDownloadCurrentSlide"
                  >
                    <div class="flex flex-col min-w-0">
                      <span class="font-heading font-black text-base sm:text-xl uppercase italic">
                        Download {{ videoInfo.mediaItems?.[imageIndex]?.type === "video" ? "Video" : "Image" }}
                      </span>
                      <span class="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">
                        Item {{ imageIndex + 1 }}
                      </span>
                    </div>
                    <div
                      class="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"
                    >
                      <iconify-icon icon="lucide:download" class="text-xl sm:text-2xl" />
                    </div>
                  </button>
                </div>

                <div class="space-y-3">
                  <button
                    type="button"
                    class="w-full flex items-center justify-between glass-panel text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:bg-white/10 transition-all group"
                    @click="onDownloadAnother"
                  >
                    <div class="flex flex-col min-w-0">
                      <span class="font-heading font-black text-base sm:text-xl uppercase italic">
                        Download Another
                      </span>
                      <span class="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">
                        New Threads Link
                      </span>
                    </div>
                    <div
                      class="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"
                    >
                      <iconify-icon icon="lucide:refresh-cw" class="text-xl sm:text-2xl" />
                    </div>
                  </button>
                </div>
              </div>

              <div class="pt-4">
                <button
                  type="button"
                  class="inline-flex items-center gap-3 text-[#FF3D57] font-heading font-black uppercase text-sm tracking-widest hover:translate-x-2 transition-transform"
                  @click="onDownloadAnother"
                >
                  <iconify-icon icon="lucide:arrow-left" class="text-lg" />
                  Download Another Post
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>

  <section class="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-24 border-t border-white/5">
    <div class="flex items-center justify-between mb-8 sm:mb-12 flex-wrap gap-4">
      <div>
        <h2 class="font-heading text-2xl sm:text-3xl md:text-4xl font-black uppercase italic">
          Recent <span class="text-[#FF3D57]">History</span>
        </h2>
        <p class="text-white/30 text-xs sm:text-sm mt-1 sm:mt-2">
          Your lately processed downloads
        </p>
      </div>
      <button
        type="button"
        class="text-[#FF3D57] font-heading font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
        @click="clearHistory"
      >
        Clear History
      </button>
    </div>

    <div v-if="!historyReady" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
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
    <div
      v-else-if="!historyItems.length"
      class="border border-white/5 rounded-2xl py-10 sm:py-16 text-white/30 flex flex-col text-center items-center justify-center gap-4"
    >
      <iconify-icon icon="lucide:history" class="text-4xl text-[#FF3D57]" />
      <p>Belum ada riwayat. Isi link Threads lalu klik Download untuk menambah.</p>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      <div
        v-for="item in historyItems"
        :key="item.id"
        class="group relative glass-panel rounded-2xl overflow-hidden hover:border-[#FF3D57]/50 transition-all"
      >
        <div class="aspect-4/5 bg-neutral-900 relative">
          <img
            v-if="item.cover"
            :src="item.cover"
            :alt="item.title"
            class="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity"
          />
          <div v-else class="absolute inset-0 flex items-center justify-center bg-neutral-800">
            <iconify-icon icon="lucide:image" class="text-white/20 text-4xl" />
          </div>
        </div>
        <div class="p-3 sm:p-4">
          <p class="text-[10px] font-heading font-black uppercase tracking-tighter text-[#FF3D57]">
            {{ item.type }}
          </p>
          <p class="text-xs font-bold truncate mt-1">{{ item.title }}</p>
        </div>
        <button
          type="button"
          class="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-[#FF3D57] transition-all opacity-0 group-hover:opacity-100"
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
import { useStateThread } from "~/services/thread.service";

const {
  threadUrl,
  imageIndex,
  videoInfo,
  historyItems,
  historyReady,
  downloadLoading,
  downloadError,
  onSearch,
  onPaste,
  onDownloadCurrentSlide,
  onDownloadAnother,
  openHistoryItem,
  clearHistory,
} = useStateThread();
</script>
