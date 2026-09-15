import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'

describe('ssr with vuetify 3', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('fixtures/basic-vuetify3', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).contain('v-application')
  })

  it('does not inline the Vuetify 4 cascade-layer order (#381 — v3 layers differ and are opt-in)', async () => {
    const html = await $fetch('/')
    expect(html).not.toContain('@layer vuetify-core')
  })
})
