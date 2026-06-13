import type { InlineModuleOptions } from '../src/types'
import { describe, expect, it } from 'vitest'
import { finalizeConfiguration, MODULE_DEFAULTS } from '../src/utils/layers'

const app = (o: Partial<InlineModuleOptions>): InlineModuleOptions => ({ moduleOptions: {}, vuetifyOptions: {}, ...o })

describe('finalizeConfiguration', () => {
  it('applies module defaults when nothing overrides them', () => {
    const c = finalizeConfiguration([app({})])
    expect(c.moduleOptions!.styles).toBe(true)
    expect(c.moduleOptions!.importComposables).toBe(true)
    expect(c.vuetifyOptions!.directives).toBe(false)
    expect(c.vuetifyOptions!.labComponents).toBe(false)
  })

  it('lets a hook/layer override a defaulted moduleOptions field (#290)', () => {
    const c = finalizeConfiguration([
      app({ moduleOptions: {} }),
      { moduleOptions: { styles: 'none' }, vuetifyOptions: {} },
    ])
    expect(c.moduleOptions!.styles).toBe('none')
  })

  it('keeps the app explicit value above hooks/layers (#231)', () => {
    const c = finalizeConfiguration([
      app({ moduleOptions: { styles: false } }),
      { moduleOptions: { styles: 'none' }, vuetifyOptions: {} },
    ])
    expect(c.moduleOptions!.styles).toBe(false)
  })

  it('orders hooks above layers (existing push order)', () => {
    const c = finalizeConfiguration([
      app({ moduleOptions: {} }),
      { moduleOptions: { styles: 'none' }, vuetifyOptions: {} },
      { moduleOptions: { styles: false }, vuetifyOptions: {} },
    ])
    expect(c.moduleOptions!.styles).toBe('none')
  })

  it('lets a hook override a defaulted vuetifyOptions field', () => {
    const c = finalizeConfiguration([
      app({ vuetifyOptions: {} }),
      { moduleOptions: {}, vuetifyOptions: { directives: true } },
    ])
    expect(c.vuetifyOptions!.directives).toBe(true)
  })

  it('dedupes icons sets across entries (#214/#217)', () => {
    const c = finalizeConfiguration([
      app({ vuetifyOptions: { icons: { defaultSet: 'mdi', sets: [{ name: 'mdi' }] } } as any }),
      { moduleOptions: {}, vuetifyOptions: { icons: { sets: [{ name: 'fa' }] } } as any },
    ])
    const names = (c.vuetifyOptions!.icons!.sets as Array<{ name: string }>).map(s => s.name).toSorted()
    expect(names).toEqual(['fa', 'mdi'])
  })

  it('MODULE_DEFAULTS does not leak icons (dedupe only sees app+rest)', () => {
    expect((MODULE_DEFAULTS.vuetifyOptions as any)?.icons).toBeUndefined()
  })

  it('lets a layer (not just a hook) override a defaulted moduleOptions field (#290)', () => {
    const c = finalizeConfiguration([
      app({ moduleOptions: {} }), // app — no explicit styles
      { moduleOptions: {}, vuetifyOptions: {} }, // hook — no styles
      { moduleOptions: { styles: 'none' }, vuetifyOptions: {} }, // layer — overrides default
    ])
    expect(c.moduleOptions!.styles).toBe('none')
  })

  it('deep-merges rulesConfiguration: a hook provides configFile, default fills fromLabs (#290)', () => {
    const c = finalizeConfiguration([
      app({ moduleOptions: {} }),
      { moduleOptions: { rulesConfiguration: { configFile: 'my-rules.ts' } }, vuetifyOptions: {} },
    ])
    expect(c.moduleOptions!.rulesConfiguration).toEqual({ configFile: 'my-rules.ts', fromLabs: true })
  })
})
