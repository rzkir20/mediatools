import { ref, computed, onMounted } from "vue";

import { useMutation } from "@tanstack/vue-query";

import { useAppConfig } from "~/lib/config";

const HISTORY_STORAGE_KEY = "convert-doc-history";
const HISTORY_MAX = 30;

export type TargetFormat = "pdf" | "docx";

function loadHistoryFromStorage(): HistoryItemConvert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistoryToStorage(items: HistoryItemConvert[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function useStateConvertDoc() {
  const { apiUrl } = useAppConfig();
  const baseUrl = apiUrl;

  const file = ref<File | null>(null);
  const targetFormat = ref<TargetFormat>("pdf");
  const downloadError = ref("");

  const historyItems = ref<HistoryItemConvert[]>([]);
  const historyReady = ref(false);

  onMounted(() => {
    historyItems.value = loadHistoryFromStorage();
    historyReady.value = true;
  });

  const hasFile = computed(() => !!file.value);

  const convertMutation = useMutation({
    mutationFn: async () => {
      if (!file.value) {
        throw new Error("Pilih file terlebih dahulu");
      }

      const formData = new FormData();
      formData.append("file", file.value);
      formData.append("targetFormat", targetFormat.value);

      const res = await fetch(`${baseUrl}/api/convert/document`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let message = "Konversi dokumen gagal";
        try {
          const data = await res.json();
          message = data.message ?? data.error ?? message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition") || "";
      let filename = "document";
      const m = contentDisposition.match(/filename="?([^";\n]+)"?/i);
      if (m?.[1]) {
        filename = decodeURIComponent(m[1]);
      } else if (file.value?.name) {
        const base = file.value.name.replace(/\.[^.]+$/, "");
        filename = `${base}.${targetFormat.value}`;
      }
      return { blob, filename };
    },
    onSuccess(data) {
      downloadError.value = "";
      triggerBlobDownload(data.blob, data.filename);
      addToHistory(data.filename);
    },
    onError(error: unknown) {
      downloadError.value =
        error instanceof Error ? error.message : String(error);
    },
  });

  const converting = computed(() => convertMutation.isPending.value);

  function addToHistory(downloadedFilename: string) {
    if (!file.value) return;
    const origName = file.value.name;

    const fromExtMatch = origName.match(/\.([^.]+)$/);
    const fromExt = fromExtMatch?.[1]?.toLowerCase() ?? "";
    const toExtMatch = downloadedFilename.match(/\.([^.]+)$/);
    const toExt = toExtMatch?.[1]?.toLowerCase() ?? targetFormat.value;

    const item: HistoryItemConvert = {
      id: `${Date.now()}-${origName.slice(-12).replace(/\W/g, "")}`,
      name: origName,
      fromExt,
      toExt,
      size: file.value.size,
      date: Date.now(),
    };

    const list = [
      item,
      ...historyItems.value.filter((i) => i.name !== origName),
    ].slice(0, HISTORY_MAX);

    historyItems.value = list;
    saveHistoryToStorage(list);
  }

  function clearHistory() {
    historyItems.value = [];
    saveHistoryToStorage([]);
  }

  function triggerBlobDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onFileChange(f: File | null) {
    file.value = f;
    downloadError.value = "";
  }

  function onConvert() {
    if (!file.value) {
      downloadError.value = "Pilih file dokumen terlebih dahulu";
      return;
    }
    downloadError.value = "";
    convertMutation.mutate();
  }

  return {
    file,
    targetFormat,
    hasFile,
    converting,
    downloadError,
    historyItems,
    historyReady,
    clearHistory,
    onFileChange,
    onConvert,
  };
}
