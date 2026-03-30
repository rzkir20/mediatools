import { ref, computed, watch, onMounted } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useAppConfig, withApiSecret } from "~/lib/config";

const HISTORY_STORAGE_KEY = "facebook-download-history";
const HISTORY_MAX = 50;
const PLATFORM = "facebook";

function facebookImageNeedsBackendProxy(url: string): boolean {
  if (!url || !/^https:\/\//i.test(url)) return false;
  try {
    const h = new URL(url).hostname.toLowerCase();
    return (
      h.endsWith(".fbcdn.net") ||
      h === "fbcdn.net" ||
      h.endsWith(".fbsbx.com") ||
      h === "fbsbx.com"
    );
  } catch {
    return false;
  }
}

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
  data: FacebookMetadataResponse,
  baseUrl: string,
  url: string,
): VideoInfo {
  return {
    videoUrl: data.videoUrl ?? undefined,
    // Facebook: kita tidak expose opsi kualitas di UI, cukup gunakan URL utama.
    videoUrlHd: undefined,
    qualities: undefined,
    previewVideoUrl: data.videoUrl
      ? withApiSecret(
          `${baseUrl}/api/${PLATFORM}/preview-video?url=${encodeURIComponent(url)}`,
        )
      : undefined,
    cover: data.thumbnail ?? undefined,
    // Facebook: kita tidak memakai status/caption sebagai text yang ditampilkan.
    text: undefined,
    author: undefined,
    duration: data.duration ?? undefined,
    durationMs: data.durationMs ?? undefined,
    id: data.id ?? undefined,
  };
}

export function useStateFacebook() {
  const { apiUrl } = useAppConfig();
  const baseUrl = apiUrl;

  const videoUrl = ref("");
  const searchUrl = ref("");
  const videoLoadFailed = ref(false);
  const historyItems = ref<HistoryItem[]>([]);
  const historyReady = ref(false);

  onMounted(() => {
    historyItems.value = loadHistoryFromStorage();
    historyReady.value = true;
  });

  const metadataQuery = useQuery({
    queryKey: ["facebook", "metadata", searchUrl] as const,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/api/${PLATFORM}/metadata?url=${encodeURIComponent(searchUrl.value)}`,
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message ?? data.error ?? "Gagal mengambil data");
      return data as FacebookMetadataResponse;
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
        title: data.title ?? undefined,
        thumbnail: data.thumbnail ?? undefined,
        videoUrl: data.videoUrl ?? undefined,
      });
  });

  // ---- Download Progress Modal (mengikuti pola TikTok) ----
  const showDownloadProgressModal = ref(false);
  const downloadProgress = ref(0);
  const downloadStatusText = ref("Initializing...");
  const downloadStageLabel = ref("Preparing Stream");
  const downloadFileName = ref("");
  const downloadLoadedBytes = ref(0);
  const downloadTotalBytes = ref<number | null>(null);
  const downloadSpeedBytesPerSec = ref(0);
  const downloadRemainingSec = ref<number | null>(null);
  const downloadSuccess = ref(false);
  const downloadCompleteBlob = ref<Blob | null>(null);
  const downloadCompleteFilename = ref("");
  const downloadProgressMetadata = ref<
    { label: string; value: string; gradient?: boolean }[]
  >([]);
  const downloadProgressError = ref("");

  let progressSpeedLastLoaded = 0;
  let progressSpeedLastTime = 0;

  function openProgressModal(
    fileName: string,
    metadata: { label: string; value: string; gradient?: boolean }[] = [],
  ) {
    showDownloadProgressModal.value = true;
    downloadProgress.value = 0;
    downloadStatusText.value = "Initializing...";
    downloadStageLabel.value = "Preparing Stream";
    downloadFileName.value = fileName;
    downloadLoadedBytes.value = 0;
    downloadTotalBytes.value = null;
    downloadSpeedBytesPerSec.value = 0;
    downloadRemainingSec.value = null;
    downloadSuccess.value = false;
    downloadCompleteBlob.value = null;
    downloadCompleteFilename.value = fileName;
    downloadProgressMetadata.value = metadata;
    downloadProgressError.value = "";
    progressSpeedLastLoaded = 0;
    progressSpeedLastTime = Date.now();
  }

  function closeProgressModal() {
    showDownloadProgressModal.value = false;
    downloadCompleteBlob.value = null;
    downloadProgressError.value = "";
  }

  function updateProgressFromXhr(loaded: number, total: number | null) {
    downloadLoadedBytes.value = loaded;
    downloadTotalBytes.value = total;
    const now = Date.now();
    const elapsed = (now - progressSpeedLastTime) / 1000;
    if (elapsed >= 0.25) {
      downloadSpeedBytesPerSec.value =
        (loaded - progressSpeedLastLoaded) / elapsed;
      progressSpeedLastLoaded = loaded;
      progressSpeedLastTime = now;
    }
    if (total != null && total > 0) {
      const ratio = total > 0 ? loaded / total : 0;
      const p = Math.min(100, ratio * 100);
      downloadProgress.value = p;
      if (downloadSpeedBytesPerSec.value > 0 && loaded < total) {
        const remaining = (total - loaded) / downloadSpeedBytesPerSec.value;
        downloadRemainingSec.value = Math.max(0, Math.ceil(remaining));
      } else {
        downloadRemainingSec.value = 0;
      }
      if (p < 15) {
        downloadStatusText.value = "Initializing...";
        downloadStageLabel.value = "Preparing Stream";
      } else if (p < 70) {
        downloadStatusText.value = "Downloading...";
        downloadStageLabel.value = "Saving Media Data";
      } else if (p < 85) {
        downloadStatusText.value = "Processing...";
        downloadStageLabel.value = "Optimizing Video";
      } else {
        downloadStatusText.value = "Finalizing...";
        downloadStageLabel.value = "Verifying Assets";
      }
    } else {
      const estimatedTotal = 30 * 1024 * 1024; // 30MB estimasi
      const pFromLoaded = (loaded / estimatedTotal) * 99;
      downloadProgress.value = Math.min(
        99,
        Math.max(downloadProgress.value, pFromLoaded),
      );
      if (downloadProgress.value < 30) {
        downloadStatusText.value = "Downloading...";
        downloadStageLabel.value = "Saving Media Data";
      } else if (downloadProgress.value < 80) {
        downloadStatusText.value = "Processing...";
        downloadStageLabel.value = "Optimizing Video";
      } else {
        downloadStatusText.value = "Finalizing...";
        downloadStageLabel.value = "Verifying Assets";
      }
    }
  }

  function finishProgressSuccess(blob: Blob, filename: string) {
    downloadProgress.value = 100;
    downloadStatusText.value = "Complete!";
    downloadStageLabel.value = "Done";
    downloadRemainingSec.value = 0;
    downloadCompleteBlob.value = blob;
    downloadCompleteFilename.value = filename;
    downloadSuccess.value = true;
  }

  function downloadWithProgress(
    url: string,
    defaultFilename: string,
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";

      xhr.onprogress = (ev: ProgressEvent) => {
        const total =
          ev.lengthComputable && ev.total != null
            ? ev.total
            : xhr.getResponseHeader("Content-Length") != null
              ? parseInt(xhr.getResponseHeader("Content-Length")!, 10)
              : null;
        updateProgressFromXhr(ev.loaded, total);
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(`Download failed: ${xhr.status}`));
          return;
        }
        const blob = xhr.response as Blob;
        if (!blob || !(blob instanceof Blob)) {
          reject(new Error("Invalid response"));
          return;
        }
        let filename = defaultFilename;
        const disp = xhr.getResponseHeader("Content-Disposition");
        if (disp) {
          const m = disp.match(/filename="?([^";\n]+)"?/);
          if (m?.[1]) filename = m[1].trim();
        }
        downloadProgress.value = 100;
        downloadRemainingSec.value = 0;
        finishProgressSuccess(blob, filename);
        resolve(blob);
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send();
    });
  }

  function onProgressModalSave() {
    const blob = downloadCompleteBlob.value;
    const filename = downloadCompleteFilename.value;
    if (blob && filename) triggerBlobDownload(blob, filename);
    closeProgressModal();
  }

  function onProgressModalDownloadNew() {
    closeProgressModal();
    document
      .getElementById("download-input")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  const downloadVideoLoading = computed(
    () => showDownloadProgressModal.value && !downloadSuccess.value,
  );

  const downloadError = computed(() => {
    if (downloadProgressError.value) return downloadProgressError.value;
    const err = metadataQuery.error.value;
    return err instanceof Error ? err.message : err ? String(err) : "";
  });

  function addToHistory(
    url: string,
    data: { title?: string; thumbnail?: string; videoUrl?: string },
  ) {
    const type: HistoryItem["type"] = "Video";
    const item: HistoryItem = {
      id: `${Date.now()}-${url.slice(-16).replace(/\W/g, "")}`,
      url,
      title: data.title?.slice(0, 80) || "Facebook Video",
      cover: data.thumbnail || "",
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
    videoLoadFailed.value = false;
  }

  function getHistoryPreviewUrl(item: HistoryItem): string {
    const c = item.cover || "";
    if (!c) return "";
    if (facebookImageNeedsBackendProxy(c)) {
      return withApiSecret(
        `${baseUrl}/api/${PLATFORM}/proxy-image?url=${encodeURIComponent(c)}`,
      );
    }
    return c;
  }

  function triggerBlobDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onSearch() {
    const url = videoUrl.value.trim();
    if (!url) return;
    videoLoadFailed.value = false;
    searchUrl.value = url;
  }

  async function onDownloadVideo() {
    const url = searchUrl.value.trim();
    if (!url || !videoInfo.value) return;

    const filename = "facebook_video.mp4";
    const downloadUrl = `${baseUrl}/api/${PLATFORM}/download?url=${encodeURIComponent(url)}`;

    openProgressModal(filename, [
      { label: "Format", value: "MP4" },
      { label: "Source", value: "Facebook" },
    ]);

    try {
      await downloadWithProgress(downloadUrl, filename);
    } catch (err) {
      downloadProgressError.value =
        err instanceof Error ? err.message : "Download failed";
      closeProgressModal();
      throw err;
    }
  }

  function onDownloadAnother() {
    videoUrl.value = "";
    searchUrl.value = "";
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
    videoLoadFailed,
    videoInfo,
    historyItems,
    historyReady,
    clearHistory,
    openHistoryItem,
    getHistoryPreviewUrl,
    onSearch,
    onDownloadVideo,
    onDownloadAnother,
    showDownloadProgressModal,
    downloadProgress,
    downloadStatusText,
    downloadStageLabel,
    downloadFileName,
    downloadLoadedBytes,
    downloadTotalBytes,
    downloadSpeedBytesPerSec,
    downloadRemainingSec,
    downloadSuccess,
    downloadCompleteFilename,
    downloadProgressMetadata,
    downloadProgressError,
    closeProgressModal,
    onProgressModalSave,
    onProgressModalDownloadNew,
  };
}
