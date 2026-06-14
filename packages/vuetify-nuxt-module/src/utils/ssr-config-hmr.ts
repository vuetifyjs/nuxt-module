import semver from 'semver'

/**
 * Lowest Nuxt version whose `@nuxt/vite-builder` can hot-update SSR-consumed
 * virtual modules in dev (vite-node `invalidates` cascade + the Vite 7
 * Environment API our `this.environment.name === 'ssr'` gate needs). These
 * landed in 3.18.0 (3.x line) and 4.0.0 (4.x line); Nuxt 3.15–3.17 are Vite 6
 * and don't qualify. Verified on `apps/playground` at Nuxt 3.21.8 and 4.0.0.
 * Below 3.18 we fall back to `callHook('restart')`.
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
