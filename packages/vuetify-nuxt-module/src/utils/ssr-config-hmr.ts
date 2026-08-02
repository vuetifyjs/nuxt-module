import { isGreaterOrEqual, tryParse } from 'verkit'

/**
 * Lowest Nuxt with the Vite 7 + vite-node SSR invalidation our HMR relies on
 * (3.18.0 on 3.x, 4.0.0 on 4.x; Nuxt 3.15–3.17 are Vite 6). Below this we fall
 * back to `callHook('restart')`. Verified on apps/playground at 3.21.8 and 4.0.0.
 */
export const MIN_NUXT_VERSION_FOR_SSR_CONFIG_HMR = '3.18.0'

/**
 * Whether the installed Nuxt can hot-update SSR-consumed virtual config
 * modules without a dev-server restart.
 */
export function supportsSsrConfigHmr (nuxtVersion: string): boolean {
  // Prefer an exact parse (keeps prerelease semantics: 4.3.0-rc.1 < 4.3.0).
  // `tryParse` returns null on unparseable input; `parse` would throw.
  const parsed = tryParse(nuxtVersion)
  if (!parsed) {
    return false
  }
  return isGreaterOrEqual(parsed, MIN_NUXT_VERSION_FOR_SSR_CONFIG_HMR)
}
