import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'

describe('sass', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('fixtures/sass', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('Hi')
  })

  it('inlines the Vuetify 4 establishing cascade-layer order in the SSR head (#381)', async () => {
    // Pins layer priority before any runtime-injected component <style>, so the
    // `vuetify-core.reset` cannot outrank `.v-btn--size-*`.
    const html = await $fetch('/')
    expect(html).toContain('@layer vuetify-core,vuetify-components,vuetify-overrides,vuetify-utilities,vuetify-final;')
  })
})
