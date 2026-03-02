import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'

describe('vuetify-config-disabled', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('fixtures/vuetify-config-disabled', import.meta.url)),
  })

  it('ignores configuration when config: false is set', async () => {
    const html = await $fetch('/')
    // MyBtn should not be resolved to v-btn
    expect(html).not.toContain('v-btn--size-default') // standard v-btn class
    expect(html).toContain('<MyBtn')
  })
})
