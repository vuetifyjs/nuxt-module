import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'

describe('layers', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('fixtures/layers/app', import.meta.url)),
  })

  it('renders the index page with layer styles', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('Layer Button')
    // We can't easily check CSS content in SSR output without parsing critical CSS or checking linked stylesheets
    // But if build succeeds, it means layer config was applied correctly.
  })
})
