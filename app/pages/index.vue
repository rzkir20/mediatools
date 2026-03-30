<template>
  <main class="flex-1 relative z-10">
    <!-- Hero + Download Section -->
    <section class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 pt-10 sm:pt-12 pb-20 sm:pb-28 lg:pb-32">
      <div class="text-center mb-16">
        <div class="inline-flex flex-wrap items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card mb-8 max-w-full">
          <span class="flex h-2 w-2 rounded-full brand-gradient"></span>
          <span class="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/60">
            Universal Downloader v2.0
          </span>
        </div>
        <h1 class="text-4xl sm:text-5xl md:text-[5.5rem] font-black leading-[0.9] mb-6 sm:mb-8 font-heading">
          One Tool.
          <br />
          <span class="text-brand-gradient">All Social Media.</span>
        </h1>
        <p class="text-white/40 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          The ultimate destination to download high-quality content from TikTok
          and Instagram instantly. No watermarks, no limits, no login required.
        </p>
      </div>

      <!-- Download Card -->
      <div class="max-w-4xl mx-auto mb-16 sm:mb-24 lg:mb-32">
        <div class="glass-card rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 relative shadow-2xl overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 brand-gradient opacity-10 blur-[100px]"></div>

          <div class="flex flex-col gap-8 sm:gap-10">
            <div class="text-center space-y-3 sm:space-y-4">
              <p class="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Download aplikasi Media Tools
              </p>
              <h3 class="text-center text-xl sm:text-2xl md:text-3xl font-black font-heading">
                Tersedia untuk Android, Windows, dan Linux
              </h3>
              <p class="text-white/40 text-sm md:text-base leading-relaxed">
                Nikmati pengalaman download yang lebih stabil dan cepat dengan aplikasi native
                di perangkat favoritmu. Pilih sistem operasi, lalu unduh installernya.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center items-stretch sm:items-center">
              <button type="button"
                class="inline-flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-emerald-400 hover:bg-emerald-500/20">
                <iconify-icon icon="logos:android-icon" class="text-xl" />
                <span class="flex flex-col text-left leading-tight">
                  <span class="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                    Android
                  </span>
                  <span class="text-[11px] text-white/60">Download APK</span>
                </span>
              </button>

              <button type="button"
                class="inline-flex items-center gap-3 rounded-2xl border border-sky-500/40 bg-sky-500/10 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-sky-400 hover:bg-sky-500/20">
                <iconify-icon icon="logos:microsoft-windows" class="text-xl" />
                <span class="flex flex-col text-left leading-tight">
                  <span class="text-xs font-semibold uppercase tracking-wide text-sky-300">
                    Windows
                  </span>
                  <span class="text-[11px] text-white/60">Download Installer (.exe)</span>
                </span>
              </button>

              <button type="button"
                class="inline-flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-amber-300 hover:bg-amber-400/20">
                <iconify-icon icon="logos:linux-tux" class="text-xl" />
                <span class="flex flex-col text-left leading-tight">
                  <span class="text-xs font-semibold uppercase tracking-wide text-amber-200">
                    Linux
                  </span>
                  <span class="text-[11px] text-white/60">Download AppImage / .deb</span>
                </span>
              </button>
            </div>
          </div>

          <div class="mt-8 flex justify-center gap-10 opacity-40">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <iconify-icon icon="lucide:video" />
              Videos
            </div>
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <iconify-icon icon="lucide:image" />
              Images
            </div>
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <iconify-icon icon="lucide:music" />
              Audio
            </div>
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <iconify-icon icon="lucide:smartphone" />
              Stories
            </div>
          </div>
        </div>
      </div>

      <!-- Service Cards -->
      <div class="flex flex-wrap justify-center gap-8 lg:gap-10">
        <NuxtLink to="/tiktok"
          class="group relative block w-full md:w-[calc(50%-1.25rem)] overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] glass-card p-8 sm:p-10 lg:p-12 transition-all hover:border-white/20">
          <div
            class="absolute -bottom-10 -right-10 w-64 h-64 bg-[#FF3D57] rounded-full blur-[100px] opacity-5 group-hover:opacity-20 transition-opacity">
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-10 sm:mb-12">
            <div class="w-16 h-16 bg-[#FF3D57]/10 rounded-2xl flex items-center justify-center">
              <iconify-icon icon="logos:tiktok-icon" class="text-4xl" />
            </div>
            <div class="text-left sm:text-right">
              <span class="text-[10px] font-black uppercase tracking-widest text-[#FF3D57]">TikTok Service</span>
              <h3 class="text-3xl font-black mt-1 font-heading">
                Video & Music
              </h3>
            </div>
          </div>
          <ul class="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#FF3D57] shrink-0" />
              Download without Watermark
            </li>
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#FF3D57] shrink-0" />
              HD Original Quality MP4
            </li>
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#FF3D57] shrink-0" />
              Extract MP3 Audio Tracks
            </li>
          </ul>
          <span
            class="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:gap-5 transition-all">
            Try TikTok Downloader
            <iconify-icon icon="lucide:arrow-right" />
          </span>
        </NuxtLink>

        <NuxtLink to="/instagram"
          class="group relative block w-full md:w-[calc(50%-1.25rem)] overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] glass-card p-8 sm:p-10 lg:p-12 transition-all hover:border-white/20">
          <div
            class="absolute -bottom-10 -right-10 w-64 h-64 bg-[#bc1888] rounded-full blur-[100px] opacity-5 group-hover:opacity-20 transition-opacity">
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-10 sm:mb-12">
            <div class="w-16 h-16 bg-[#bc1888]/10 rounded-2xl flex items-center justify-center">
              <iconify-icon icon="logos:instagram-icon" class="text-4xl" />
            </div>
            <div class="text-left sm:text-right">
              <span class="text-[10px] font-black uppercase tracking-widest text-[#bc1888]">Instagram Service</span>
              <h3 class="text-3xl font-black mt-1 font-heading">
                Reels & Posts
              </h3>
            </div>
          </div>
          <ul class="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#bc1888] shrink-0" />
              Save Reels, Posts & Stories
            </li>
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#bc1888] shrink-0" />
              Carousel Photo Downloads
            </li>
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#bc1888] shrink-0" />
              Profile Picture HD Viewer
            </li>
          </ul>
          <span
            class="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:gap-5 transition-all">
            Try Insta Downloader
            <iconify-icon icon="lucide:arrow-right" />
          </span>
        </NuxtLink>

        <NuxtLink to="/facebook"
          class="group relative block w-full md:w-[calc(50%-1.25rem)] overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] glass-card p-8 sm:p-10 lg:p-12 transition-all hover:border-white/20">
          <div
            class="absolute -bottom-10 -right-10 w-64 h-64 bg-[#1877F2] rounded-full blur-[100px] opacity-5 group-hover:opacity-20 transition-opacity">
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-10 sm:mb-12">
            <div class="w-16 h-16 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center">
              <iconify-icon icon="lucide:facebook" class="text-4xl" />
            </div>
            <div class="text-left sm:text-right">
              <span class="text-[10px] font-black uppercase tracking-widest text-[#1877F2]">Facebook Service</span>
              <h3 class="text-3xl font-black mt-1 font-heading">
                Feed & Group
              </h3>
            </div>
          </div>
          <ul class="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#1877F2] shrink-0" />
              Download video dari feed & group
            </li>
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#1877F2] shrink-0" />
              Support kualitas HD bila tersedia
            </li>
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#1877F2] shrink-0" />
              Simpan dengan audio asli
            </li>
          </ul>
          <span
            class="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:gap-5 transition-all">
            Coba Facebook Downloader
            <iconify-icon icon="lucide:arrow-right" />
          </span>
        </NuxtLink>

        <NuxtLink to="/youtube"
          class="group relative block w-full md:w-[calc(50%-1.25rem)] overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] glass-card p-8 sm:p-10 lg:p-12 transition-all hover:border-white/20">
          <div
            class="absolute -bottom-10 -right-10 w-64 h-64 bg-[#FF0000] rounded-full blur-[100px] opacity-5 group-hover:opacity-20 transition-opacity">
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-10 sm:mb-12">
            <div class="w-16 h-16 bg-[#FF0000]/10 rounded-2xl flex items-center justify-center">
              <iconify-icon icon="lucide:tv" class="text-4xl" />
            </div>
            <div class="text-left sm:text-right">
              <span class="text-[10px] font-black uppercase tracking-widest text-[#FF0000]">YouTube Service</span>
              <h3 class="text-3xl font-black mt-1 font-heading">
                YouTube Downloader
              </h3>
            </div>
          </div>
          <ul class="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#FF0000] shrink-0" />
              Simpan video YouTube dengan cepat
            </li>
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#FF0000] shrink-0" />
              Pilih resolusi sesuai kebutuhan
            </li>
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-[#FF0000] shrink-0" />
              Cukup tempel link, tanpa login
            </li>
          </ul>
          <span
            class="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:gap-5 transition-all">
            Coba YouTube Downloader
            <iconify-icon icon="lucide:arrow-right" />
          </span>
        </NuxtLink>

        <NuxtLink to="/docx-to-pdf"
          class="group relative block w-full lg:w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] glass-card p-8 sm:p-10 lg:p-12 transition-all hover:border-white/20">
          <div
            class="absolute -bottom-10 -right-10 w-64 h-64 brand-gradient rounded-full blur-[100px] opacity-5 group-hover:opacity-20 transition-opacity">
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-10 sm:mb-12">
            <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
              <iconify-icon icon="lucide:file-input" class="text-4xl text-brand-gradient" />
            </div>
            <div class="text-left sm:text-right">
              <span class="text-[10px] font-black uppercase tracking-widest text-white/60">Document Tools</span>
              <h3 class="text-3xl font-black mt-1 font-heading">
                PDF Converter
              </h3>
            </div>
          </div>
          <ul class="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-brand-gradient shrink-0" />
              DOCX / Excel / PPT / HTML → PDF
            </li>
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-brand-gradient shrink-0" />
              PDF → DOCX / Excel / PPT
            </li>
            <li class="flex items-center gap-4 text-white/60 font-medium">
              <iconify-icon icon="lucide:check-circle-2" class="text-brand-gradient shrink-0" />
              JPG → PDF (merge cepat)
            </li>
          </ul>
          <span
            class="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:gap-5 transition-all">
            Buka Document Converter
            <iconify-icon icon="lucide:arrow-right" />
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-[#05060f] py-20">
      <div class="max-w-[1440px] mx-auto px-8 md:px-20 text-center">
        <h2 class="text-4xl md:text-5xl font-black mb-20 uppercase tracking-tight italic font-heading">
          All-in-one <span class="text-brand-gradient">Media Tools</span>
        </h2>
        <div class="grid md:grid-cols-3 gap-16">
          <div class="space-y-6">
            <div class="w-20 h-20 glass-card rounded-3xl flex items-center justify-center mx-auto mb-8 floating">
              <iconify-icon icon="lucide:layers" class="text-4xl text-brand-gradient" />
            </div>
            <h4 class="text-xl font-black uppercase italic font-heading">
              Social Media Download
            </h4>
            <p class="text-white/40 text-sm leading-relaxed">
              Download from TikTok, Instagram, Facebook, and YouTube—fast, clean,
              and ready to save in one place.
            </p>
          </div>
          <div class="space-y-6">
            <div class="w-20 h-20 glass-card rounded-3xl flex items-center justify-center mx-auto mb-8 floating"
              style="animation-delay: -1.5s">
              <iconify-icon icon="lucide:file-text" class="text-4xl text-brand-gradient" />
            </div>
            <h4 class="text-xl font-black uppercase italic font-heading">
              Document Converter
            </h4>
            <p class="text-white/40 text-sm leading-relaxed">
              Convert DOCX, Excel, PPT, and HTML to PDF—or export PDF to DOCX,
              Excel, PPT, and images.
            </p>
          </div>
          <div class="space-y-6">
            <div class="w-20 h-20 glass-card rounded-3xl flex items-center justify-center mx-auto mb-8 floating"
              style="animation-delay: -3s">
              <iconify-icon icon="lucide:shield-check" class="text-4xl text-brand-gradient" />
            </div>
            <h4 class="text-xl font-black uppercase italic font-heading">
              Privacy-first & Simple
            </h4>
            <p class="text-white/40 text-sm leading-relaxed">
              No login required. No tracking. Just paste a link or upload a file
              and get your result instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
