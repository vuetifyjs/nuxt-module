import {
  addPluginTemplate,
  createResolver,
  defineNuxtModule,
  extendWebpackConfig,
  useLogger,
} from '@nuxt/kit'
import type { ViteConfig } from '@nuxt/schema'
import defu from 'defu'
import vuetify from 'vite-plugin-vuetify'
import type { VuetifyOptions } from 'vuetify'
import { version } from '../package.json'
import { stylesPlugin } from './styles-plugin'
import type { ModuleOptions } from './types'
import { vuetifyConfigurationPlugin } from './vuetify-configuration-plugin'

export * from './types'

const CONFIG_KEY = 'vuetify'
const logger = useLogger(`nuxt:${CONFIG_KEY}`)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vuetify-nuxt-module',
    configKey: 'vuetify',
    compatibility: { nuxt: '^3.0.0' },
    version,
  },
  // Default configuration options of the Nuxt module
  defaults: {
    vuetifyOptions: {
      labComponents: false,
      directives: false,
    },
    moduleOptions: {
      writePlugin: true,
      styles: true,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const { moduleOptions, vuetifyOptions } = options

    const { directives = false, labComponents = false } = vuetifyOptions ?? {}

    // Prepare options for the runtime plugin
    const isSSR = nuxt.options.ssr
    const vuetifyAppOptions = <VuetifyOptions>defu(vuetifyOptions, {
      ssr: isSSR,
    })

    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push(CONFIG_KEY)

    const { styles = true, writePlugin = nuxt.options.dev } = moduleOptions ?? {}

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

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: 'vuetify-nuxt-module/configuration' })
      references.push({ types: 'vuetify/components' })
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
      const autoImportPlugin = vuetify({ styles, autoImport: true }).find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vuetify:import')!
      viteInlineConfig.plugins.push(autoImportPlugin)
      viteInlineConfig.plugins.push(stylesPlugin({ styles }, logger))
      viteInlineConfig.plugins.push(vuetifyConfigurationPlugin(directives, labComponents, vuetifyAppOptions))
    })

    addPluginTemplate({
      src: resolver.resolve(runtimeDir, 'templates/plugin.mts'),
      write: nuxt.options.dev || writePlugin,
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
