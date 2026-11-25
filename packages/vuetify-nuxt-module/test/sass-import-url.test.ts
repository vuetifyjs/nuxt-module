import { describe, expect, it } from 'vitest'
import { getTemplate, toSassImportUrl } from '../src/utils/configure-nuxt'

const isWindows = process.platform === 'win32'

describe('toSassImportUrl (#396)', () => {
  it.runIf(isWindows)('turns a Windows drive path into a file URL', () => {
    expect(toSassImportUrl(String.raw`C:\Users\u\my app\settings.scss`))
      .toBe('file:///C:/Users/u/my%20app/settings.scss')
  })

  it.skipIf(isWindows)('turns a POSIX absolute path into a file URL', () => {
    expect(toSassImportUrl('/home/u/my app/settings.scss'))
      .toBe('file:///home/u/my%20app/settings.scss')
  })

  it.skipIf(isWindows)('escapes characters that would break the quoted @use', () => {
    const url = toSassImportUrl(`/home/u/O'Brien/a#b?c/settings.scss`)
    expect(url).toBe('file:///home/u/O%27Brien/a%23b%3Fc/settings.scss')
  })

  it('leaves relative paths and package specifiers alone', () => {
    expect(toSassImportUrl('vuetify/styles')).toBe('vuetify/styles')
    expect(toSassImportUrl(`./O'Brien/settings.scss`)).toBe('./O%27Brien/settings.scss')
  })

  it('does not wrap an existing file URL', () => {
    expect(toSassImportUrl('file:///C:/x/settings.scss')).toBe('file:///C:/x/settings.scss')
  })
})

describe('getTemplate', () => {
  it.skipIf(isWindows)('uses the settings file URL before the package specifier', () => {
    expect(getTemplate('vuetify/styles', '/home/u/app/settings.scss'))
      .toBe(`@use 'file:///home/u/app/settings.scss';\n@use 'vuetify/styles';`)
  })

  it('omits the settings @use when there is none', () => {
    expect(getTemplate('vuetify/styles', null)).toBe(`@use 'vuetify/styles';`)
  })
})
