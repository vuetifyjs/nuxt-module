/**
 * Session cookie marking that the one-time `reloadOnFirstRequest` reload has
 * already happened this browser session. Prevents an infinite reload loop when
 * a browser requests client hints but never delivers them (e.g. Brave Shields
 * strip `Sec-CH-*`), since `firstRequest` would otherwise stay `true` forever (#334).
 */
export const RELOAD_GUARD_COOKIE = 'vuetify-nuxt-client-hints-reloaded'

/** True when the guard cookie is present in a `document.cookie` string. */
export function hasReloadGuardCookie (cookie: string): boolean {
  const prefix = `${RELOAD_GUARD_COOKIE}=`
  return cookie.split(';').some(c => c.trim().startsWith(prefix))
}

/** Build a session guard cookie (no expiry → cleared on browser close). */
export function buildReloadGuardCookie (path: string): string {
  return `${RELOAD_GUARD_COOKIE}=1; Path=${path}; SameSite=Lax`
}

/** Whether to perform the first-request reload: only once per session. */
export function shouldReloadOnFirstRequest (
  firstRequest: boolean,
  reloadOnFirstRequest: boolean,
  alreadyReloaded: boolean,
): boolean {
  return firstRequest && reloadOnFirstRequest && !alreadyReloaded
}
