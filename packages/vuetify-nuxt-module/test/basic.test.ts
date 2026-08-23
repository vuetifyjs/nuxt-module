import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { $fetch, setup, useTestContext } from '@nuxt/test-utils'
import { join } from 'pathe'
import { describe, expect, it } from 'vitest'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).contain('v-application')
  })

  it('leaves Nuxt\'s built-in useLayout in place and prefixes Vuetify\'s (#384)', () => {
    const buildDir = useTestContext().nuxt!.options.buildDir
    const declarations = readFileSync(join(buildDir, 'types/imports.d.ts'), 'utf8')

    // Vuetify's must be renamed...
    expect(declarations).toContain('const useVLayout:')
    // ...and must not have claimed the bare name.
    expect(declarations).not.toMatch(/const useLayout: typeof import\('[^']*vuetify'\)/)
    // Nuxt's must survive. Generated declarations use a relative path into
    // nuxt's dist, so match on the tail rather than on the `#app` alias.
    expect(declarations).toMatch(/const useLayout: typeof import\('[^']*app\/composables\/layout'\)/)
  })
})
