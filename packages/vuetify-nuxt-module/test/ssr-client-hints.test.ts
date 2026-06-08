import type { VuetifyNuxtContext } from '../src/utils/config'
import { describe, expect, it, vi } from 'vitest'
import { prepareSSRClientHints } from '../src/utils/ssr-client-hints'

function createCtx (prefersColorSchemeOptions: any) {
  const warn = vi.fn()
  const ctx = {
    isSSR: true,
    isNuxtGenerate: false,
    logger: { warn },
    moduleOptions: {
      ssrClientHints: {
        prefersColorScheme: true,
        prefersColorSchemeOptions,
      },
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: { light: {}, dark: {} },
      },
    },
  } as unknown as VuetifyNuxtContext
  return { ctx, warn }
}

describe('prepareSSRClientHints cookie normalisation', () => {
  it('uses cookie.* fields when provided', () => {
    const { ctx, warn } = createCtx({
      cookie: { name: 'cs', domain: '.example.com', secure: true, sameSite: 'strict' },
    })
    const opts = prepareSSRClientHints('/', ctx).prefersColorSchemeOptions
    expect(opts?.cookieName).toBe('cs')
    expect(opts?.cookieDomain).toBe('.example.com')
    expect(opts?.cookieSecure).toBe(true)
    expect(opts?.cookieSameSite).toBe('strict')
    expect(warn).not.toHaveBeenCalled()
  })

  it('maps the deprecated cookieName and warns once', () => {
    const { ctx, warn } = createCtx({ cookieName: 'legacy' })
    const opts = prepareSSRClientHints('/', ctx).prefersColorSchemeOptions
    expect(opts?.cookieName).toBe('legacy')
    expect(opts?.cookieSameSite).toBe('lax')
    expect(opts?.cookieDomain).toBeUndefined()
    expect(opts?.cookieSecure).toBeUndefined()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('prefers cookie.name over the deprecated cookieName', () => {
    const { ctx, warn } = createCtx({ cookieName: 'legacy', cookie: { name: 'newname' } })
    const opts = prepareSSRClientHints('/', ctx).prefersColorSchemeOptions
    expect(opts?.cookieName).toBe('newname')
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('applies defaults when nothing is set', () => {
    const { ctx, warn } = createCtx({})
    const opts = prepareSSRClientHints('/', ctx).prefersColorSchemeOptions
    expect(opts?.cookieName).toBe('color-scheme')
    expect(opts?.cookieSameSite).toBe('lax')
    expect(opts?.cookieDomain).toBeUndefined()
    expect(opts?.cookieSecure).toBeUndefined()
    expect(warn).not.toHaveBeenCalled()
  })

  it('forces secure when sameSite is none', () => {
    const { ctx } = createCtx({ cookie: { sameSite: 'none', secure: false } })
    const opts = prepareSSRClientHints('/', ctx).prefersColorSchemeOptions
    expect(opts?.cookieSameSite).toBe('none')
    expect(opts?.cookieSecure).toBe(true)
  })
})
