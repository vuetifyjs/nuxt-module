import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'

describe('string date adapter', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('fixtures/string-date-adapter', import.meta.url)),
  })

  it('uses the built-in string adapter from Nuxt configuration', async () => {
    const html = await $fetch('/')
    expect(html).toContain('data-date-type="string"')
    expect(html).toContain('>2026-08-22</p>')
  })
})
