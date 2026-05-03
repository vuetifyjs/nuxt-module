import type { Nuxt } from '@nuxt/schema'
import type { VuetifyNuxtContext } from '../src/utils/config'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@vuetify/unplugin-styles/vite', async importOriginal => {
  const original = await importOriginal<typeof import('@vuetify/unplugin-styles/vite')>()
  const Styles = original.default
  const wrapped: typeof Styles = opts => {
    const plugin = Styles(opts)
    // Shallow-clone so assertions aren't affected if the real factory mutates
    // its argument (e.g. normalises a path or fills in defaults).
    // Non-enumerable so the property doesn't leak into Vite's plugin-shape
    // introspection or console output.
    Object.defineProperty(plugin, '__options', { value: { ...opts }, enumerable: false })
    return plugin
  }
  return { ...original, default: wrapped }
})

// eslint-disable-next-line import/first -- mock must hoist above this import
import { configureVite } from '../src/utils/configure-vite'

// Intentionally hard-coded: if @vuetify/unplugin-styles renames its plugin,
// these tests should break loudly so we re-verify the wiring in configureVite.
const PLUGIN_NAME = '@vuetify/unplugin-styles'

function createStubNuxt () {
  let extendConfigCb: ((cfg: any) => void) | undefined
  let lastCfg: any
  const nuxt = {
    hook (event: string, cb: any) {
      if (event === 'vite:extendConfig') {
        extendConfigCb = cb
      }
    },
  } as unknown as Nuxt
  return {
    nuxt,
    get lastCfg () {
      return lastCfg
    },
    runExtendConfig () {
      if (!extendConfigCb) {
        throw new Error('vite:extendConfig was not registered')
      }
      const cfg: any = { plugins: [] }
      try {
        extendConfigCb(cfg)
      } finally {
        // expose partial state for post-throw inspection
        lastCfg = cfg
      }
      return cfg
    },
  }
}

function createCtx (overrides: Partial<VuetifyNuxtContext> = {}): VuetifyNuxtContext {
  return {
    moduleOptions: {},
    vuetifyOptions: {},
    isSSR: false,
    viteVersion: '5.0.0',
    ssrClientHints: { enabled: false } as any,
    ...overrides,
  } as VuetifyNuxtContext
}

function findStylesPlugin (plugins: any[]) {
  // Sentinel: configureVite is synchronous — plugin entries must not be thenables.
  // If unplugin ever returns Promise<Plugin>, this surfaces as a clear error
  // instead of silently making every "plugin present" assertion fail.
  for (const p of plugins) {
    if (p && typeof (p as any).then === 'function') {
      throw new Error('configureVite registered an async plugin entry — unexpected')
    }
  }
  return plugins.find(p => p && typeof p === 'object' && p.name === PLUGIN_NAME)
}

describe('configureVite — @vuetify/unplugin-styles wiring', () => {
  it('does not register the plugin when styles is undefined', () => {
    const { nuxt, runExtendConfig } = createStubNuxt()
    configureVite('vuetify', nuxt, createCtx({ moduleOptions: {} }))
    const cfg = runExtendConfig()
    expect(findStylesPlugin(cfg.plugins)).toBeUndefined()
  })

  it('does not register the plugin when styles is true', () => {
    const { nuxt, runExtendConfig } = createStubNuxt()
    configureVite('vuetify', nuxt, createCtx({ moduleOptions: { styles: true } }))
    const cfg = runExtendConfig()
    expect(findStylesPlugin(cfg.plugins)).toBeUndefined()
  })

  it('registers the plugin with { styles: \'none\' } for styles: \'none\'', () => {
    const { nuxt, runExtendConfig } = createStubNuxt()
    configureVite('vuetify', nuxt, createCtx({ moduleOptions: { styles: 'none' } }))
    const cfg = runExtendConfig()
    const plugin = findStylesPlugin(cfg.plugins)
    expect(plugin).toBeDefined()
    expect((plugin as any).__options).toEqual({ styles: 'none' })
  })

  it('registers the plugin with { settings } when configFile is provided', () => {
    const { nuxt, runExtendConfig } = createStubNuxt()
    configureVite(
      'vuetify',
      nuxt,
      createCtx({
        moduleOptions: { styles: { configFile: 'whatever.scss' } },
        stylesConfigFile: '/abs/path/settings.scss',
      }),
    )
    const cfg = runExtendConfig()
    const plugin = findStylesPlugin(cfg.plugins)
    expect(plugin).toBeDefined()
    expect((plugin as any).__options).toEqual({ settings: '/abs/path/settings.scss' })
  })

  it('forwards styles.cache when configFile is provided', () => {
    const { nuxt, runExtendConfig } = createStubNuxt()
    configureVite(
      'vuetify',
      nuxt,
      createCtx({
        moduleOptions: { styles: { configFile: 'whatever.scss', cache: false } as any },
        stylesConfigFile: '/abs/path/settings.scss',
      }),
    )
    const cfg = runExtendConfig()
    const plugin = findStylesPlugin(cfg.plugins)
    expect(plugin).toBeDefined()
    expect((plugin as any).__options).toEqual({ settings: '/abs/path/settings.scss', cache: false })
  })

  it('supports legacy styles.experimental.cache as fallback', () => {
    const { nuxt, runExtendConfig } = createStubNuxt()
    configureVite(
      'vuetify',
      nuxt,
      createCtx({
        moduleOptions: { styles: { configFile: 'whatever.scss', experimental: { cache: false } } },
        stylesConfigFile: '/abs/path/settings.scss',
      }),
    )
    const cfg = runExtendConfig()
    const plugin = findStylesPlugin(cfg.plugins)
    expect(plugin).toBeDefined()
    expect((plugin as any).__options).toEqual({ settings: '/abs/path/settings.scss', cache: false })
  })

  it('throws when configFile is provided but stylesConfigFile is not resolved, without registering the plugin before throwing', () => {
    const stub = createStubNuxt()
    configureVite(
      'vuetify',
      stub.nuxt,
      createCtx({
        moduleOptions: { styles: { configFile: 'whatever.scss' } },
        // stylesConfigFile intentionally unset
      }),
    )
    expect(() => stub.runExtendConfig()).toThrow(
      'vuetify-nuxt-module: styles.configFile could not be resolved',
    )
    // The partial plugin array collected up to the throw point must not
    // contain our unplugin — ordering regressions that push then throw
    // should fail this assertion.
    expect(findStylesPlugin(stub.lastCfg?.plugins ?? [])).toBeUndefined()
  })

  it('does not register the plugin for object styles without configFile', () => {
    const { nuxt, runExtendConfig } = createStubNuxt()
    configureVite(
      'vuetify',
      nuxt,
      createCtx({ moduleOptions: { styles: { colors: false, utilities: false } as any } }),
    )
    const cfg = runExtendConfig()
    expect(findStylesPlugin(cfg.plugins)).toBeUndefined()
  })
})
