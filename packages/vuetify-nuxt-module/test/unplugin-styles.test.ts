import type { Nuxt } from '@nuxt/schema'
import type { VuetifyNuxtContext } from '../src/utils/config'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@vuetify/unplugin-styles/vite', async (importOriginal) => {
  const original = await importOriginal<typeof import('@vuetify/unplugin-styles/vite')>()
  const Styles = original.default
  const wrapped: typeof Styles = (opts) => {
    const plugin = Styles(opts)
    Object.defineProperty(plugin, '__options', { value: opts ?? {}, enumerable: false })
    return plugin
  }
  return { ...original, default: wrapped }
})

// eslint-disable-next-line import/first — import must follow the mock above
import { configureVite } from '../src/utils/configure-vite'

const PLUGIN_NAME = '@vuetify/unplugin-styles'

function createStubNuxt() {
  let extendConfigCb: ((cfg: any) => void) | undefined
  const nuxt = {
    hook(event: string, cb: any) {
      if (event === 'vite:extendConfig') {
        extendConfigCb = cb
      }
    },
  } as unknown as Nuxt
  return {
    nuxt,
    runExtendConfig() {
      if (!extendConfigCb) {
        throw new Error('vite:extendConfig was not registered')
      }
      const cfg: any = { plugins: [] }
      extendConfigCb(cfg)
      return cfg
    },
  }
}

function createCtx(overrides: Partial<VuetifyNuxtContext> = {}): VuetifyNuxtContext {
  return {
    moduleOptions: {},
    vuetifyOptions: {},
    isSSR: false,
    viteVersion: '5.0.0',
    ssrClientHints: { enabled: false } as any,
    ...overrides,
  } as VuetifyNuxtContext
}

function findStylesPlugin(plugins: any[]) {
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

  it("registers the plugin with { styles: 'none' } for styles: 'none'", () => {
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

  it('throws when configFile is provided but stylesConfigFile is not resolved', () => {
    const { nuxt, runExtendConfig } = createStubNuxt()
    configureVite(
      'vuetify',
      nuxt,
      createCtx({
        moduleOptions: { styles: { configFile: 'whatever.scss' } },
        // stylesConfigFile intentionally unset
      }),
    )
    expect(() => runExtendConfig()).toThrow(
      'vuetify-nuxt-module: styles.configFile could not be resolved',
    )
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
