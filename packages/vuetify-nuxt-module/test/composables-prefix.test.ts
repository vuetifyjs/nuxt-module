import { describe, expect, it } from 'vitest'
import { collectPresetNames, resolveComposableImports } from '../src/utils/composables'

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
