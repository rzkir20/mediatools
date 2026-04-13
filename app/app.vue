<template>
  <NuxtLayout>
    <div class="min-h-screen flex flex-col relative">
      <div class="mesh-bg" aria-hidden="true" />
      <Header />
      <NuxtPage />
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-4016803466870090"
        data-ad-slot="7770658931"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Footer />
    </div>
    <Toaster
      theme="dark"
      position="bottom-right"
      rich-colors
      :toast-options="{
        duration: 3000,
        class: 'font-medium',
      }"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Toaster } from "~/components/ui/sonner";

const route = useRoute();

useHead({
  script: [
    {
      async: true,
      src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4016803466870090",
      crossorigin: "anonymous",
    },
  ],
});

function renderAds() {
  const ads = (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle || [];
  ads.push({});
  (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle = ads;
}

onMounted(renderAds);

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    renderAds();
  },
);
</script>
