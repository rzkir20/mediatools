/// <reference types="node" />
import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";
import { createLogger } from "vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  components: [
    {
      path: "~/components",
      extensions: [".vue"],
      ignore: ["**/*.ts"],
    },
  ],

  css: ["vue-sonner/style.css", "~/assets/css/tailwind.css"],

  runtimeConfig: {
    public: {
      apiUrl: "",
      siteUrl: "https://mediatools.biz.id",
    },
  },

  app: {
    head: {
      title: "DownTik.to - Download TikTok Video by Link!",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ],
      link: [
        {
          href: "https://api.fontshare.com/v2/css?f[]=plus-jakarta-sans@400,500,600,700,800&display=swap",
          rel: "stylesheet",
        },
        {
          href: "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500&f[]=satoshi@700,500,400&display=swap",
          rel: "stylesheet",
        },
      ],
      script: [
        {
          src: "https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js",
          defer: true,
        },
      ],
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag === "iconify-icon",
    },
  },

  vite: {
    plugins: [tailwindcss() as unknown as Plugin],
    build: {
      sourcemap: false,
    },
    customLogger: (() => {
      const defaultLogger = createLogger();
      return {
        ...defaultLogger,
        warn: (msg: string, opts?: { timestamp?: boolean }) => {
          if (
            typeof msg === "string" &&
            msg.includes("@tailwindcss/vite") &&
            msg.includes("Sourcemap")
          )
            return;
          defaultLogger.warn(msg, opts);
        },
      };
    })(),
  },

  modules: ["@nuxtjs/robots"],
});
