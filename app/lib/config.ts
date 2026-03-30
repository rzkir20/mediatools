export const DEFAULT_API_URL = process.env.NUXT_PUBLIC_API_URL;

/**
 * Dulu: menambahkan api_secret ke URL untuk akses backend dari browser.
 * Sekarang: tidak lagi memakai secret di sisi client supaya tidak terekspos.
 */
export function withApiSecret(url: string): string {
  return url;
}

export function useAppConfig() {
  const config = useRuntimeConfig();
  const apiUrl =
    (config.public.apiUrl as string)?.trim() || DEFAULT_API_URL || "";

  return { apiUrl };
}
