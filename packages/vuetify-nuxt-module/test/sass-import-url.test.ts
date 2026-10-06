import { describe, expect, it } from 'vitest'
import { getTemplate, toSassImportUrl } from '../src/utils/configure-nuxt'

/*
 * `@use` arguments are URLs to Dart Sass, so a bare Windows path is read as the scheme `c:` and
 * never reaches the filesystem importer — `Can't find stylesheet to import` (#396).
 *
 * Absolute-vs-relative is decided by `pathe.isAbsolute`, not `node:path.isAbsolute`, so a Windows
 * drive path is recognised as absolute on every platform. That is what lets this suite exercise the
 * Windows branch on a POSIX CI instead of skipping it (and what makes the test pass there at all).
 *
 * The assertions are about "is this a `file:` URL" rather than one exact encoding: `pathToFileURL`
 * follows the HOST platform, so pinning its byte-for-byte output would make the suite pass on
 * Windows and assert a different thing everywhere else. What must not regress is that a path which
 * needs to become a URL does, that the drive letter survives, and that the ones which must not are
 * left alone.
 */

describe('toSassImportUrl', () => {
  it('turns a Windows drive path into a file URL', () => {
    // The case #396 is about: this is what used to be emitted bare. Runs on every platform now —
    // `pathe.isAbsolute` does not consult the host, so the Windows branch is reachable from POSIX CI.
    const url = toSassImportUrl('C:\\Users\\u\\app\\settings.scss')
    expect(url.startsWith('file:///')).toBe(true)
    expect(url).not.toBe('C:\\Users\\u\\app\\settings.scss')
    // Guard the two failure modes a bare `startsWith` would miss: a dropped drive letter, and
    // backslashes surviving into the URL as separators.
    expect(url).toContain('C:')
    expect(url).not.toContain('\\')
  })

  it('turns a POSIX absolute path into a file URL too', () => {
    // Output changed here even though the reported bug did not reach POSIX. Same vocabulary as
    // upstream `@vuetify/unplugin-styles`, which URL-ises both its `sassPath` and its `configFile`.
    const url = toSassImportUrl('/home/u/app/settings.scss')
    expect(url.startsWith('file:///')).toBe(true)
    expect(url).not.toBe('/home/u/app/settings.scss')
  })

  it('leaves a relative path alone', () => {
    // `resolvePath` guarantees an absolute path at the call site, so this is about not inventing a
    // URL for something that is not one — `./settings.scss` has no directory to be absolute against.
    expect(toSassImportUrl('./settings.scss')).toBe('./settings.scss')
    expect(toSassImportUrl('vuetify/styles')).toBe('vuetify/styles')
  })

  it('encodes an apostrophe in a relative path too', () => {
    // The encoding must not depend on the path being absolute: this is an exported pure transform,
    // and `getTemplate` wraps whatever comes back in single quotes.
    expect(toSassImportUrl("./O'Brien/settings.scss")).toBe('./O%27Brien/settings.scss')
  })

  it('does not wrap an input that is already a file URL', () => {
    // Neither platform calls this absolute, so it cannot become `file:///file:///C:/x`.
    expect(toSassImportUrl('file:///C:/x/settings.scss')).toBe('file:///C:/x/settings.scss')
  })

  it('encodes a path that would otherwise break the quoted @use', () => {
    // `@use '<url>';` is single-quoted, so a raw apostrophe in the path would end the string early.
    const url = toSassImportUrl("/home/u/O'Brien/settings.scss")
    expect(url).toContain('O%27Brien')
    expect(url).not.toContain("'")
  })

  it('encodes a non-ASCII path rather than emitting raw characters', () => {
    // Not hypothetical: this repository has been checked out under a Chinese home directory.
    const url = toSassImportUrl('/home/u/胡竞初/settings.scss')
    expect(url).not.toContain('胡')
    expect(decodeURIComponent(url)).toContain('胡竞初')
  })

  it('encodes the characters that would truncate a URL', () => {
    // A `#` would start a fragment and a `?` a query; both must survive as path characters.
    const url = toSassImportUrl('/home/u/a#b?c/settings.scss')
    expect(url).toContain('%23')
    expect(url).toContain('%3F')
  })
})

describe('getTemplate', () => {
  it('writes the settings as a @use whose target Sass can resolve', () => {
    const template = getTemplate('vuetify/styles', '/home/u/app/settings.scss')
    expect(template.startsWith("@use 'file:///")).toBe(true)
    expect(template.endsWith("';\n@use 'vuetify/styles';")).toBe(true)
  })

  it('leaves the package specifier bare, because the bundler resolves it', () => {
    // `source` is the literal `vuetify/styles` at every call site, never a file path — URL-ising it
    // would take it away from Vite's own package resolution.
    expect(getTemplate('vuetify/styles', null)).toBe("@use 'vuetify/styles';")
  })
})
