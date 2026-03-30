<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="onClose">
        <div
          class="relative w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl min-h-[520px] flex flex-col justify-center transition-all duration-500"
          :class="glassClass" @click.stop>
          <!-- gradient blob -->
          <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[120px] opacity-20 pointer-events-none"
            :class="gradientClass" />
          <div class="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">
            <!-- Progress view -->
            <div v-show="!success" class="w-full max-w-2xl space-y-10 transition-all duration-500">
              <div class="flex flex-col items-center space-y-8">
                <div class="relative flex items-center justify-center">
                  <div
                    class="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white/5 flex items-center justify-center">
                    <iconify-icon icon="lucide:loader-2" class="text-4xl md:text-5xl animate-spin"
                      :class="gradientTextClass" />
                  </div>
                  <svg class="absolute w-36 h-36 md:w-40 md:h-40 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" stroke="url(#loadingProgressGrad)" stroke-width="4"
                      fill="transparent" stroke-dasharray="301.59" :stroke-dashoffset="circleOffset"
                      stroke-linecap="round" />
                    <defs>
                      <linearGradient id="loadingProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF3D57" />
                        <stop offset="50%" stop-color="#bc1888" />
                        <stop offset="100%" stop-color="#f09433" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div class="space-y-3">
                  <h2 class="text-2xl sm:text-3xl md:text-5xl font-black uppercase italic tracking-tight text-white">
                    {{ statusText }}
                  </h2>
                  <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-white/40 font-medium text-sm">
                    <span>{{ fileName }}</span>
                    <span class="hidden md:inline text-white/10">|</span>
                    <span>{{ fileSizeDisplay }}</span>
                    <span class="hidden md:inline text-white/10">|</span>
                    <span :class="gradientTextClass" class="font-bold">
                      {{ speedDisplay }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="space-y-4 w-full">
                <div class="flex justify-between items-end">
                  <span class="text-[10px] font-black uppercase tracking-widest" :class="gradientTextClass">
                    {{ stageLabel }}
                  </span>
                  <span class="text-4xl md:text-5xl font-black tabular-nums tracking-tighter"
                    :class="gradientTextClass">
                    {{ Math.round(progress) }}%
                  </span>
                </div>
                <div class="progress-track rounded-full overflow-hidden">
                  <div class="progress-fill h-full rounded-full transition-[width] duration-150" :class="gradientClass"
                    :style="{ width: `${Math.min(100, progress)}%` }" />
                </div>
                <p class="text-white/20 text-xs font-bold uppercase tracking-widest">
                  Estimated remaining:
                  <span class="text-white/40">{{ remainingDisplay }}</span>
                </p>
              </div>
            </div>

            <!-- Success view -->
            <div v-show="success" class="w-full max-w-2xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div class="flex flex-col items-center space-y-6">
                <div
                  class="w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/30"
                  :class="gradientClass">
                  <iconify-icon icon="lucide:check" class="text-white text-6xl md:text-7xl" />
                </div>
                <div class="space-y-2">
                  <h2 class="text-3xl md:text-5xl lg:text-6xl font-black uppercase italic text-white">
                    Download Ready!
                  </h2>
                  <p class="text-white/40 text-base md:text-lg">
                    Your file
                    <span class="text-white font-bold">{{ completedFileName }}</span>
                    has been successfully processed.
                  </p>
                </div>
              </div>
              <div class="space-y-4 w-full">
                <div class="flex justify-between items-end">
                  <span class="text-[10px] font-black uppercase tracking-widest" :class="gradientTextClass">
                    Completed
                  </span>
                  <span class="text-2xl md:text-3xl font-black tabular-nums" :class="gradientTextClass">
                    100%
                  </span>
                </div>
                <div class="progress-track rounded-full overflow-hidden">
                  <div class="h-full rounded-full w-full" :class="gradientClass" />
                </div>
              </div>
              <div class="flex flex-wrap justify-center gap-4 pt-2">
                <button type="button"
                  class="px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black uppercase text-xs md:text-sm tracking-widest shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-white"
                  :class="gradientClass" @click="onSave">
                  <iconify-icon icon="lucide:download-cloud" class="text-lg md:text-xl" />
                  Save to Device
                </button>
                <button type="button"
                  class="px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black uppercase text-xs md:text-sm tracking-widest border border-white/10 hover:bg-white/10 transition-all text-white"
                  :class="glassClass" @click="onDownloadNew">
                  Download New
                </button>
              </div>
            </div>

            <!-- Metadata grid (visible on success) -->
            <div v-if="success && metadata"
              class="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-2xl">
              <div v-for="(item, i) in metadata" :key="i"
                class="rounded-2xl p-4 md:p-6 text-center border border-white/10 bg-white/3">
                <div class="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">
                  {{ item.label }}
                </div>
                <div class="font-black text-sm md:text-base" :class="item.gradient ? gradientTextClass : ''">
                  {{ item.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";

const glassClass =
  "bg-white/[0.03] backdrop-blur-2xl border border-white/10";
const gradientClass =
  "bg-gradient-to-br from-[#FF3D57] via-[#bc1888] to-[#f09433]";
const gradientTextClass =
  "bg-gradient-to-br from-[#FF3D57] via-[#bc1888] to-[#f09433] bg-clip-text text-transparent";

const props = withDefaults(
  defineProps<{
    open: boolean;
    progress: number;
    statusText: string;
    stageLabel: string;
    fileName: string;
    loadedBytes: number;
    totalBytes: number | null;
    speedBytesPerSec: number;
    remainingSec: number | null;
    success: boolean;
    completedFileName: string;
    metadata?: { label: string; value: string; gradient?: boolean }[];
  }>(),
  {
    progress: 0,
    statusText: "Downloading...",
    stageLabel: "Saving Media Data",
    fileName: "",
    loadedBytes: 0,
    totalBytes: null,
    speedBytesPerSec: 0,
    remainingSec: null,
    success: false,
    completedFileName: "",
    metadata: () => [],
  }
);

const emit = defineEmits<{
  close: [];
  save: [];
  downloadNew: [];
}>();

const circleCircumference = 301.59;
const circleOffset = computed(
  () => circleCircumference - (props.progress / 100) * circleCircumference
);

const fileSizeDisplay = computed(() => {
  const loaded = props.loadedBytes / (1024 * 1024);
  if (props.totalBytes != null) {
    const total = props.totalBytes / (1024 * 1024);
    return `${loaded.toFixed(1)} MB / ${total.toFixed(1)} MB`;
  }
  return `${loaded.toFixed(1)} MB`;
});

const speedDisplay = computed(() => {
  const mb = props.speedBytesPerSec / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB/s`;
  const kb = props.speedBytesPerSec / 1024;
  return `${kb.toFixed(0)} KB/s`;
});

const remainingDisplay = computed(() => {
  if (props.remainingSec == null) return "—";
  if (props.remainingSec <= 0) return "0s";
  return `${props.remainingSec}s`;
});

watch(
  () => props.open,
  (open) => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = "";
});

function onClose() {
  emit("close");
}

function onSave() {
  emit("save");
}

function onDownloadNew() {
  emit("downloadNew");
}
</script>

<style scoped>
.progress-track {
  height: 12px;
  background: rgba(255, 255, 255, 0.05);
}

.progress-fill {
  min-width: 0;
}
</style>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
