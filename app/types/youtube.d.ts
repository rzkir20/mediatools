interface YoutubeFormat {
  itag: number;
  qualityLabel: string | null;
  mimeType: string | null;
  isAudioOnly: boolean;
}

interface YoutubeMetadataResponse {
  id?: string | null;
  title?: string | null;
  duration?: string | null;
  durationSeconds?: number | null;
  thumbnail?: string | null;
  formats?: YoutubeFormat[] | null;
}
