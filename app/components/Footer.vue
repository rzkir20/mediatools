<template>
  <footer class="bg-[#05060f] py-12 px-8">
    <div class="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <p class="text-white/30 text-sm font-medium">
        &copy; 2026 Media Tools. Made with Passion for Creators.
      </p>
      <div class="flex gap-10">
        <NuxtLink to="/terms"
          class="text-xs uppercase font-heading font-black tracking-widest text-white/40 hover:text-white transition-colors">
          Terms</NuxtLink>
        <NuxtLink to="/privacy"
          class="text-xs uppercase font-heading font-black tracking-widest text-white/40 hover:text-white transition-colors">
          Privacy</NuxtLink>
        <NuxtLink to="/donasi"
          class="text-xs uppercase font-heading font-black tracking-widest text-white/40 hover:text-white transition-colors">
          Donasi</NuxtLink>
        <NuxtLink to="/download"
          class="text-xs uppercase font-heading font-black tracking-widest text-white/40 hover:text-white transition-colors">
          Download</NuxtLink>
      </div>
      <div class="flex gap-6">
        <NuxtLink to="https://www.instagram.com/rzkir.20/"
          class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#FF3D57] hover:border-[#FF3D57] transition-all"
          aria-label="Instagram">
          <iconify-icon icon="lucide:instagram" class="text-white" />
        </NuxtLink>
        <NuxtLink to="https://www.tiktok.com/@rzkir.20"
          class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#FF3D57] hover:border-[#FF3D57] transition-all"
          aria-label="TikTok">
          <iconify-icon icon="logos:tiktok-icon" class="text-white" />
        </NuxtLink>
        <NuxtLink to="https://github.com/rzkir"
          class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#FF3D57] hover:border-[#FF3D57] transition-all"
          aria-label="GitHub">
          <iconify-icon icon="lucide:github" class="text-white" />
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
