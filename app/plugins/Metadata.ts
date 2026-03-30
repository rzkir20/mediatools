import {
  defineNuxtPlugin,
  useHead,
  useRuntimeConfig,
  useSeoMeta,
  useRoute,
} from "nuxt/app";

//====================== Metadata For Landing ==============================//

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const siteUrl =
    config.public.siteUrl || "https://downloadin.rizkiramadhan.web.id";
  const route = useRoute();

  const routeMetaMap: Record<
    string,
    {
      title: string;
      description: string;
      slug: string;
    }
  > = {
    "/tiktok": {
      title: "Download TikTok Video Tanpa Watermark - Downloadin",
      description:
        "Downloader TikTok gratis untuk menyimpan video tanpa watermark dalam kualitas HD. Tempel link TikTok dan unduh video, audio, atau gambar hanya dengan sekali klik.",
      slug: "/tiktok",
    },
    "/youtube": {
      title: "Download YouTube Video & Audio - Downloadin",
      description:
        "Downloader YouTube gratis untuk menyimpan video dan audio. Tempel link YouTube dan unduh MP4 atau MP3 dalam hitungan detik.",
      slug: "/youtube",
    },
    "/instagram": {
      title: "Download Instagram Reels, Foto & Carousel - Downloadin",
      description:
        "Download Reels, foto, dan carousel Instagram dari link publik tanpa watermark. Simpan konten favoritmu dalam kualitas tinggi.",
      slug: "/instagram",
    },
    "/facebook": {
      title: "Download Video Facebook & fb.watch - Downloadin",
      description:
        "Downloader Facebook untuk video dan foto dari facebook.com dan fb.watch. Tempel link publik dan unduh video MP4 dengan mudah.",
      slug: "/facebook",
    },
    "/docx-to-pdf": {
      title: "Konversi DOCX ke PDF Online - Downloadin",
      description:
        "Konversi dokumen Word (DOCX) ke PDF yang rapi tanpa watermark. Cocok untuk laporan, surat, dan dokumen kerja.",
      slug: "/docx-to-pdf",
    },
    "/ppt-to-pdf": {
      title: "Konversi PPTX ke PDF Online - Downloadin",
      description:
        "Ubah file PowerPoint (PPTX) menjadi PDF siap kirim. Penyajian slide tetap rapi tanpa watermark.",
      slug: "/ppt-to-pdf",
    },
    "/excel-to-pdf": {
      title: "Konversi Excel (XLSX) ke PDF Online - Downloadin",
      description:
        "Konversi file Excel (XLSX) ke PDF dengan tampilan tabel rapi. Ideal untuk laporan keuangan dan data lainnya.",
      slug: "/excel-to-pdf",
    },
    "/pdf-to-docx": {
      title: "Konversi PDF ke Word (DOCX) Online - Downloadin",
      description:
        "Ekstrak teks dari PDF menjadi dokumen Word (DOCX) yang bisa diedit kembali, tanpa watermark.",
      slug: "/pdf-to-docx",
    },
    "/pdf-to-excel": {
      title: "Konversi PDF ke Excel (XLSX) Online - Downloadin",
      description:
        "Ubah teks dari PDF menjadi file Excel (XLSX) sederhana yang mudah diolah ulang.",
      slug: "/pdf-to-excel",
    },
    "/pdf-to-ppt": {
      title: "Konversi PDF ke PowerPoint (PPTX) Online - Downloadin",
      description:
        "Konversi konten teks dari PDF menjadi presentasi PowerPoint (PPTX) sederhana.",
      slug: "/pdf-to-ppt",
    },
    "/jpg-to-pdf": {
      title: "Konversi JPG/PNG ke PDF Online - Downloadin",
      description:
        "Gabungkan gambar JPG/PNG/WebP menjadi file PDF satu halaman yang rapi untuk scan dokumen dan tanda tangan.",
      slug: "/jpg-to-pdf",
    },
    "/html-to-pdf": {
      title: "Konversi HTML ke PDF Online - Downloadin",
      description:
        "Konversi file HTML statis menjadi PDF yang siap dibagikan atau dicetak.",
      slug: "/html-to-pdf",
    },
    "/donasi": {
      title: "Donasi untuk Dukung Media Tools - Downloadin",
      description:
        "Dukung pengembangan Media Tools melalui donasi untuk membantu biaya server, maintenance, dan fitur baru.",
      slug: "/donasi",
    },
  };

  useHead({
    title: "Downloadin - One Tool. All Social Media.",
    htmlAttrs: {
      lang: "id",
    },
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    link: [
      {
        rel: "canonical",
        href: siteUrl as string,
      },
    ],
  });

  useSeoMeta({
    title: "Downloadin - One Tool. All Social Media.",
    ogTitle: "Downloadin - One Tool. All Social Media.",
    description:
      "Downloadin adalah alat serbaguna untuk mengunduh konten dari berbagai sosial media dengan cepat dan mudah.",
    ogDescription:
      "Gunakan Downloadin untuk download video, gambar, dan konten lain dari berbagai platform sosial media dalam satu tempat.",
    ogType: "website",
    ogUrl: siteUrl as string,
    ogSiteName: "Downloadin",
    ogImage: `${siteUrl}/desktop.png`,
    twitterCard: "summary_large_image",
    twitterTitle: "Downloadin - One Tool. All Social Media.",
    twitterDescription:
      "Satu tool untuk mengunduh berbagai konten sosial media secara mudah dan cepat.",
    twitterImage: `${siteUrl}/desktop.png`,
  });

  //====================== Route-specific Metadata ==============================//

  useSeoMeta({
    title: () => routeMetaMap[route.path]?.title,
    ogTitle: () => routeMetaMap[route.path]?.title,
    description: () => routeMetaMap[route.path]?.description,
    ogDescription: () => routeMetaMap[route.path]?.description,
    ogUrl: () => {
      const meta = routeMetaMap[route.path];
      return meta ? `${siteUrl}${meta.slug}` : undefined;
    },
    ogSiteName: () => (routeMetaMap[route.path] ? "Downloadin" : undefined),
    ogImage: () =>
      routeMetaMap[route.path] ? `${siteUrl}/og-image.png` : undefined,
    twitterCard: () =>
      routeMetaMap[route.path] ? "summary_large_image" : undefined,
    twitterTitle: () => routeMetaMap[route.path]?.title,
    twitterDescription: () => routeMetaMap[route.path]?.description,
    twitterImage: () =>
      routeMetaMap[route.path] ? `${siteUrl}/og-image.png` : undefined,
  });
});
