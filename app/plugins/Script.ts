import { defineNuxtPlugin, useHead, useRuntimeConfig, useRoute } from "nuxt/app";

//====================== Breadcrumb JSON-LD For Landing ==============================//

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const siteUrl =
    config.public.siteUrl || "https://downloadin.rizkiramadhan.web.id";
  const route = useRoute();

  const breadcrumbLandingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
    ],
  };

  const breadcrumbMap: Record<string, { name: string; slug: string }> = {
    "/tiktok": {
      name: "TikTok Downloader",
      slug: "/tiktok",
    },
    "/youtube": {
      name: "YouTube Downloader",
      slug: "/youtube",
    },
    "/instagram": {
      name: "Instagram Downloader",
      slug: "/instagram",
    },
    "/facebook": {
      name: "Facebook Downloader",
      slug: "/facebook",
    },
    "/docx-to-pdf": {
      name: "DOCX to PDF",
      slug: "/docx-to-pdf",
    },
    "/ppt-to-pdf": {
      name: "PPTX to PDF",
      slug: "/ppt-to-pdf",
    },
    "/excel-to-pdf": {
      name: "Excel to PDF",
      slug: "/excel-to-pdf",
    },
    "/pdf-to-docx": {
      name: "PDF to DOCX",
      slug: "/pdf-to-docx",
    },
    "/pdf-to-excel": {
      name: "PDF to Excel",
      slug: "/pdf-to-excel",
    },
    "/pdf-to-ppt": {
      name: "PDF to PowerPoint",
      slug: "/pdf-to-ppt",
    },
    "/jpg-to-pdf": {
      name: "JPG/PNG to PDF",
      slug: "/jpg-to-pdf",
    },
    "/html-to-pdf": {
      name: "HTML to PDF",
      slug: "/html-to-pdf",
    },
    "/donasi": {
      name: "Donasi",
      slug: "/donasi",
    },
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: () => {
          const entry = breadcrumbMap[route.path];

          if (!entry) {
            return JSON.stringify(breadcrumbLandingJsonLd);
          }

          const breadcrumbJsonLd = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: entry.name,
                item: `${siteUrl}${entry.slug}`,
              },
            ],
          };

          return JSON.stringify(breadcrumbJsonLd);
        },
      },
    ],
  });
});

//====================== Breadcrumb JSON-LD For Tiktok ==============================//
