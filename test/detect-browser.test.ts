import { describe, expect, it } from 'vitest'
import { parseUserAgent } from '../src/runtime/plugins/detect-browser'

// Tests for Browser compatibility
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Reduced-Motion#browser_compatibility
describe('Browser Detection Tests', () => {
  it('Chrome Windows 10: latest', () => {
    const browser = parseUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    )
    expect(browser).not.toBe(null)
    expect(browser?.name).toBe('chrome')
    const versions = browser?.version?.split('.')
    expect(versions?.length).toBe(3)
    expect(Number.parseInt(versions![0]) >= 108).toBe(true)
    expect(browser?.os?.toLowerCase().startsWith('windows')).toBe(true)
  })
  it('Edge Windows 10: latest', () => {
    const browser = parseUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.31',
    )
    expect(browser).not.toBe(null)
    expect(browser?.name).toBe('edge-chromium')
    const versions = browser?.version?.split('.')
    expect(versions?.length).toBe(3)
    expect(Number.parseInt(versions![0]) >= 108).toBe(true)
    expect(browser?.os?.toLowerCase().startsWith('windows')).toBe(true)
  })
  it('Chromium Windows 10: version 108.0.5332.0', () => {
    const browser = parseUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    )
    expect(browser).not.toBe(null)
    expect(browser?.name).toBe('chrome')
    const versions = browser?.version?.split('.')
    expect(versions?.length).toBe(3)
    expect(Number.parseInt(versions![0]) >= 108).toBe(true)
    expect(browser?.os?.toLowerCase().startsWith('windows')).toBe(true)
  })
  it('Samsung Android: Android 13', () => {
    const browser = parseUserAgent(
      'Mozilla/5.0 (Linux; Android 13) SAMSUNG SM-S908B AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/22.0 Chrome/111.0.5563.116 Mobile Safari/537.36',
    )
    expect(browser).not.toBe(null)
    expect(browser?.name).toBe('samsung')
    const versions = browser?.version?.split('.')
    expect(versions?.length).toBe(3)
    expect(Number.parseInt(versions![0]) >= 21).toBe(true)
    expect(browser?.os?.toLowerCase().startsWith('android')).toBe(true)
  })
  it('Opera Windows', () => {
    const browser = parseUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 OPR/102.0.0.0',
    )
    expect(browser).not.toBe(null)
    expect(browser?.name).toBe('opera')
    const versions = browser?.version?.split('.')
    expect(versions?.length).toBe(3)
    expect(Number.parseInt(versions![0]) >= 94).toBe(true)
    expect(browser?.os?.toLowerCase().startsWith('windows')).toBe(true)
  })
  it('Opera macOS', () => {
    const browser = parseUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 OPR/102.0.0.0',
    )
    expect(browser).not.toBe(null)
    expect(browser?.name).toBe('opera')
    const versions = browser?.version?.split('.')
    expect(versions?.length).toBe(3)
    expect(Number.parseInt(versions![0]) >= 94).toBe(true)
    expect(browser?.os?.toLowerCase().startsWith('mac')).toBe(true)
  })
  it('Opera Linux', () => {
    const browser = parseUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 OPR/102.0.0.0',
    )
    expect(browser).not.toBe(null)
    expect(browser?.name).toBe('opera')
    const versions = browser?.version?.split('.')
    expect(versions?.length).toBe(3)
    expect(Number.parseInt(versions![0]) >= 94).toBe(true)
    expect(browser?.os?.toLowerCase().startsWith('linux')).toBe(true)
  })
  it('Opera Android', () => {
    const browser = parseUserAgent(
      'Mozilla/5.0 (Linux; Android 10; VOG-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.60 Mobile Safari/537.36 OPR/73.3.3216.58675',
    )
    expect(browser).not.toBe(null)
    expect(browser?.name).toBe('opera')
    const versions = browser?.version?.split('.')
    expect(versions?.length).toBe(3)
    expect(Number.parseInt(versions![0]) >= 73).toBe(true)
    expect(browser?.os?.toLowerCase().startsWith('android')).toBe(true)
  })
})
