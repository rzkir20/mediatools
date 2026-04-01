/** Opsi bersama untuk fetch metadata sosial: hindari badai request saat fokus tab / remount. */
export const socialMetadataQueryDefaults = {
  staleTime: 1000 * 60 * 60, // 1 jam — data post jarang perlu di-refresh otomatis
  gcTime: 1000 * 60 * 60 * 24,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
} as const;
