<template>
  <section class="relative overflow-hidden">
    <div
      class="absolute top-20 left-10 text-[18rem] font-heading font-black text-outline uppercase select-none pointer-events-none hidden xl:block leading-none"
    >
      PPT → PDF
    </div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div
        class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-8 pb-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-16"
      >
        <div class="order-2 lg:order-1">
          <div class="mb-6 inline-flex items-center gap-3">
            <div class="w-12 h-[2px] bg-[#22C55E]" />
            <span
              class="uppercase tracking-[0.4em] text-xs font-heading font-black text-[#22C55E]"
              >PowerPoint</span
            >
          </div>

          <h1
            class="font-heading text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] mb-6 sm:mb-8"
          >
            PPTX <br />
            <span class="text-[#22C55E]">to PDF</span>
          </h1>

          <p class="text-white/50 text-base sm:text-lg max-w-lg mb-6 sm:mb-8">
            Konversi cepat file PowerPoint (PPTX) menjadi PDF. Upload file PPTX
            lalu unduh hasilnya dalam format PDF.
          </p>

          <div
            id="download-input"
            class="relative w-full max-w-2xl mb-8 sm:mb-10 space-y-4"
          >
            <div
              class="bg-[#1A1A1A] p-4 sm:p-5 rounded-2xl border border-white/5 shadow-2xl shadow-black/40"
            >
              <label
                class="block text-xs font-heading font-black uppercase tracking-widest text-white/50 mb-2"
              >
                Pilih file PPTX
              </label>
              <label
                class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 cursor-pointer group"
              >
                <div
                  class="flex-1 min-w-0 px-4 py-3 rounded-xl border border-dashed border-white/10 bg-black/20 group-hover:border-[#22C55E]/60 transition-colors"
                >
                  <p
                    class="text-xs sm:text-sm text-white/70 truncate"
                    v-if="file"
                  >
                    {{ file.name }}
                  </p>
                  <p
                    v-else
                    class="text-xs sm:text-sm text-white/40 flex items-center gap-2"
                  >
                    <iconify-icon
                      icon="lucide:upload-cloud"
                      class="text-base sm:text-lg"
                    />
                    <span>Click to choose PPTX file</span>
                  </p>
                  <p
                    class="mt-1 text-[10px] text-white/30 uppercase font-heading tracking-widest"
                  >
                    Maksimal 50 MB
                  </p>
                </div>
                <div class="shrink-0 flex flex-col gap-2">
                  <span
                    class="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#22C55E] text-xs font-heading font-black uppercase tracking-widest text-black"
                  >
                    Browse
                  </span>
                </div>
                <input
                  type="file"
                  class="hidden"
                  @change="handleFileInput"
                  accept=".pptx"
                />
              </label>

              <div class="mt-4 grid grid-cols-1 sm:grid-cols-[1.3fr_auto] gap-3">
                <div>
                  <label
                    class="block text-xs font-heading font-black uppercase tracking-widest text-white/50 mb-1"
                  >
                    Output
                  </label>
                  <p class="text-xs text-white/60">PDF</p>
                </div>
                <div class="flex items-end">
                  <button
                    type="button"
                    class="w-full sm:w-auto bg-[#22C55E] hover:bg-[#22C55E]/90 hover:scale-105 active:scale-95 transition-all text-black px-6 sm:px-8 py-3 rounded-2xl font-heading font-black uppercase text-xs sm:text-sm tracking-widest shadow-lg shadow-[#22C55E]/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    :disabled="!hasFile || converting"
                    @click="onConvert"
                  >
                    {{ converting ? "Memproses..." : "Convert & Download" }}
                  </button>
                </div>
              </div>

              <p v-if="downloadError" class="mt-3 text-sm text-red-400">
                {{ downloadError }}
              </p>
            </div>

            <p class="text-xs text-white/40">
              Didukung: hanya PPTX (PowerPoint OOXML). Untuk file PPT lama, harap
              di-save ulang sebagai PPTX terlebih dahulu. Konversi berjalan
              lokal di server tanpa menyimpan permanen.
            </p>
          </div>
        </div>

        <div
          class="order-1 lg:order-2 relative flex justify-center lg:justify-end w-full min-w-0 max-w-[280px] sm:max-w-[320px] md:max-w-none mx-auto lg:mx-0"
        >
          <div
            class="w-full aspect-4/5 bg-[#1A1A1A] rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center"
          >
            <div class="flex flex-col items-center gap-4 px-6">
              <div
                class="w-16 h-16 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/40 flex items-center justify-center"
              >
                <iconify-icon
                  icon="lucide:monitor-play"
                  class="text-3xl text-[#22C55E]"
                />
              </div>
              <p
                class="font-heading text-lg sm:text-2xl font-black text-center leading-snug"
              >
                PPTX to PDF
              </p>
              <p class="text-xs text-white/50 text-center">
                Slide presentasi Anda dikonversi menjadi dokumen PDF yang rapi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useStateConvertDoc } from "~/services/useStateConvertDoc";

const {
  file,
  targetFormat,
  hasFile,
  converting,
  downloadError,
  onFileChange,
  onConvert,
} = useStateConvertDoc();

// Pastikan output selalu PDF
targetFormat.value = "pdf";

function handleFileInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const f = input.files?.[0] ?? null;
  onFileChange(f);
}
</script>
