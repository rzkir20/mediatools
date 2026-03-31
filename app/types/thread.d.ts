interface ThreadApiMediaItem {
  type: "image" | "video";
  url: string;
}

interface ThreadMetadataResponse {
  url?: string;
  caption?: string | null;
  videoUrl?: string | null;
  images?: string[] | null;
  mediaItems?: ThreadApiMediaItem[] | null;
}
