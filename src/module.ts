import {
  addPluginTemplate,
  createResolver,
  defineNuxtModule,
  extendWebpackConfig,
  useLogger,
} from '@nuxt/kit'
import type { VuetifyOptions } from 'vuetify'
import type { ViteConfig } from '@nuxt/schema'
import defu from 'defu'

import { resolveVuetifyBase } from '@vuetify/loader-shared'
import importMap from 'vuetify/dist/json/importMap.json' assert { type: 'json' }

// import vuetify from 'vite-plugin-vuetify'
import packageJson from '../package.json' assert { type: 'json' }
import { stylesPlugin } from './styles-plugin'

const CONFIG_KEY = 'vuetify'
const logger = useLogger(`nuxt:${CONFIG_KEY}`)

export type TVuetifyOptions = Partial<VuetifyOptions> & { ssr: boolean }

export interface ModuleOptions {
  moduleOptions: {
    writePlugin?: boolean
    styles?: true | 'none' | 'expose' | 'sass' | {
      configFile: string
    }
  }
  vuetifyOptions?: VuetifyOptions
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vuetify-nuxt-module',
    configKey: 'vuetify',
    compatibility: { nuxt: '^3.0.0' },
    version: packageJson.version,
  },
  // Default configuration options of the Nuxt module
  defaults: {
    moduleOptions: {
      writePlugin: true,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const { moduleOptions, vuetifyOptions } = options

    // Prepare options for the runtime plugin
    const isSSR = nuxt.options.ssr
    const vuetifyAppOptions = <TVuetifyOptions>defu(vuetifyOptions, {
      ssr: isSSR,
    })

    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push(CONFIG_KEY)

    const { styles } = moduleOptions

    nuxt.options.build.transpile.push(CONFIG_KEY)
    nuxt.options.css ??= []
    if (typeof styles === 'string' && ['sass', 'expose'].includes(styles))
      nuxt.options.css.unshift('vuetify/styles/main.sass')
    else if (styles === true)
      nuxt.options.css.unshift('vuetify/styles')
    else if (typeof styles === 'object' && styles?.configFile && typeof styles.configFile === 'string')
      nuxt.options.css.unshift(styles.configFile)

    extendWebpackConfig(() => {
      throw new Error('Webpack is not supported yet: vuetify-nuxt-module module can only be used with Vite!')
    })

    nuxt.hook('vite:extend', ({ config }) => checkVuetifyPlugins(config))

    const vuetifyBase = resolveVuetifyBase()

    nuxt.hook('components:extend', (c) => {
      // console.log(c)
      Object.entries(importMap.components).forEach(([component, { from }]) => {
        c.push({
          pascalName: component,
          kebabName: kebabCase(component),
          export: component,
          filePath: `${resolver.resolve(vuetifyBase, `lib/${from}`)}`,
          shortPath: `components/${from}`,
          chunkName: kebabCase(component),
          prefetch: false,
          preload: false,
          global: false,
          mode: 'all',
        })
      })
    })

    nuxt.hook('vite:extendConfig', (viteInlineConfig) => {
      viteInlineConfig.plugins = viteInlineConfig.plugins || []
      checkVuetifyPlugins(viteInlineConfig)

      viteInlineConfig.optimizeDeps = defu(viteInlineConfig.optimizeDeps, { exclude: ['vuetify'] })

      viteInlineConfig.ssr ||= {}
      viteInlineConfig.ssr.noExternal = [
        ...(Array.isArray(viteInlineConfig.ssr.noExternal) ? viteInlineConfig.ssr.noExternal : []),
        CONFIG_KEY,
      ]

      viteInlineConfig.plugins.push(stylesPlugin({ styles }, logger))
    })

    addPluginTemplate({
      src: resolver.resolve(runtimeDir, 'templates/plugin.mts'),
      write: nuxt.options.dev || moduleOptions.writePlugin,
      options: vuetifyAppOptions,
    })
  },
})

function checkVuetifyPlugins(config: ViteConfig) {
  let plugin = config.plugins?.find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vuetify:import')
  if (plugin)
    throw new Error('Remove vite-plugin-vuetify plugin from Vite Plugins entry in Nuxt config file!')

  plugin = config.plugins?.find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vuetify:styles')
  if (plugin)
    throw new Error('Remove vite-plugin-vuetify plugin from Vite Plugins entry in Nuxt config file!')
}

function kebabCase(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}
