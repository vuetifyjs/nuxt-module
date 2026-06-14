import semver from 'semver'

/**
 * Lowest Nuxt version whose `@nuxt/vite-builder` hot-updates SSR-consumed
 * virtual modules in dev. Our fix relies on: the vite-node `invalidates` set
 * fed by the file watcher + the runner's importer-cascade eviction
 * (`useInvalidates`/`markInvalidate`/`invalidateDepTree`), SSR served through
 * `environments.ssr.fetchModule`, and the Vite Environment API for the
 * `this.environment.name === 'ssr'` plugin gate. All of these are present in
 * `@nuxt/vite-builder` since 4.0.0 (every Nuxt 4.x requires Vite 7), verified
 * by inspecting the published 4.0.0–4.3.1 dists and confirmed end-to-end on the
 * `apps/playground` SSR app running Nuxt 4.0.0 (config edit hot-reloaded, no
 * dev-server restart). Below 4.0 (Nuxt 3) we fall back to `callHook('restart')`.
 */
export const MIN_NUXT_VERSION_FOR_SSR_CONFIG_HMR = '4.0.0'

/**
 * Whether the installed Nuxt can hot-update SSR-consumed virtual config
 * modules without a dev-server restart.
 */
export function supportsSsrConfigHmr (nuxtVersion: string): boolean {
  // Prefer an exact parse (keeps prerelease semantics: 4.3.0-rc.1 < 4.3.0).
  const parsed = semver.parse(nuxtVersion) ?? semver.coerce(nuxtVersion)
  if (!parsed) {
    return false
  }
  return semver.gte(parsed.version, MIN_NUXT_VERSION_FOR_SSR_CONFIG_HMR)
}
