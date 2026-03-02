import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'

describe('vuetify-config', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('fixtures/vuetify-config', import.meta.url)),
  })

  it('loads vuetify.config.ts and applies configuration', async () => {
    const html = await $fetch('/')
    // Check if the alias MyBtn was resolved to VBtn (which renders with class v-btn)
    expect(html).toContain('v-btn')
    expect(html).toContain('my-btn')
  })
})
