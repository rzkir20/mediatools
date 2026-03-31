<template>
  <section class="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
    <div class="max-w-4xl">
      <h1 class="font-heading text-4xl sm:text-5xl font-black">
        Threads <span class="text-[#FF3D57]">Downloader</span>
      </h1>
      <p class="text-white/50 mt-3">
        Paste link Threads post untuk ambil video, image, dan caption.
      </p>
    </div>

    <div id="download-input" class="mt-8 max-w-4xl">
      <div
        class="bg-[#1A1A1A] p-2 sm:p-3 rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-white/10"
      >
        <UiInput
          v-model="threadUrl"
          type="text"
          placeholder="https://www.threads.net/@username/post/..."
          class="bg-transparent flex-1 min-w-0 py-3 sm:py-4 pl-4 sm:pl-5 text-sm sm:text-base text-white border-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
        />
        <button
          type="button"
          class="bg-gradient-coral text-white px-8 py-3 sm:py-4 rounded-full font-heading font-black uppercase text-xs sm:text-sm tracking-widest disabled:opacity-60"
          :disabled="downloadLoading"
          @click="onSearch"
        >
          {{ downloadLoading ? "..." : "Get Data" }}
        </button>
      </div>
      <p v-if="downloadError" class="mt-3 text-sm text-red-400">{{ downloadError }}</p>
    </div>

    <div v-if="downloadLoading" class="py-20 text-center">
      <span class="text-white/70">Mengambil data Threads...</span>
    </div>

    <div v-else-if="videoInfo" class="mt-10 grid lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-4">
        <div class="relative aspect-4/6 rounded-2xl overflow-hidden border border-white/10 bg-[#1A1A1A]">
          <template v-if="videoInfo.mediaItems?.length">
            <video
              v-if="videoInfo.mediaItems[imageIndex]?.type === 'video'"
              :key="`slide-v-${imageIndex}`"
              :src="videoInfo.mediaItems[imageIndex]?.previewUrl"
              class="w-full h-full object-cover"
              controls
              playsinline
            />
            <img
              v-else
              :key="`slide-i-${imageIndex}`"
              :src="videoInfo.mediaItems[imageIndex]?.previewUrl"
              alt="Threads Preview"
              class="w-full h-full object-cover"
            />
            <button
              v-if="videoInfo.mediaItems.length > 1"
              type="button"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-40"
              :disabled="imageIndex === 0"
              @click="imageIndex = Math.max(0, imageIndex - 1)"
            >
              <iconify-icon icon="lucide:chevron-left" class="text-lg" />
            </button>
            <button
              v-if="videoInfo.mediaItems.length > 1"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-40"
              :disabled="imageIndex >= videoInfo.mediaItems.length - 1"
              @click="imageIndex = Math.min(videoInfo.mediaItems.length - 1, imageIndex + 1)"
            >
              <iconify-icon icon="lucide:chevron-right" class="text-lg" />
            </button>
          </template>
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-white/40"
          >
            No preview
          </div>
        </div>

        <div v-if="videoInfo.mediaItems && videoInfo.mediaItems.length > 1" class="mt-3 flex gap-2 flex-wrap items-center">
          <button
            v-for="(slide, i) in videoInfo.mediaItems"
            :key="i"
            type="button"
            class="px-3 py-1 rounded-full text-xs font-bold"
            :class="imageIndex === i ? 'bg-white text-black' : 'bg-white/20 text-white'"
            :title="slide.type === 'video' ? 'Video' : 'Gambar'"
            @click="imageIndex = i"
          >
            {{ i + 1 }}
            <span class="opacity-60 font-normal">{{ slide.type === 'video' ? '▶' : '▣' }}</span>
          </button>
        </div>
      </div>

      <div class="lg:col-span-8 space-y-6">
        <div>
          <h2 class="font-heading text-2xl sm:text-3xl font-black">Caption</h2>
          <p class="text-white/80 mt-2 whitespace-pre-line">
            {{ videoInfo.text || "-" }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            v-if="videoInfo.mediaItems?.length"
            type="button"
            class="px-5 py-3 rounded-xl bg-[#FF3D57] text-white font-bold"
            @click="onDownloadCurrentSlide"
          >
            Download
            {{ videoInfo.mediaItems[imageIndex]?.type === 'video' ? 'Video' : 'Gambar' }}
            ({{ imageIndex + 1 }})
          </button>
          <button
            type="button"
            class="px-5 py-3 rounded-xl bg-transparent text-[#FF3D57] border border-[#FF3D57]/40 font-bold"
            @click="onDownloadAnother"
          >
            Download Another
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="container mx-auto px-4 sm:px-6 pb-12">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-heading text-2xl font-black">Recent History</h3>
      <button
        type="button"
        class="text-[#FF3D57] text-xs uppercase font-bold tracking-widest"
        @click="clearHistory"
      >
        Clear History
      </button>
    </div>

    <div v-if="!historyReady" class="text-white/40">Loading history...</div>
    <div v-else-if="!historyItems.length" class="text-white/40">Belum ada history.</div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <button
        v-for="item in historyItems"
        :key="item.id"
        type="button"
        class="text-left rounded-xl overflow-hidden border border-white/10 bg-white/5"
        @click="openHistoryItem(item)"
      >
        <div class="aspect-4/5 bg-black/40">
          <img
            v-if="item.cover"
            :src="item.cover"
            :alt="item.title"
            class="w-full h-full object-cover opacity-80"
          />
        </div>
        <div class="p-3">
          <p class="text-[10px] uppercase tracking-widest text-[#FF3D57]">{{ item.type }}</p>
          <p class="text-xs font-bold truncate mt-1">{{ item.title }}</p>
        </div>
      </button>
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
  onDownloadCurrentSlide,
  onDownloadAnother,
  openHistoryItem,
  clearHistory,
} = useStateThread();
</script>
