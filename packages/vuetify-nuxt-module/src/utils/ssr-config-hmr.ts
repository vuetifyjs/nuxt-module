import semver from 'semver'

/**
 * Lowest Nuxt version whose `@nuxt/vite-builder` hot-updates SSR-consumed
 * virtual modules in dev: the vite-node `invalidates` set is fed by the file
 * watcher + module-graph association, evicting our virtual modules (and their
 * SSR importers) from the runner cache without a full restart. Below this, a
 * config-file change under SSR cannot reach the SSR runner cache, so we fall
 * back to `nuxt.callHook('restart')`.
 *
 * Validated against Nuxt 4.3.1 (e2e + the `apps/playground` smoke test). The
 * `4.3.0` floor is a conservative inference, not empirically tested below
 * 4.3.1; lower it only with verification. Below the floor the safe restart
 * fallback applies, so an over-tight floor never breaks — it only forgoes the
 * fast path.
 */
export const MIN_NUXT_VERSION_FOR_SSR_CONFIG_HMR = '4.3.0'

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
