import type { Browser } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import {
  $fetch,
  createTest,
  getBrowser,
  setTestContext,
  url,
} from '@nuxt/test-utils/e2e'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

type StylesMode = 'none' | 'configFile'
type RunType = 'dev' | 'build'

const rootDir = fileURLToPath(new URL('../fixtures/styles-ssr', import.meta.url))

const matrix: Array<{ mode: StylesMode, runType: RunType }> = [
  { mode: 'none', runType: 'dev' },
  { mode: 'none', runType: 'build' },
  { mode: 'configFile', runType: 'dev' },
  { mode: 'configFile', runType: 'build' },
]

for (const { mode, runType } of matrix) {
  describe(`styles-ssr — ${mode} / ${runType}`, () => {
    // Note: running multiple @nuxt/test-utils setups in one file shares a
    // single module-level `currentContext` (see setTestContext in
    // @nuxt/test-utils). If we used the `setup()` helper, only the last
    // describe's context would survive to beforeAll, so earlier describes'
    // fixtures/servers would never start. By using `createTest` and wiring
    // vitest hooks ourselves, we can re-bind the context to the correct
    // describe in each beforeAll/afterAll.
    //
    // Also: with `dev: true`, `build` must remain `true` (its default) —
    // @nuxt/test-utils still loads the Nuxt instance via the build code path
    // and dereferences `ctx.nuxt.options.rootDir` when spawning `nuxi _dev`.
    const hooks = createTest({
      rootDir,
      server: true,
      browser: true,
      build: true,
      dev: runType === 'dev',
      env: { STYLES_MODE: mode },
    })

    let prevStylesMode: string | undefined
    beforeAll(async () => {
      // `env` in the setup options only reaches the spawned server process.
      // `loadNuxt` / `buildNuxt` run in-process and read `process.env`
      // directly, so we must set STYLES_MODE before the build runs or the
      // in-process build for `configFile` mode silently falls back to
      // `'none'` (the fixture's default), stripping the Vuetify styles
      // from the static bundle while the runtime config claims otherwise.
      prevStylesMode = process.env.STYLES_MODE
      process.env.STYLES_MODE = mode
      setTestContext(hooks.ctx)
      await hooks.beforeAll()
    }, hooks.ctx.options.setupTimeout)
    beforeEach(() => setTestContext(hooks.ctx))
    afterAll(async () => {
      setTestContext(hooks.ctx)
      await hooks.afterAll()
      setTestContext(undefined)
      if (prevStylesMode === undefined) {
        delete process.env.STYLES_MODE
      } else {
        process.env.STYLES_MODE = prevStylesMode
      }
    }, hooks.ctx.options.teardownTimeout)

    let browser: Browser | undefined

    beforeAll(async () => {
      browser = await getBrowser()
    })

    it('scenario 1 — FOUC: SSR HTML inlines theme variables', async () => {
      const html = await $fetch<string>('/')
      // Vuetify injects CSS variables on the theme class. `--v-theme-surface`
      // must be present in the SSR payload before any JS runs.
      expect(html).toMatch(/--v-theme-surface\s*:/)
      // Vuetify root class is present on SSR.
      expect(html).toContain('v-theme--light')
    })

    it('scenario 2 — hydration: no Vue warnings in console', async () => {
      const pageCtx = await browser!.newContext()
      const p = await pageCtx.newPage()
      const warnings: string[] = []
      p.on('console', msg => {
        const text = msg.text()
        if (/Hydration|mismatch|\[Vue warn\]/.test(text)) {
          warnings.push(text)
        }
      })
      try {
        await p.goto(url('/'), { waitUntil: 'load' })
        expect(warnings, `[${mode}/${runType}] hydration warnings:\n${warnings.join('\n')}`).toEqual([])
      } finally {
        await p.close()
        await pageCtx.close()
      }
    })

    it('scenario 3 — SSR client hints: dark theme applied server-side', async () => {
      const ctx = await browser!.newContext({
        extraHTTPHeaders: { 'Sec-CH-Prefers-Color-Scheme': 'dark' },
      })
      const hintsPage = await ctx.newPage()
      try {
        const response = await hintsPage.goto(url('/'), { waitUntil: 'commit' })
        const body = (await response?.text()) ?? ''
        expect(body).toContain('v-theme--dark')
      } finally {
        await hintsPage.close()
        await ctx.close()
      }
    })

    if (mode === 'configFile') {
      it('scenario 4 — custom SCSS variable: $body-font-family applied', async () => {
        const pageCtx = await browser!.newContext()
        const p = await pageCtx.newPage()
        try {
          await p.goto(url('/'), { waitUntil: 'load' })
          // Wait until stylesheets are actually applied before reading
          // computed styles. Vuetify's CSS-layer rules only take effect
          // after the linked stylesheets finish loading.
          await p.waitForFunction(() => {
            return Array.from(document.styleSheets).some(s => {
              try {
                return s.cssRules.length > 0
              } catch {
                return false
              }
            })
          })
          const font = await p.evaluate(() => {
            return getComputedStyle(
              document.querySelector('#body-font-sample') as HTMLElement,
            ).fontFamily
          })
          expect(font, `[${mode}/${runType}] body font`).toContain('Comic Sans MS')
        } finally {
          await p.close()
          await pageCtx.close()
        }
      })
    }

    if (mode === 'configFile') {
      it('scenario 5 — CSS layers: @layer vuetify-components is declared and populated', async () => {
        // `styles: 'none'` intentionally skips Vuetify's global stylesheet,
        // so only configFile mode is expected to emit `@layer vuetify-*`
        // rules for this fixture.
        const pageCtx = await browser!.newContext()
        const p = await pageCtx.newPage()
        try {
          await p.goto(url('/'), { waitUntil: 'load' })
          // We check both that the layer name appears in the page's loaded
          // CSS text (confirming the build pipeline preserves `@layer`
          // declarations end-to-end) and — when exposed by the browser's
          // CSSOM — that at least one rule is nested inside it. Some
          // bundler-emitted CSS splits the layer block across files; the
          // textual check covers those cases.
          const result = await p.evaluate(async () => {
            const links = Array.from(
              document.querySelectorAll('link[rel=stylesheet]'),
            ) as HTMLLinkElement[]
            const texts = await Promise.all(
              links.map(l =>
                fetch(l.href).then(r => r.text()).catch(() => ''),
              ),
            )
            const inlineStyles = Array.from(
              document.querySelectorAll('style'),
            ).map(s => s.textContent ?? '')
            const allCss = [...texts, ...inlineStyles].join('\n')
            return {
              hasLayerBlock: /@layer\s+vuetify-components\s*\{/.test(allCss),
              hasLayerDecl: /@layer[^;{}]*\bvuetify-components\b/.test(allCss),
            }
          })
          expect(result.hasLayerDecl, `[${mode}/${runType}] @layer vuetify-components declaration`).toBe(true)
          expect(result.hasLayerBlock, `[${mode}/${runType}] @layer vuetify-components block`).toBe(true)
        } finally {
          await p.close()
          await pageCtx.close()
        }
      })
    }

    // Capturing a real regression: in Nuxt dev mode, SSR HTML references
    // `/_nuxt/vuetify-styles/*` virtual URLs that the Vite dev server does not
    // serve, producing 404s on the client. Prod builds are clean because assets
    // become static files. We run the scenario in all four matrix combos so that
    // when the upstream fix lands the `.fails()`-marked cases flip green and
    // prompt us to remove the marker.
    //
    // TODO: once @vuetify/unplugin-styles serves these URLs in Vite dev, drop
    // the `it.fails` marker below.
    const scenario6 = runType === 'dev' ? it.fails : it
    scenario6(`scenario 6 — no 404 responses for any asset during load`, async () => {
      const ctx = await browser!.newContext()
      const p = await ctx.newPage()
      const notFound: string[] = []
      p.on('response', res => {
        if (res.status() === 404) {
          notFound.push(`${res.status()} ${res.url()}`)
        }
      })
      try {
        await p.goto(url('/'), { waitUntil: 'load' })
        // eslint-disable-next-line vitest/no-standalone-expect
        expect(
          notFound,
          `[${mode}/${runType}] unexpected 404 responses:\n${notFound.join('\n')}`,
        ).toEqual([])
      } finally {
        await p.close()
        await ctx.close()
      }
    })
  })
}
