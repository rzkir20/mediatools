<template>
  <section class="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-16">
    <div class="flex items-center justify-between mb-8 sm:mb-10 flex-wrap gap-4">
      <div>
        <p class="text-xs sm:text-sm uppercase tracking-[0.3em] font-heading font-black text-white/30">
          TikTok
        </p>
        <h1 class="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase italic mt-1">
          Download <span class="text-[#FF3D57]">History</span>
        </h1>
        <p class="text-white/40 text-xs sm:text-sm mt-2 max-w-xl">
          Semua riwayat video TikTok yang pernah kamu proses di perangkat ini.
        </p>
      </div>
      <div class="flex flex-wrap gap-3 sm:gap-4 items-center">
        <NuxtLink to="/tiktok"
          class="text-white/60 hover:text-white font-heading font-black uppercase text-[11px] sm:text-xs tracking-widest flex items-center gap-1">
          <iconify-icon icon="lucide:arrow-left" class="text-[10px]" />
          Kembali ke Downloader
        </NuxtLink>
        <button type="button"
          class="text-[#FF3D57] font-heading font-black uppercase text-[11px] sm:text-xs tracking-widest hover:text-white transition-colors"
          @click="showClearHistoryDialog = true">
          Clear History
        </button>
      </div>
    </div>

    <!-- Skeleton saat history belum siap -->
    <div v-if="!historyReady" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      <div v-for="i in 10" :key="i" class="glass-panel rounded-2xl overflow-hidden animate-pulse">
        <div class="aspect-4/5 bg-white/5" />
        <div class="p-4 space-y-2">
          <div class="h-3 w-20 bg-white/10 rounded" />
          <div class="h-4 w-full bg-white/10 rounded" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <Empty v-else-if="!historyItems?.length"
      class="border border-dashed border-white/5 py-8 md:py-16 text-white/30 flex flex-col text-center items-center justify-center gap-4 rounded-2xl">
      <EmptyHeader>
        <iconify-icon icon="lucide:history" class="text-4xl text-[#FF3D57]" />
      </EmptyHeader>
      <EmptyContent>
        Belum ada riwayat. Buka halaman TikTok Downloader, isi link, lalu klik
        <span class="font-semibold text-white">Download</span> untuk menambah history.
      </EmptyContent>
    </Empty>

    <!-- Grid history -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      <div v-for="item in historyItems ?? []" :key="item.id"
        class="group relative glass-panel rounded-2xl overflow-hidden hover:border-[#FF3D57]/50 transition-all">
        <div class="aspect-4/5 bg-neutral-900 relative">
          <img v-if="item.cover" :src="item.cover" :alt="item.title"
            class="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity" @error="
              (e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                const pl = img.nextElementSibling as HTMLElement;
                if (pl) {
                  pl.classList.remove('hidden');
                  pl.style.display = 'flex';
                }
              }
            " />
          <div class="absolute inset-0 flex items-center justify-center bg-neutral-800"
            :class="{ hidden: !!item.cover }" aria-hidden="true">
            <iconify-icon icon="lucide:video" class="text-white/20 text-4xl" />
          </div>

          <!-- Badge tanggal -->
          <div
            class="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/70 backdrop-blur text-[10px] font-heading font-black tracking-widest uppercase text-white/70 flex items-center gap-1">
            <iconify-icon icon="lucide:clock" class="text-[11px]" />
            <span>{{ formatDate(item.date) }}</span>
          </div>
        </div>
        <div class="p-3 sm:p-4 space-y-1">
          <p class="text-[10px] font-heading font-black uppercase tracking-tighter text-[#FF3D57]">
            {{ item.type }}
          </p>
          <p class="text-xs font-bold line-clamp-2">{{ item.title }}</p>
          <p v-if="item.author" class="text-[11px] text-white/40 font-medium truncate">
            @{{ item.author }}
          </p>
        </div>

        <!-- Tombol menuju link TikTok asli -->
        <a :href="item.url" target="_blank" rel="noopener noreferrer"
          class="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-[#FF3D57] transition-all opacity-0 group-hover:opacity-100"
          title="Buka di TikTok">
          <iconify-icon icon="lucide:external-link" class="text-white text-xs" />
        </a>
      </div>
    </div>

    <!-- Dialog konfirmasi Clear History -->
    <UiDialog :open="showClearHistoryDialog" @update:open="showClearHistoryDialog = $event">
      <UiDialogContent class="bg-[#1A1A1A] border-white/10 text-white max-w-[calc(100vw-2rem)] sm:max-w-lg">
        <UiDialogHeader>
          <UiDialogTitle class="font-heading text-lg sm:text-xl text-white">
            Clear History?
          </UiDialogTitle>
          <UiDialogDescription class="text-white/60 text-sm">
            Semua riwayat unduhan TikTok akan dihapus dari perangkat ini. Tindakan
            ini tidak bisa dibatalkan.
          </UiDialogDescription>
        </UiDialogHeader>
        <UiDialogFooter class="flex flex-col-reverse sm:flex-row gap-2">
          <UiButton variant="outline" class="border-white/20 text-black hover:bg-white/10 hover:text-white"
            @click="onCloseClearHistoryDialog">
            Batal
          </UiButton>
          <UiButton class="bg-[#FF3D57] hover:bg-[#FF3D57]/90 text-white" @click="onConfirmClearHistory">
            Ya, Hapus
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </section>
</template>

<script setup lang="ts">
import { Empty, EmptyHeader, EmptyContent } from "../../components/ui/empty";
import { useStateTiktok } from "../../services/useStateTiktok";

const {
  historyItems,
  historyReady,
  showClearHistoryDialog,
  onCloseClearHistoryDialog,
  onConfirmClearHistory,
} = useStateTiktok();

const formatDate = (timestamp: number) => {
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
</script>