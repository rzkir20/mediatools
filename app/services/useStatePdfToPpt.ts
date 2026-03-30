import { ref, computed } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { useAppConfig } from "~/lib/config";

export function useStatePdfToPpt() {
  const { apiUrl } = useAppConfig();
  const baseUrl = apiUrl;

  const file = ref<File | null>(null);
  const downloadError = ref("");

  const hasFile = computed(() => !!file.value);

  const convertMutation = useMutation({
    mutationFn: async () => {
      if (!file.value) {
        throw new Error("Pilih file terlebih dahulu");
      }

      const formData = new FormData();
      formData.append("file", file.value);

      const res = await fetch(`${baseUrl}/api/convert/pdf-to-ppt`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let message = "Konversi PDF ke PPT gagal";
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
      let filename = "presentation.pptx";
      const m = contentDisposition.match(/filename="?([^";\n]+)"?/i);
      if (m?.[1]) {
        filename = decodeURIComponent(m[1]);
      } else if (file.value?.name) {
        const base = file.value.name.replace(/\.[^.]+$/, "");
        filename = `${base}.pptx`;
      }

      return { blob, filename };
    },
    onSuccess(data) {
      downloadError.value = "";
      triggerBlobDownload(data.blob, data.filename);
    },
    onError(error: unknown) {
      downloadError.value =
        error instanceof Error ? error.message : String(error);
    },
  });

  const converting = computed(() => convertMutation.isPending.value);

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
      downloadError.value = "Pilih file PDF terlebih dahulu";
      return;
    }
    downloadError.value = "";
    convertMutation.mutate();
  }

  return {
    file,
    hasFile,
    converting,
    downloadError,
    onFileChange,
    onConvert,
  };
}

