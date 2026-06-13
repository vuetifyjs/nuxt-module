import { describe, expect, it } from 'vitest'
import { buildReloadGuardCookie, hasReloadGuardCookie, RELOAD_GUARD_COOKIE, shouldReloadOnFirstRequest } from '../src/runtime/plugins/first-request-reload-guard'

describe('first-request reload guard', () => {
  it('detects the guard cookie among others', () => {
    expect(hasReloadGuardCookie(`color-scheme=dark; ${RELOAD_GUARD_COOKIE}=1`)).toBe(true)
    expect(hasReloadGuardCookie('color-scheme=dark')).toBe(false)
    expect(hasReloadGuardCookie('')).toBe(false)
    expect(hasReloadGuardCookie(`x-${RELOAD_GUARD_COOKIE}=1`)).toBe(false)
  })

  it('builds a session cookie (no Expires/Max-Age)', () => {
    const c = buildReloadGuardCookie('/')
    expect(c).toContain(`${RELOAD_GUARD_COOKIE}=1`)
    expect(c).toContain('Path=/')
    expect(c).toContain('SameSite=Lax')
    expect(c).not.toMatch(/Expires|Max-Age/i)
    expect(buildReloadGuardCookie('/app')).toContain('Path=/app')
  })

  it('reloads only on a first request when configured and not already reloaded', () => {
    expect(shouldReloadOnFirstRequest(true, true, false)).toBe(true)
    expect(shouldReloadOnFirstRequest(true, true, true)).toBe(false)
    expect(shouldReloadOnFirstRequest(false, true, false)).toBe(false)
    expect(shouldReloadOnFirstRequest(true, false, false)).toBe(false)
  })
})
