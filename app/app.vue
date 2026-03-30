<template>
  <NuxtLayout>
    <div class="min-h-screen flex flex-col relative">
      <div class="mesh-bg" aria-hidden="true" />
      <Header />
      <NuxtPage />
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

<script setup>
import { Toaster } from "~/components/ui/sonner";
</script>
