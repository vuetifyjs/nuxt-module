import { describe, expect, it } from 'vitest'
import { MIN_NUXT_VERSION_FOR_SSR_CONFIG_HMR, supportsSsrConfigHmr } from '../src/utils/ssr-config-hmr'

describe('supportsSsrConfigHmr', () => {
  it('exposes the documented floor', () => {
    expect(MIN_NUXT_VERSION_FOR_SSR_CONFIG_HMR).toBe('3.18.0')
  })

  it('accepts Nuxt 3.18+ and all Nuxt 4 (the Vite 7 + env-API mechanism)', () => {
    expect(supportsSsrConfigHmr('3.18.0')).toBe(true)
    expect(supportsSsrConfigHmr('3.21.8')).toBe(true)
    expect(supportsSsrConfigHmr('4.0.0')).toBe(true)
    expect(supportsSsrConfigHmr('4.3.1')).toBe(true)
    expect(supportsSsrConfigHmr('5.0.0')).toBe(true)
    expect(supportsSsrConfigHmr('v4.3.2')).toBe(true)
  })

  it('rejects Nuxt 3.15-3.17 and older (Vite 6, restart fallback)', () => {
    expect(supportsSsrConfigHmr('3.17.9')).toBe(false)
    expect(supportsSsrConfigHmr('3.15.0')).toBe(false)
    expect(supportsSsrConfigHmr('3.18.0-rc.1')).toBe(false)
  })

  it('rejects unparseable versions', () => {
    expect(supportsSsrConfigHmr('')).toBe(false)
    expect(supportsSsrConfigHmr('not-a-version')).toBe(false)
  })
})
