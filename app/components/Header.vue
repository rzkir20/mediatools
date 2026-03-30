<template>
  <header class="sticky top-0 z-50 w-full bg-[#05060f]">
    <div class="mx-auto container px-4 py-4">
      <nav class="flex items-center justify-between gap-4">
        <!-- Brand -->
        <NuxtLink to="/"
          class="group flex items-center gap-3 rounded-full bg-white/5 px-3 py-1.5 text-white transition hover:bg-white/10">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF3D57] via-[#FB923C] to-[#22D3EE] shadow-lg shadow-[#FF3D57]/40">
            <iconify-icon icon="lucide:play" class="text-lg text-white" />
          </div>
          <div class="flex flex-col leading-tight">
            <span class="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              Media Tools
            </span>
          </div>
        </NuxtLink>

        <!-- Desktop navigation -->
        <div class="hidden items-center gap-1 text-[14px] font-medium text-white/70 lg:flex">
          <NuxtLink to="/"
            class="flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
            exact-active-class="bg-white/15 text-white">
            <iconify-icon icon="lucide:home" class="text-[17px]" />
            <span>Home</span>
          </NuxtLink>

          <!-- Services mega dropdown -->
          <div class="relative group">
            <button type="button"
              class="flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
              :class="{ 'bg-white/15 text-white': isServicesActive }">
              <iconify-icon icon="lucide:layers" class="text-[17px]" />
              <span>Social Media Download</span>
              <iconify-icon icon="lucide:chevron-down" class="text-[13px] opacity-70" />
            </button>
            <div
              class="pointer-events-none absolute left-1/2 top-full z-40 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
              <div
                class="grid min-w-[360px] grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-[#050818]/95 p-2 text-sm text-white shadow-2xl shadow-black/40">
                <NuxtLink to="/tiktok"
                  class="flex items-start gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]">
                  <iconify-icon icon="lucide:music" class="mt-0.5 text-base" />
                  <div>
                    <p class="text-[13px] font-semibold">TikTok Downloader</p>
                    <p class="text-[11px] text-white/50">Simpan video TikTok tanpa watermark.</p>
                  </div>
                </NuxtLink>
                <NuxtLink to="/instagram"
                  class="flex items-start gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]">
                  <iconify-icon icon="lucide:camera" class="mt-0.5 text-base" />
                  <div>
                    <p class="text-[13px] font-semibold">Instagram Downloader</p>
                    <p class="text-[11px] text-white/50">Reels, story, dan post dengan mudah.</p>
                  </div>
                </NuxtLink>
                <NuxtLink to="/facebook"
                  class="flex items-start gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]">
                  <iconify-icon icon="lucide:facebook" class="mt-0.5 text-base" />
                  <div>
                    <p class="text-[13px] font-semibold">Facebook Downloader</p>
                    <p class="text-[11px] text-white/50">Download video dari feed & group.</p>
                  </div>
                </NuxtLink>
                <NuxtLink to="/youtube"
                  class="flex items-start gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]">
                  <iconify-icon icon="lucide:tv" class="mt-0.5 text-base" />
                  <div>
                    <p class="text-[13px] font-semibold">YouTube Downloader</p>
                    <p class="text-[11px] text-white/50">Simpan video YouTube dengan cepat.</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Document conversion -->
          <div class="relative group">
            <button type="button"
              class="flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
              :class="{ 'bg-white/15 text-white': isDocumentsActive }">
              <iconify-icon icon="lucide:file-text" class="text-[17px]" />
              <span>Document Converter</span>
              <iconify-icon icon="lucide:chevron-down" class="text-[13px] opacity-70" />
            </button>
            <div
              class="pointer-events-none absolute right-0 top-full z-40 pt-2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
              <div
                class="min-w-[360px] rounded-2xl border border-white/10 bg-[#050818]/95 p-3 text-sm text-white shadow-2xl shadow-black/40">
                <div class="grid grid-cols-2 gap-2">
                  <div class="space-y-1.5">
                    <p
                      class="rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
                      Ke PDF
                    </p>
                    <NuxtLink to="/docx-to-pdf"
                      class="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                      active-class="bg-white/10 text-[#FF3D57]">
                      <iconify-icon icon="lucide:file-text" class="text-base" />
                      <span class="text-[13px]">DOCX to PDF</span>
                    </NuxtLink>
                    <NuxtLink to="/excel-to-pdf"
                      class="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                      active-class="bg-white/10 text-[#FF3D57]">
                      <iconify-icon icon="lucide:table" class="text-base" />
                      <span class="text-[13px]">Excel to PDF</span>
                    </NuxtLink>
                    <NuxtLink to="/ppt-to-pdf"
                      class="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                      active-class="bg-white/10 text-[#FF3D57]">
                      <iconify-icon icon="lucide:sliders-horizontal" class="text-base" />
                      <span class="text-[13px]">PPT to PDF</span>
                    </NuxtLink>
                    <NuxtLink to="/html-to-pdf"
                      class="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                      active-class="bg-white/10 text-[#FF3D57]">
                      <iconify-icon icon="lucide:file-code-2" class="text-base" />
                      <span class="text-[13px]">HTML to PDF</span>
                    </NuxtLink>
                  </div>
                  <div class="space-y-1.5">
                    <p
                      class="rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
                      Dari PDF
                    </p>
                    <NuxtLink to="/pdf-to-docx"
                      class="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                      active-class="bg-white/10 text-[#FF3D57]">
                      <iconify-icon icon="lucide:file-text" class="text-base" />
                      <span class="text-[13px]">PDF to DOCX</span>
                    </NuxtLink>
                    <NuxtLink to="/pdf-to-excel"
                      class="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                      active-class="bg-white/10 text-[#FF3D57]">
                      <iconify-icon icon="lucide:table" class="text-base" />
                      <span class="text-[13px]">PDF to Excel</span>
                    </NuxtLink>
                    <NuxtLink to="/pdf-to-ppt"
                      class="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                      active-class="bg-white/10 text-[#FF3D57]">
                      <iconify-icon icon="lucide:monitor-play" class="text-base" />
                      <span class="text-[13px]">PDF to PPT</span>
                    </NuxtLink>
                    <NuxtLink to="/jpg-to-pdf"
                      class="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                      active-class="bg-white/10 text-[#FF3D57]">
                      <iconify-icon icon="lucide:image" class="text-base" />
                      <span class="text-[13px]">PDF to Image</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <NuxtLink to="/donasi"
            class="flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
            exact-active-class="bg-white/15 text-white">
            <iconify-icon icon="lucide:heart" class="text-[17px]" />
            <span>Donasi</span>
          </NuxtLink>
        </div>

        <!-- Right side: language + mobile menu -->
        <div class="flex items-center gap-2">
          <NuxtLink to="/download"
            class="flex items-center gap-2 rounded-full px-3 py-2 transition-colors bg-white/10 text-white  hover:bg-white/10 hover:text-white"
            exact-active-class="bg-white/15 text-white">
            <iconify-icon icon="lucide:download" class="text-[17px]" />
            <span>Download</span>
          </NuxtLink>

          <button type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 shadow-sm transition-colors hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu" @click="menuOpen = !menuOpen">
            <iconify-icon :icon="menuOpen ? 'lucide:x' : 'lucide:menu'" class="text-[20px]" />
          </button>
        </div>
      </nav>

      <!-- Mobile sheet -->
      <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
        <div v-show="menuOpen"
          class="mt-3 space-y-2 rounded-2xl border border-white/10 bg-[#050818]/95 p-3 text-white shadow-2xl shadow-black/40 lg:hidden">
          <NuxtLink to="/"
            class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
            exact-active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
            <iconify-icon icon="lucide:home" class="text-[18px]" />
            <span>Home</span>
          </NuxtLink>

          <div class="space-y-1">
            <button type="button"
              class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
              :class="{ 'bg-white/10 text-[#FF3D57]': isServicesActive }" @click="servicesOpen = !servicesOpen">
              <span class="flex items-center gap-2">
                <iconify-icon icon="lucide:layers" class="text-[18px]" />
                <span>Social Media Download</span>
              </span>
              <iconify-icon :icon="servicesOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="text-[18px]" />
            </button>
            <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0"
              enter-to-class="opacity-100" leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100" leave-to-class="opacity-0">
              <div v-show="servicesOpen" class="space-y-0.5 pl-3">
                <NuxtLink to="/tiktok"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
                  <iconify-icon icon="lucide:music" class="text-base" />
                  <span>TikTok Downloader</span>
                </NuxtLink>
                <NuxtLink to="/instagram"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
                  <iconify-icon icon="lucide:camera" class="text-base" />
                  <span>Instagram Downloader</span>
                </NuxtLink>
                <NuxtLink to="/facebook"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
                  <iconify-icon icon="lucide:facebook" class="text-base" />
                  <span>Facebook Downloader</span>
                </NuxtLink>
                <NuxtLink to="/youtube"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
                  <iconify-icon icon="lucide:tv" class="text-base" />
                  <span>YouTube Downloader</span>
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <div class="space-y-1">
            <button type="button"
              class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
              :class="{ 'bg-white/10 text-[#FF3D57]': isDocumentsActive }" @click="documentsOpen = !documentsOpen">
              <span class="flex items-center gap-2">
                <iconify-icon icon="lucide:file-text" class="text-[18px]" />
                <span>Document Converter</span>
              </span>
              <iconify-icon :icon="documentsOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="text-[18px]" />
            </button>
            <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0"
              enter-to-class="opacity-100" leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100" leave-to-class="opacity-0">
              <div v-show="documentsOpen" class="space-y-0.5 pl-3">
                <NuxtLink to="/docx-to-pdf"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
                  <iconify-icon icon="lucide:file-text" class="text-base" />
                  <span>DOCX to PDF</span>
                </NuxtLink>
                <NuxtLink to="/excel-to-pdf"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
                  <iconify-icon icon="lucide:table" class="text-base" />
                  <span>Excel to PDF</span>
                </NuxtLink>
                <NuxtLink to="/ppt-to-pdf"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
                  <iconify-icon icon="lucide:sliders-horizontal" class="text-base" />
                  <span>PPT to PDF</span>
                </NuxtLink>
                <NuxtLink to="/html-to-pdf"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
                  <iconify-icon icon="lucide:file-code-2" class="text-base" />
                  <span>HTML to PDF</span>
                </NuxtLink>
                <NuxtLink to="/pdf-to-docx"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
                  <iconify-icon icon="lucide:file-text" class="text-base" />
                  <span>PDF to DOCX</span>
                </NuxtLink>
                <NuxtLink to="/jpg-to-pdf"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
                  active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
                  <iconify-icon icon="lucide:image" class="text-base" />
                  <span>PDF to Image</span>
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <NuxtLink to="/donasi"
            class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
            exact-active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
            <iconify-icon icon="lucide:heart" class="text-[18px]" />
            <span>Donasi</span>
          </NuxtLink>
          <NuxtLink to="/download"
            class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-[#FF3D57]"
            exact-active-class="bg-white/10 text-[#FF3D57]" @click="menuOpen = false">
            <iconify-icon icon="lucide:download" class="text-[18px]" />
            <span>Download</span>
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useStateHeader } from "~/services/useStateHeader";

const { menuOpen, servicesOpen, documentsOpen } = useStateHeader();
const route = useRoute();
const isServicesActive = computed(
  () =>
    route.path === "/tiktok" ||
    route.path === "/instagram" ||
    route.path === "/facebook" ||
    route.path === "/youtube" ||
    route.path.startsWith("/tiktok/") ||
    route.path.startsWith("/instagram/") ||
    route.path.startsWith("/facebook/") ||
    route.path.startsWith("/youtube/"),
);
const isDocumentsActive = computed(
  () =>
    route.path === "/docx-to-pdf" ||
    route.path === "/excel-to-pdf" ||
    route.path === "/ppt-to-pdf" ||
    route.path === "/html-to-pdf" ||
    route.path === "/pdf-to-docx" ||
    route.path === "/pdf-to-excel" ||
    route.path === "/pdf-to-ppt" ||
    route.path === "/jpg-to-pdf",
);
</script>
