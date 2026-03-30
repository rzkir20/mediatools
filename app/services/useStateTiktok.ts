import { ref, computed, watch, onMounted } from "vue";

import { toast } from "vue-sonner";

import { useQuery, useMutation } from "@tanstack/vue-query";

import { useAppConfig, withApiSecret } from "~/lib/config";

const HISTORY_STORAGE_KEY = "tiktok-download-history";
const HISTORY_MAX = 50;
const PLATFORM = "tiktok";

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
  data: TiktokMetadataResponse,
  baseUrl: string,
  url: string,
): VideoInfo {
  return {
    videoUrl: data.videoUrlNoWaterMark ?? data.videoUrl,
    previewVideoUrl: withApiSecret(
      `${baseUrl}/api/${PLATFORM}/preview-video?url=${encodeURIComponent(url)}`,
    ),
    audioUrl: data.audioUrl,
    images: data.images ?? undefined,
    cover: data.cover,
    text: data.text,
    author: data.author,
  };
}

export function useStateTiktok() {
  const { apiUrl } = useAppConfig();
  const baseUrl = apiUrl;

  // ---- UI state (minimal) ----
  const videoUrl = ref("");
  const searchUrl = ref("");
  const imageIndex = ref(0);
  const videoLoadFailed = ref(false);
  const historyItems = ref<HistoryItem[]>([]);
  const historyReady = ref(false);
  const showClearHistoryDialog = ref(false);

  onMounted(() => {
    historyItems.value = loadHistoryFromStorage();
    historyReady.value = true;
  });

  // ---- Metadata: TanStack Query ----
  const metadataQuery = useQuery({
    queryKey: ["tiktok", "metadata", searchUrl] as const,
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/api/${PLATFORM}/metadata?url=${encodeURIComponent(searchUrl.value)}`,
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message ?? data.error ?? "Gagal mengambil data");
      return data as TiktokMetadataResponse;
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
        videoUrl: data.videoUrlNoWaterMark ?? data.videoUrl,
        audioUrl: data.audioUrl,
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
      triggerBlobDownload(blob, "tiktok_video.mp4");
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
      triggerBlobDownload(blob, "tiktok_audio.mp3");
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
      triggerBlobDownload(blob, `tiktok_image_${variables.index + 1}.${ext}`);
    },
  });

  // ---- Download Progress Modal (similar to YouTube) ----
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

  watch(downloadProgressError, (err) => {
    if (err) {
      toast.error(err);
    }
  });

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
        // Termasuk ketika p sudah 100: tetap pakai label finalizing/verifying
        downloadStatusText.value = "Finalizing...";
        downloadStageLabel.value = "Verifying Assets";
      }
    } else {
      // Server tidak mengirim total size: gunakan estimasi berbasis bytes yang sudah diunduh,
      // tapi jangan pernah menyentuh 100% sebelum unduhan benar‑benar selesai (onload).
      const estimatedTotal = 30 * 1024 * 1024; // 30MB, sama seperti YouTube
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
    () => downloadVideoMutation.isPending.value,
  );
  const downloadMp3Loading = computed(
    () => downloadMp3Mutation.isPending.value,
  );
  const downloadImagesLoading = computed(
    () => downloadImageMutation.isPending.value,
  );
  const downloadError = computed(() => {
    if (downloadProgressError.value) return downloadProgressError.value;
    const err =
      metadataQuery.error.value ??
      downloadVideoMutation.error.value ??
      downloadMp3Mutation.error.value ??
      downloadImageMutation.error.value;
    return err instanceof Error ? err.message : err ? String(err) : "";
  });

  // ---- History ----
  function addToHistory(
    url: string,
    data: {
      text?: string;
      author?: string;
      cover?: string;
      images?: string[];
      videoUrl?: string;
      audioUrl?: string;
    },
  ) {
    const type: HistoryItem["type"] = data.images?.length
      ? "Image"
      : data.audioUrl && !data.videoUrl
        ? "Music"
        : "Video";
    const cover = data.cover || data.images?.[0] || "";
    const item: HistoryItem = {
      id: `${Date.now()}-${url.slice(-12)}`,
      url,
      title: data.text?.slice(0, 80) || "TikTok Video",
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
    downloadMp3Mutation.reset();
    downloadImageMutation.reset();
    searchUrl.value = url;
  }

  async function onDownloadVideo() {
    const url = searchUrl.value.trim();
    const info = videoInfo.value;
    if (!url || !info) return;

    const filename = "tiktok_video.mp4";
    const downloadUrl = `${baseUrl}/api/${PLATFORM}/download?url=${encodeURIComponent(url)}`;

    openProgressModal(filename, [
      { label: "Format", value: "MP4" },
      { label: "Source", value: "TikTok" },
      {
        label: "No watermark",
        value: info.videoUrl ? "Yes" : "Unknown",
        gradient: true,
      },
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

  async function onDownloadMp3() {
    const url = searchUrl.value.trim();
    const info = videoInfo.value;
    if (!url || !info) return;

    const filename = "tiktok_audio.mp3";
    const downloadUrl = `${baseUrl}/api/${PLATFORM}/download-mp3?url=${encodeURIComponent(url)}`;

    openProgressModal(filename, [
      { label: "Format", value: "MP3" },
      { label: "Source", value: "TikTok" },
      { label: "Quality", value: "Audio", gradient: true },
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

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text?.trim()) {
        videoUrl.value = text.trim();
        toast.success("Link berhasil ditempel");
      } else {
        toast.error("Clipboard kosong atau bukan teks");
      }
    } catch {
      toast.error(
        "Akses clipboard ditolak. Izinkan akses atau tempel manual (Ctrl+V)",
      );
    }
  };

  function onCloseClearHistoryDialog() {
    showClearHistoryDialog.value = false;
  }

  function onConfirmClearHistory() {
    clearHistory();
    showClearHistoryDialog.value = false;
    toast.success("Riwayat berhasil dihapus");
  }

  async function handleDownloadVideo() {
    try {
      await onDownloadVideo();
    } catch {
      toast.error("Gagal unduh video");
    }
  }

  async function handleDownloadMp3() {
    try {
      await onDownloadMp3();
    } catch {
      toast.error("Gagal unduh audio");
    }
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
    showClearHistoryDialog,
    onPaste,
    onCloseClearHistoryDialog,
    onConfirmClearHistory,
    handleDownloadVideo,
    handleDownloadMp3,
    closeProgressModal,
    onProgressModalSave,
    onProgressModalDownloadNew,
  };
}
