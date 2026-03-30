import { ref, computed, watch, onMounted } from "vue";
import { useQuery, useMutation } from "@tanstack/vue-query";
import { useAppConfig, withApiSecret } from "~/lib/config";

const HISTORY_STORAGE_KEY = "instagram-download-history";
const HISTORY_MAX = 50;
const PLATFORM = "instagram";

function loadHistoryFromStorage(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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

function buildVideoInfo(
  data: InstagramMetadataResponse,
  baseUrl: string,
  url: string,
): VideoInfo {
  const count = data.images?.length ?? (data.cover ? 1 : 0);
  const previewImageUrls = count
    ? Array.from({ length: count }, (_, i) =>
        withApiSecret(
          `${baseUrl}/api/${PLATFORM}/preview-image?url=${encodeURIComponent(url)}&index=${i}`,
        ),
      )
    : undefined;
  return {
    videoUrl: data.videoUrl,
    previewVideoUrl: data.videoUrl
      ? withApiSecret(
          `${baseUrl}/api/${PLATFORM}/preview-video?url=${encodeURIComponent(url)}`,
        )
      : undefined,
    audioUrl: undefined,
    images: data.images ?? undefined,
    cover: data.cover,
    previewImageUrls,
    text: data.text,
    author: data.author,
  };
}

export function useStateInstagram() {
  const { apiUrl } = useAppConfig();
  const baseUrl = apiUrl;

  // ---- UI state (minimal) ----
  const videoUrl = ref("");
  const searchUrl = ref(""); // set on Search / openHistoryItem → drives query
  const imageIndex = ref(0);
  const videoLoadFailed = ref(false);
  const historyItems = ref<HistoryItem[]>([]);
  const historyReady = ref(false);

  onMounted(() => {
    historyItems.value = loadHistoryFromStorage();
    historyReady.value = true;
  });

  // ---- Metadata: TanStack Query ----
  const metadataQuery = useQuery({
    queryKey: ["instagram", "metadata", searchUrl] as const,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/api/${PLATFORM}/metadata?url=${encodeURIComponent(searchUrl.value)}`,
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message ?? data.error ?? "Gagal mengambil data");
      return data as InstagramMetadataResponse;
    },
    enabled: computed(() => !!searchUrl.value.trim()),
    retry: false,
  });

  const videoInfo = computed(() => {
    const url = searchUrl.value;
    const data = metadataQuery.data.value;
    if (!url || !data) return null;
    return buildVideoInfo(data, baseUrl, url);
  });

  const downloadLoading = computed(
    () => !!searchUrl.value.trim() && metadataQuery.isPending.value,
  );

  watch([searchUrl, () => metadataQuery.data.value], () => {
    const data = metadataQuery.data.value;
    const url = searchUrl.value;
    if (url && data)
      addToHistory(url, {
        text: data.text,
        author: data.author,
        cover: data.cover,
        images: data.images ?? undefined,
        videoUrl: data.videoUrl,
      });
  });

  // ---- Download: TanStack Mutations ----
  const downloadVideoMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch(
        `${baseUrl}/api/${PLATFORM}/download?url=${encodeURIComponent(url)}`,
      );
      if (!res.ok) throw new Error("Gagal unduh video");
      return res.blob();
    },
    onSuccess(blob: Blob) {
      triggerBlobDownload(blob, "instagram_video.mp4");
    },
  });

  const downloadImageMutation = useMutation({
    mutationFn: async ({ url, index }: { url: string; index: number }) => {
      const res = await fetch(
        `${baseUrl}/api/${PLATFORM}/download-image?url=${encodeURIComponent(url)}&index=${index}`,
      );
      if (!res.ok) throw new Error("Gagal unduh gambar");
      return res.blob();
    },
    onSuccess(blob: Blob, variables: { url: string; index: number }) {
      const info = videoInfo.value;
      const ext = info?.images?.[variables.index]?.includes(".webp")
        ? "webp"
        : info?.images?.[variables.index]?.includes(".png")
          ? "png"
          : "jpg";
      triggerBlobDownload(
        blob,
        `instagram_image_${variables.index + 1}.${ext}`,
      );
    },
  });

  const downloadVideoLoading = computed(
    () => downloadVideoMutation.isPending.value,
  );
  const downloadImagesLoading = computed(
    () => downloadImageMutation.isPending.value,
  );
  const downloadError = computed(() => {
    const err =
      metadataQuery.error.value ??
      downloadVideoMutation.error.value ??
      downloadImageMutation.error.value;
    return err instanceof Error ? err.message : err ? String(err) : "";
  });

  // ---- History (local only) ----
  function addToHistory(
    url: string,
    data: {
      text?: string;
      author?: string;
      cover?: string;
      images?: string[];
      videoUrl?: string;
    },
  ) {
    const type: HistoryItem["type"] = data.images?.length ? "Image" : "Video";
    const cover = data.cover || data.images?.[0] || "";
    const item: HistoryItem = {
      id: `${Date.now()}-${url.slice(-12)}`,
      url,
      title: data.text?.slice(0, 80) || "Instagram Post",
      author: data.author,
      cover,
      type,
      date: Date.now(),
    };
    const list = [
      item,
      ...historyItems.value.filter((i: HistoryItem) => i.url !== url),
    ].slice(0, HISTORY_MAX);
    historyItems.value = list;
    saveHistoryToStorage(list);
  }

  function clearHistory() {
    historyItems.value = [];
    saveHistoryToStorage([]);
  }

  function openHistoryItem(item: HistoryItem) {
    videoUrl.value = item.url;
    searchUrl.value = item.url;
    imageIndex.value = 0;
    videoLoadFailed.value = false;
  }

  function getHistoryPreviewUrl(item: HistoryItem): string {
    return withApiSecret(
      `${baseUrl}/api/${PLATFORM}/preview-image?url=${encodeURIComponent(item.url)}&index=0`,
    );
  }

  function triggerBlobDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---- Actions ----
  function onSearch() {
    const url = videoUrl.value.trim();
    if (!url) return;
    imageIndex.value = 0;
    videoLoadFailed.value = false;
    downloadVideoMutation.reset();
    downloadImageMutation.reset();
    searchUrl.value = url;
  }

  function onDownloadVideo() {
    const url = searchUrl.value.trim();
    if (!url || !videoInfo.value) return;
    downloadVideoMutation.mutate(url);
  }

  function onDownloadImages() {
    const url = searchUrl.value.trim();
    const info = videoInfo.value;
    if (!url || !info?.images?.length) return;
    downloadImageMutation.mutate({ url, index: imageIndex.value });
  }

  function onDownloadAnother() {
    videoUrl.value = "";
    searchUrl.value = "";
    imageIndex.value = 0;
    videoLoadFailed.value = false;
    document
      .getElementById("download-input")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return {
    videoUrl,
    downloadLoading,
    downloadError,
    downloadVideoLoading,
    downloadMp3Loading: ref(false),
    downloadImagesLoading,
    videoLoadFailed,
    videoInfo,
    imageIndex,
    historyItems,
    historyReady,
    clearHistory,
    openHistoryItem,
    getHistoryPreviewUrl,
    onSearch,
    onDownloadVideo,
    onDownloadImages,
    onDownloadAnother,
  };
}
