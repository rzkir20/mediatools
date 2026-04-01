import { computed, onMounted, ref, watch } from "vue";

import { useQuery } from "@tanstack/vue-query";

import { useAppConfig, withApiSecret } from "~/lib/config";
import { socialMetadataQueryDefaults } from "~/lib/queryOptions";

const HISTORY_STORAGE_KEY = "threads-download-history";
const HISTORY_MAX = 50;
const PLATFORM = "threads";

function loadHistoryFromStorage(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

function saveHistoryToStorage(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function triggerDirectDownload(url: string, filename?: string) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  if (filename) a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function buildVideoInfo(
  data: ThreadMetadataResponse,
  baseUrl: string,
): VideoInfo {
  const proxiedVideoUrl = data.videoUrl
    ? withApiSecret(
        `${baseUrl}/api/${PLATFORM}/preview-video?mediaUrl=${encodeURIComponent(data.videoUrl)}`,
      )
    : undefined;
  const previewImageUrls = (data.images ?? []).map((imageUrl) =>
    withApiSecret(
      `${baseUrl}/api/${PLATFORM}/preview-image?mediaUrl=${encodeURIComponent(imageUrl)}`,
    ),
  );

  const apiItems = data.mediaItems?.length
    ? data.mediaItems
    : [
        ...(data.videoUrl
          ? [{ type: "video" as const, url: data.videoUrl }]
          : []),
        ...(data.images ?? []).map((url) => ({
          type: "image" as const,
          url,
        })),
      ];

  const mediaItems = apiItems.map((it) => ({
    type: it.type,
    url: it.url,
    previewUrl: withApiSecret(
      `${baseUrl}/api/${PLATFORM}/${it.type === "video" ? "preview-video" : "preview-image"}?mediaUrl=${encodeURIComponent(it.url)}`,
    ),
  }));

  const firstImageSlide = mediaItems.find((m) => m.type === "image");

  return {
    videoUrl: data.videoUrl ?? undefined,
    previewVideoUrl: proxiedVideoUrl,
    images: data.images ?? undefined,
    cover: firstImageSlide?.url ?? data.images?.[0] ?? undefined,
    previewImageUrls: previewImageUrls.length ? previewImageUrls : undefined,
    mediaItems: mediaItems.length ? mediaItems : undefined,
    text: data.caption ?? undefined,
    author: undefined,
  };
}

export function useStateThread() {
  const { apiUrl } = useAppConfig();
  const baseUrl = apiUrl;

  const threadUrl = ref("");
  const searchUrl = ref("");
  const imageIndex = ref(0);
  const historyItems = ref<HistoryItem[]>([]);
  const historyReady = ref(false);

  onMounted(() => {
    historyItems.value = loadHistoryFromStorage();
    historyReady.value = true;
  });

  const metadataQuery = useQuery({
    queryKey: ["threads", "metadata", searchUrl] as const,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/api/${PLATFORM}/metadata?url=${encodeURIComponent(searchUrl.value)}`,
      );
      const data = (await res.json()) as ThreadMetadataResponse & {
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Gagal mengambil data");
      }
      return data;
    },
    enabled: computed(() => !!searchUrl.value.trim()),
    retry: false,
    ...socialMetadataQueryDefaults,
  });

  const videoInfo = computed(() => {
    const data = metadataQuery.data.value;
    if (!data) return null;
    return buildVideoInfo(data, baseUrl);
  });

  watch(
    () => videoInfo.value?.mediaItems?.length ?? 0,
    (len) => {
      if (len > 0 && imageIndex.value >= len) {
        imageIndex.value = Math.max(0, len - 1);
      }
    },
  );

  const downloadLoading = computed(
    () => !!searchUrl.value.trim() && metadataQuery.isPending.value,
  );

  const downloadError = computed(() => {
    const err = metadataQuery.error.value;
    return err instanceof Error ? err.message : err ? String(err) : "";
  });

  watch([searchUrl, () => metadataQuery.data.value], () => {
    const url = searchUrl.value;
    const data = metadataQuery.data.value;
    if (!url || !data) return;

    const hasVid =
      data.mediaItems?.some((m) => m.type === "video") ?? Boolean(data.videoUrl);
    const hasImg =
      data.mediaItems?.some((m) => m.type === "image") ??
      Boolean(data.images?.length);
    const item: HistoryItem = {
      id: `${Date.now()}-${url.slice(-12)}`,
      url,
      title: (data.caption ?? "Threads Post").slice(0, 80),
      cover:
        data.mediaItems?.find((m) => m.type === "image")?.url ??
        data.images?.[0] ??
        (data.videoUrl || ""),
      type: hasVid && !hasImg ? "Video" : "Image",
      date: Date.now(),
    };

    const list = [
      item,
      ...historyItems.value.filter((historyItem) => historyItem.url !== url),
    ].slice(0, HISTORY_MAX);
    historyItems.value = list;
    saveHistoryToStorage(list);
  });

  function onSearch() {
    const url = threadUrl.value.trim();
    if (!url) return;
    imageIndex.value = 0;
    searchUrl.value = url;
  }

  function onDownloadCurrentSlide() {
    const slide = videoInfo.value?.mediaItems?.[imageIndex.value];
    if (!slide) return;
    if (slide.type === "video") {
      const downloadUrl = withApiSecret(
        `${baseUrl}/api/${PLATFORM}/download-video?mediaUrl=${encodeURIComponent(slide.url)}`,
      );
      triggerDirectDownload(downloadUrl, `threads_slide_${imageIndex.value + 1}.mp4`);
      return;
    }
    const downloadUrl = withApiSecret(
      `${baseUrl}/api/${PLATFORM}/download-image?mediaUrl=${encodeURIComponent(slide.url)}`,
    );
    triggerDirectDownload(downloadUrl, `threads_image_${imageIndex.value + 1}.jpg`);
  }

  function onDownloadAnother() {
    threadUrl.value = "";
    searchUrl.value = "";
    imageIndex.value = 0;
    document
      .getElementById("download-input")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function openHistoryItem(item: HistoryItem) {
    threadUrl.value = item.url;
    searchUrl.value = item.url;
    imageIndex.value = 0;
  }

  function clearHistory() {
    historyItems.value = [];
    saveHistoryToStorage([]);
  }

  return {
    threadUrl,
    imageIndex,
    videoInfo,
    historyItems,
    historyReady,
    downloadLoading,
    downloadError,
    onSearch,
    onDownloadCurrentSlide,
    onDownloadAnother,
    openHistoryItem,
    clearHistory,
  };
}
