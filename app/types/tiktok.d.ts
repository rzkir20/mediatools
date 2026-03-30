type QualityOption = { label: string; url: string };

type FormatOption = { index: number; label: string };

type VideoInfo = {
  videoUrl?: string;
  videoUrlHd?: string;
  qualities?: QualityOption[];
  formatOptions?: FormatOption[];
  previewVideoUrl?: string;
  audioUrl?: string;
  images?: string[];
  cover?: string;
  previewImageUrls?: string[];
  text?: string;
  author?: string;
  duration?: string;
  durationMs?: number;
  id?: string;
};

interface TiktokMetadataResponse {
  videoUrl?: string;
  videoUrlNoWaterMark?: string;
  audioUrl?: string;
  images?: string[] | null;
  cover?: string;
  text?: string;
  author?: string;
}
