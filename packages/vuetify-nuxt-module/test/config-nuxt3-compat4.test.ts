import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'

describe('nuxt3-compat4', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('fixtures/config-nuxt3-compat4', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('Compat 4 Button')
  })
})
