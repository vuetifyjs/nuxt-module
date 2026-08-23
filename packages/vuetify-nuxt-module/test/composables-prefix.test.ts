import type { Nuxt } from '@nuxt/schema'
import { describe, expect, it } from 'vitest'
import { collectPresetNames, registerComposableImports, resolveComposableImports } from '../src/utils/composables'

// Every other call below goes through `as any`. This one exercises the real,
// uncast `readonly ImportPreset[]` signature so a bad type breaks the build.
void collectPresetNames([{ from: '#app/composables/router', imports: ['useRoute'] }])

describe('collectPresetNames', () => {
  it('collects names from framework-owned sources', () => {
    expect(collectPresetNames([
      { from: '#app/composables/layout', imports: ['useLayout'] },
      { from: '#app/composables/router', imports: ['useRoute', 'useRouter'] },
      { from: '#build/fetch.mjs', imports: ['$fetch'] },
      { from: 'vue', imports: ['ref', 'computed'] },
      { from: 'vue-demi', imports: ['isVue3'] },
    ] as any)).toEqual(new Set(['useLayout', 'useRoute', 'useRouter', '$fetch', 'ref', 'computed', 'isVue3']))
  })

  it('ignores third-party sources', () => {
    expect(collectPresetNames([
      { from: '/abs/node_modules/@nuxtjs/i18n/dist/runtime/composables/index', imports: ['useLocalePath'] },
      { from: 'some-module/runtime', imports: ['useTheme'] },
    ] as any).size).toBe(0)
  })

  it('handles string, tuple and object entry forms', () => {
    expect(collectPresetNames([
      {
        from: '#app/x',
        imports: ['aName', ['bName', 'bAlias'], { name: 'cName' }, { name: 'dName', as: 'dAlias' }],
      },
    ] as any)).toEqual(new Set(['aName', 'bAlias', 'cName', 'dAlias']))
  })

  it('honours a per-entry source override in tuple form', () => {
    expect(collectPresetNames([
      { from: '#app/x', imports: [['thirdParty', undefined, 'other-module/runtime']] },
      { from: 'other-module/runtime', imports: [['framework', undefined, '#app/y']] },
    ] as any)).toEqual(new Set(['framework']))
  })

  it('recurses into nested presets', () => {
    expect(collectPresetNames([
      { from: '#app/outer', imports: ['outer', { from: '#app/inner', imports: ['inner'] }] },
    ] as any)).toEqual(new Set(['outer', 'inner']))
  })

  it('skips package presets and malformed entries', () => {
    expect(collectPresetNames([
      { package: 'vue' },
      { from: '#app/x' },
      { from: '#app/y', imports: [null, undefined, 42] },
    ] as any).size).toBe(0)
  })

  it('does not let a nested preset inherit the parent source', () => {
    // unimport resolves a nested preset on its own; it does not inherit `from`.
    expect(collectPresetNames([
      { from: '#app/outer', imports: ['outer', { imports: ['orphan'] }] },
    ] as any)).toEqual(new Set(['outer']))
  })

  it('falls back to the name when a tuple alias is empty', () => {
    // unimport uses `_import[1] || _import[0]`, so an empty alias is not a name.
    expect(collectPresetNames([
      { from: '#app/x', imports: [['realName', '']] },
    ] as any)).toEqual(new Set(['realName']))
  })
})

describe('resolveComposableImports', () => {
  const composables = ['useDate', 'useLayout', 'useTheme']
  const reserved = new Set(['useLayout', 'useRoute'])

  it('prefixes only colliding names under \'auto\'', () => {
    expect(resolveComposableImports({ composables, reserved, prefix: 'auto' })).toEqual([
      { name: 'useDate' },
      { name: 'useLayout', as: 'useVLayout' },
      { name: 'useTheme' },
    ])
  })

  it('prefixes nothing under \'auto\' when no name is reserved', () => {
    expect(resolveComposableImports({ composables, reserved: new Set(), prefix: 'auto' })).toEqual([
      { name: 'useDate' },
      { name: 'useLayout' },
      { name: 'useTheme' },
    ])
  })

  it('treats undefined as \'auto\'', () => {
    expect(resolveComposableImports({ composables, reserved, prefix: undefined })).toEqual([
      { name: 'useDate' },
      { name: 'useLayout', as: 'useVLayout' },
      { name: 'useTheme' },
    ])
  })

  it('prefixes everything when true', () => {
    expect(resolveComposableImports({ composables, reserved, prefix: true })).toEqual([
      { name: 'useDate', as: 'useVDate' },
      { name: 'useLayout', as: 'useVLayout' },
      { name: 'useTheme', as: 'useVTheme' },
    ])
  })

  it('prefixes nothing when false', () => {
    expect(resolveComposableImports({ composables, reserved, prefix: false })).toEqual([
      { name: 'useDate' },
      { name: 'useLayout' },
      { name: 'useTheme' },
    ])
  })

  it('prefixes exactly the listed names', () => {
    expect(resolveComposableImports({ composables, reserved, prefix: ['useTheme'] })).toEqual([
      { name: 'useDate' },
      { name: 'useLayout' },
      { name: 'useTheme', as: 'useVTheme' },
    ])
  })

  it('does not merge a list with auto-detected collisions', () => {
    const resolved = resolveComposableImports({ composables, reserved, prefix: ['useDate'] })
    expect(resolved.find(i => i.name === 'useLayout')).toEqual({ name: 'useLayout' })
  })

  it('ignores unknown names in the list', () => {
    expect(resolveComposableImports({ composables, reserved, prefix: ['useNope'] })).toEqual([
      { name: 'useDate' },
      { name: 'useLayout' },
      { name: 'useTheme' },
    ])
  })

  it('handles an empty composable list', () => {
    expect(resolveComposableImports({ composables: [], reserved, prefix: 'auto' })).toEqual([])
  })
})

function createStubNuxt () {
  const handlers = new Map<string, ((payload: any) => void)[]>()
  const nuxt = {
    hook (event: string, cb: (payload: any) => void) {
      const existing = handlers.get(event)
      if (existing) {
        existing.push(cb)
      } else {
        handlers.set(event, [cb])
      }
    },
  } as unknown as Nuxt

  return {
    nuxt,
    emit<T> (event: string, payload: T): T {
      for (const cb of handlers.get(event) ?? []) {
        cb(payload)
      }
      return payload
    },
  }
}

const NUXT_LAYOUT_PRESETS = [{ from: '#app/composables/layout', imports: ['useLayout'] }]

describe('registerComposableImports', () => {
  it('prefixes the composable that collides with a Nuxt built-in', () => {
    const stub = createStubNuxt()
    registerComposableImports(stub.nuxt, {
      composables: ['useDate', 'useLayout'],
      prefix: 'auto',
      toImport: ({ name, as }) => ({ name, as, from: 'vuetify' }),
    })

    stub.emit('imports:sources', NUXT_LAYOUT_PRESETS)
    expect(stub.emit('imports:extend', [] as any[])).toEqual([
      { name: 'useDate', as: undefined, from: 'vuetify' },
      { name: 'useLayout', as: 'useVLayout', from: 'vuetify' },
    ])
  })

  it('leaves everything alone when nothing collides', () => {
    const stub = createStubNuxt()
    registerComposableImports(stub.nuxt, {
      composables: ['useDate', 'useLayout'],
      prefix: 'auto',
      toImport: ({ name, as }) => ({ name, as, from: 'vuetify' }),
    })

    stub.emit('imports:sources', [{ from: '#app/composables/router', imports: ['useRoute'] }])
    expect(stub.emit('imports:extend', [] as any[])).toEqual([
      { name: 'useDate', as: undefined, from: 'vuetify' },
      { name: 'useLayout', as: undefined, from: 'vuetify' },
    ])
  })

  it('re-pushes after Nuxt clears the array on regeneration', () => {
    const stub = createStubNuxt()
    registerComposableImports(stub.nuxt, {
      composables: ['useLayout'],
      prefix: 'auto',
      toImport: ({ name, as }) => ({ name, as, from: 'vuetify' }),
    })

    stub.emit('imports:sources', NUXT_LAYOUT_PRESETS)
    stub.emit('imports:extend', [] as any[])
    // Nuxt truncates the array before re-running the hook.
    expect(stub.emit('imports:extend', [] as any[])).toEqual([
      { name: 'useLayout', as: 'useVLayout', from: 'vuetify' },
    ])
  })

  it('notifies about renames exactly once across regenerations', () => {
    const stub = createStubNuxt()
    const calls: { name: string, as: string }[][] = []
    registerComposableImports(stub.nuxt, {
      composables: ['useLayout'],
      prefix: 'auto',
      toImport: ({ name, as }) => ({ name, as, from: 'vuetify' }),
      onPrefixed: renames => calls.push(renames),
    })

    stub.emit('imports:sources', NUXT_LAYOUT_PRESETS)
    stub.emit('imports:extend', [] as any[])
    stub.emit('imports:extend', [] as any[])

    expect(calls).toEqual([[{ name: 'useLayout', as: 'useVLayout' }]])
  })

  it('does not notify when nothing was renamed', () => {
    const stub = createStubNuxt()
    const calls: unknown[] = []
    registerComposableImports(stub.nuxt, {
      composables: ['useDate'],
      prefix: 'auto',
      toImport: ({ name, as }) => ({ name, as, from: 'vuetify' }),
      onPrefixed: renames => calls.push(renames),
    })

    stub.emit('imports:sources', NUXT_LAYOUT_PRESETS)
    stub.emit('imports:extend', [] as any[])

    expect(calls).toEqual([])
  })

  it('appends to imports already present in the array', () => {
    const stub = createStubNuxt()
    registerComposableImports(stub.nuxt, {
      composables: ['useDate'],
      prefix: 'auto',
      toImport: ({ name, as }) => ({ name, as, from: 'vuetify' }),
    })

    stub.emit('imports:sources', [])
    expect(stub.emit('imports:extend', [{ name: 'existing', from: 'elsewhere' }] as any[])).toEqual([
      { name: 'existing', from: 'elsewhere' },
      { name: 'useDate', as: undefined, from: 'vuetify' },
    ])
  })

  it('pushes unprefixed when imports:extend runs before imports:sources', () => {
    const stub = createStubNuxt()
    const calls: unknown[] = []
    registerComposableImports(stub.nuxt, {
      composables: ['useLayout'],
      prefix: 'auto',
      toImport: ({ name, as }) => ({ name, as, from: 'vuetify' }),
      onPrefixed: renames => calls.push(renames),
    })

    // No presets seen yet: nothing is known to be reserved, so nothing is renamed.
    expect(stub.emit('imports:extend', [] as any[])).toEqual([
      { name: 'useLayout', as: undefined, from: 'vuetify' },
    ])
    expect(calls).toEqual([])

    // Once sources arrive, the next regeneration corrects the name and notifies.
    stub.emit('imports:sources', NUXT_LAYOUT_PRESETS)
    expect(stub.emit('imports:extend', [] as any[])).toEqual([
      { name: 'useLayout', as: 'useVLayout', from: 'vuetify' },
    ])
    expect(calls).toEqual([[{ name: 'useLayout', as: 'useVLayout' }]])
  })
})
