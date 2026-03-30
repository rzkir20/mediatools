import { ref, computed, watch, onMounted } from "vue";
import { useQuery, useMutation } from "@tanstack/vue-query";
import { useAppConfig, withApiSecret } from "~/lib/config";

const HISTORY_STORAGE_KEY = "youtube-download-history";
const HISTORY_MAX = 50;
const PLATFORM = "youtube";

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

function parseQuality(label: string | null): number {
  if (!label || typeof label !== "string") return 0;
  const m = label.match(/^(\d+)/);
  return m?.[1] != null ? parseInt(m[1], 10) : 0;
}

function buildVideoInfo(
  data: YoutubeMetadataResponse,
  baseUrl: string,
  url: string,
): VideoInfo {
  const formats = data.formats ?? [];
  const hasVideo = formats.some((f) => !f.isAudioOnly);
  const hasAudio = formats.some((f) => f.isAudioOnly);

  const videoFormats = formats
    .filter((f) => !f.isAudioOnly && f.qualityLabel)
    .sort(
      (a, b) =>
        parseQuality(b.qualityLabel ?? null) -
        parseQuality(a.qualityLabel ?? null),
    );

  const seenLabels = new Set<string>();
  const formatOptions: { index: number; label: string }[] = [];
  videoFormats.forEach((f, i) => {
    const label = f.qualityLabel ?? `${i + 1}`;
    const key = label.toUpperCase();
    if (seenLabels.has(key)) return;
    seenLabels.add(key);
    formatOptions.push({ index: i, label });
  });

  const previewVideoUrl = hasVideo
    ? withApiSecret(
        `${baseUrl}/api/${PLATFORM}/preview-video?url=${encodeURIComponent(url)}`,
      )
    : undefined;

  return {
    videoUrl: undefined,
    videoUrlHd: undefined,
    qualities: undefined,
    formatOptions: formatOptions.length ? formatOptions : undefined,
    previewVideoUrl,
    audioUrl: hasAudio ? "available" : undefined,
    images: undefined,
    cover: data.thumbnail ?? undefined,
    previewImageUrls: undefined,
    text: data.title ?? undefined,
    author: undefined,
    duration: data.duration ?? undefined,
    durationMs: data.durationSeconds ?? undefined,
    id: data.id ?? undefined,
  };
}

export function useStateYoutube() {
  const { apiUrl } = useAppConfig();
  const baseUrl = apiUrl;

  const videoUrl = ref("");
  const searchUrl = ref("");
  const imageIndex = ref(0);
  const videoLoadFailed = ref(false);
  const selectedFormatIndex = ref(0);
  const historyItems = ref<HistoryItem[]>([]);
  const historyReady = ref(false);

  onMounted(() => {
    historyItems.value = loadHistoryFromStorage();
    historyReady.value = true;
  });

  const metadataQuery = useQuery({
    queryKey: [PLATFORM, "metadata", searchUrl] as const,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/api/${PLATFORM}/metadata?url=${encodeURIComponent(
          searchUrl.value,
        )}`,
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message ?? data.error ?? "Gagal mengambil data");
      return data as YoutubeMetadataResponse;
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

  const effectivePreviewVideoUrl = computed(() => {
    const info = videoInfo.value;
    if (!info?.previewVideoUrl) return undefined;
    const opts = info.formatOptions;
    const idx = selectedFormatIndex.value;
    if (opts?.length) {
      const safeIdx = Math.min(Math.max(0, idx), opts.length - 1);
      const backendIndex = opts[safeIdx]?.index ?? safeIdx;
      return `${info.previewVideoUrl}&quality=${backendIndex}`;
    }
    return info.previewVideoUrl;
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
      });
  });

  const downloadVideoMutation = useMutation({
    mutationFn: async ({
      url,
      qualityIndex,
    }: {
      url: string;
      qualityIndex: number;
    }) => {
      const params = new URLSearchParams({ url });
      params.set("quality", String(qualityIndex));
      const res = await fetch(
        `${baseUrl}/api/${PLATFORM}/download?${params.toString()}`,
      );
      if (!res.ok) throw new Error("Gagal unduh video");
      return res.blob();
    },
    onSuccess(blob: Blob) {
      triggerBlobDownload(blob, "youtube_video.mp4");
    },
  });

  const downloadMp3Mutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch(
        `${baseUrl}/api/${PLATFORM}/download-mp3?url=${encodeURIComponent(url)}`,
      );
      if (!res.ok) throw new Error("Gagal unduh audio");
      return res.blob();
    },
    onSuccess(blob: Blob) {
      triggerBlobDownload(blob, "youtube_audio.mp3");
    },
  });

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
      const p = Math.min(100, (loaded / total) * 100);
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
      } else if (p < 100) {
        downloadStatusText.value = "Finalizing...";
        downloadStageLabel.value = "Verifying Assets";
      }
    } else {
      const estimatedTotal = 30 * 1024 * 1024;
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
    metadata: { label: string; value: string; gradient?: boolean }[],
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
    () => downloadVideoMutation.isPending.value,
  );
  const downloadMp3Loading = computed(
    () => downloadMp3Mutation.isPending.value,
  );
  const downloadImagesLoading = computed(() => false);
  const downloadError = computed(() => {
    if (downloadProgressError.value) return downloadProgressError.value;
    const err =
      metadataQuery.error.value ??
      downloadVideoMutation.error.value ??
      downloadMp3Mutation.error.value;
    return err instanceof Error ? err.message : err ? String(err) : "";
  });

  function addToHistory(
    url: string,
    data: { title?: string; thumbnail?: string },
  ) {
    const item: HistoryItem = {
      id: `${Date.now()}-${url.slice(-16).replace(/\W/g, "")}`,
      url,
      title: data.title?.slice(0, 80) || "YouTube Video",
      author: undefined,
      cover: data.thumbnail || "",
      type: "Video",
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
    imageIndex.value = 0;
    videoLoadFailed.value = false;
    selectedFormatIndex.value = 0;
    downloadVideoMutation.reset();
    downloadMp3Mutation.reset();
    searchUrl.value = url;
  }

  async function onDownloadVideo() {
    const url = searchUrl.value.trim();
    const info = videoInfo.value;
    if (!url || !info) return;
    const opts = info.formatOptions;
    const uiIndex = Math.min(
      Math.max(0, selectedFormatIndex.value),
      opts?.length ? opts.length - 1 : 0,
    );
    const qualityIndex = opts?.[uiIndex]?.index ?? uiIndex;
    const qualityLabel = opts?.[uiIndex]?.label ?? "Default";
    const filename = info.id ? `youtube_${info.id}.mp4` : "youtube_video.mp4";

    const params = new URLSearchParams({ url });
    params.set("quality", String(qualityIndex));
    const downloadUrl = `${baseUrl}/api/${PLATFORM}/download?${params.toString()}`;

    openProgressModal(filename, [
      { label: "Quality", value: qualityLabel },
      { label: "Format", value: "MP4" },
      { label: "Source", value: "YouTube" },
      { label: "No watermark", value: "Yes", gradient: true },
    ]);

    try {
      await downloadWithProgress(downloadUrl, filename, [
        { label: "Quality", value: qualityLabel },
        { label: "Format", value: "MP4" },
        { label: "Source", value: "YouTube" },
        { label: "No watermark", value: "Yes", gradient: true },
      ]);
    } catch (err) {
      downloadProgressError.value =
        err instanceof Error ? err.message : "Download failed";
      closeProgressModal();
      throw err;
    }
  }

  async function onDownloadMp3() {
    const url = searchUrl.value.trim();
    const info = videoInfo.value;
    if (!url || !info) return;
    const filename = info.id ? `youtube_${info.id}.mp3` : "youtube_audio.mp3";
    const downloadUrl = `${baseUrl}/api/${PLATFORM}/download-mp3?url=${encodeURIComponent(url)}`;

    openProgressModal(filename, [
      { label: "Format", value: "MP3" },
      { label: "Source", value: "YouTube" },
      { label: "Quality", value: "Audio", gradient: true },
    ]);

    try {
      await downloadWithProgress(downloadUrl, filename, [
        { label: "Format", value: "MP3" },
        { label: "Source", value: "YouTube" },
        { label: "Quality", value: "Audio", gradient: true },
      ]);
    } catch (err) {
      downloadProgressError.value =
        err instanceof Error ? err.message : "Download failed";
      closeProgressModal();
      throw err;
    }
  }

  function onDownloadImages() {
    // Not used for YouTube (no image-only posts)
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
    downloadMp3Loading,
    downloadImagesLoading,
    videoLoadFailed,
    videoInfo,
    effectivePreviewVideoUrl,
    selectedFormatIndex,
    imageIndex,
    historyItems,
    historyReady,
    clearHistory,
    openHistoryItem,
    onSearch,
    onDownloadVideo,
    onDownloadMp3,
    onDownloadImages,
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
