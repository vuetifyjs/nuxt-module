import semver from 'semver'

/**
 * Lowest Nuxt version whose `@nuxt/vite-builder` hot-updates SSR-consumed
 * virtual modules in dev. Our fix relies on: the vite-node `invalidates` set
 * fed by the file watcher + the runner's importer-cascade eviction
 * (`useInvalidates`/`markInvalidate`/`invalidateDepTree`) and the Vite
 * Environment API for the `this.environment.name === 'ssr'` plugin gate. Those
 * pieces (and Vite 7) landed together in `@nuxt/vite-builder` 3.18.0 on the 3.x
 * line and 4.0.0 on the 4.x line — Nuxt 3.15–3.17 ship Vite 6 with the older
 * mechanism (no `environment.name` gate) and don't qualify. Established by
 * inspecting the published 3.15–4.3 dists and confirmed end-to-end on the
 * `apps/playground` SSR app at both Nuxt 3.21.8 and 4.0.0 (config edit
 * hot-reloaded, no dev-server restart; the pre-fix build stayed stale, proving
 * the control). Below 3.18 we fall back to `callHook('restart')`.
 */
export const MIN_NUXT_VERSION_FOR_SSR_CONFIG_HMR = '3.18.0'

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
