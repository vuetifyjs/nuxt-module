import { describe, expect, it } from 'vitest'
import { MIN_NUXT_VERSION_FOR_SSR_CONFIG_HMR, supportsSsrConfigHmr } from '../src/utils/ssr-config-hmr'

describe('supportsSsrConfigHmr', () => {
  it('exposes the documented floor', () => {
    expect(MIN_NUXT_VERSION_FOR_SSR_CONFIG_HMR).toBe('4.3.0')
  })

  it('accepts the validated Nuxt versions (>= 4.3.0)', () => {
    expect(supportsSsrConfigHmr('4.3.1')).toBe(true)
    expect(supportsSsrConfigHmr('4.3.0')).toBe(true)
    expect(supportsSsrConfigHmr('5.0.0')).toBe(true)
    expect(supportsSsrConfigHmr('v4.3.2')).toBe(true)
  })

  it('rejects older Nuxt (restart fallback)', () => {
    expect(supportsSsrConfigHmr('4.2.5')).toBe(false)
    expect(supportsSsrConfigHmr('3.15.0')).toBe(false)
    expect(supportsSsrConfigHmr('4.3.0-rc.1')).toBe(false)
  })

  it('rejects unparseable versions', () => {
    expect(supportsSsrConfigHmr('')).toBe(false)
    expect(supportsSsrConfigHmr('not-a-version')).toBe(false)
  })
})
