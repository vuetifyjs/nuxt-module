import {
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendWebpackConfig, hasNuxtModule,
  useLogger,
} from '@nuxt/kit'
import type { ViteConfig } from '@nuxt/schema'
import defu from 'defu'
import vuetify from 'vite-plugin-vuetify'
import type { VuetifyOptions } from 'vuetify'
import { isPackageExists } from 'local-pkg'
import { version } from '../package.json'
import { stylesPlugin } from './vite/styles-plugin'
import type { DateAdapter, ModuleOptions } from './types'
import { vuetifyConfigurationPlugin } from './vite/vuetify-configuration-plugin'
import { vuetifyDateConfigurationPlugin } from './vite/vuetify-date-configuration-plugin'

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
  defaults: () => ({
    vuetifyOptions: {
      labComponents: false,
      directives: false,
    },
    moduleOptions: {
      styles: true,
    },
  }),
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const { moduleOptions, vuetifyOptions } = options

    const {
      directives = false,
      labComponents = false,
      ...vOptions
    } = vuetifyOptions ?? {}

    // Prepare options for the runtime plugin
    const isSSR = nuxt.options.ssr
    const vuetifyAppOptions = <VuetifyOptions>defu(vOptions, {
      ssr: isSSR,
    })

    const { styles = true } = moduleOptions ?? {}

    const i18n = hasNuxtModule('@nuxtjs/i18n', nuxt)

    let dateAdapter: DateAdapter | undefined

    const dateOptions = vuetifyOptions?.date

    if (dateOptions) {
      const adapter = dateOptions.adapter
      const date = detectDate()
      if (!adapter && date.length > 1)
        throw new Error(`Multiple date adapters found: ${date.map(d => `@date-io/${d[0]}`).join(', ')}, please specify the adapter to use in the "vuetifyOptions.date.adapter" option.`)

      if (adapter) {
        if (adapter === 'vuetify' || adapter === 'custom') {
          dateAdapter = adapter
        }
        else {
          if (date.find(d => d[0] === adapter) === undefined)
            logger.warn(`Ignoring Vuetify Date configuration, date adapter "@date-io/${adapter}" not installed!`)
          else
            dateAdapter = adapter
        }
      }
      else if (date.length === 0) {
        dateAdapter = 'vuetify'
      }
      else {
        dateAdapter = date[0][0]
      }
    }

    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push(CONFIG_KEY)

    nuxt.options.css ??= []
    if (typeof styles === 'string' && ['sass', 'expose'].includes(styles))
      nuxt.options.css.unshift('vuetify/styles/main.sass')
    else if (styles === true)
      nuxt.options.css.unshift('vuetify/styles')
    else if (typeof styles === 'object' && styles?.configFile && typeof styles.configFile === 'string')
      nuxt.options.css.unshift(styles.configFile)

    extendWebpackConfig(() => {
      throw new Error('Webpack is not supported: vuetify-nuxt-module module can only be used with Vite!')
    })

    nuxt.hook('vite:extend', ({ config }) => checkVuetifyPlugins(config))

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: 'vuetify-nuxt-module/configuration' })
      references.push({ types: 'vuetify' })
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
      const autoImportPlugin = vuetify({ styles: true, autoImport: true }).find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vuetify:import')!
      viteInlineConfig.plugins.push(autoImportPlugin)
      viteInlineConfig.plugins.push(stylesPlugin({ styles }, logger))
      viteInlineConfig.plugins.push(vuetifyConfigurationPlugin(
        nuxt.options.dev,
        directives,
        labComponents,
        vuetifyAppOptions,
      ))
      if (dateAdapter) {
        viteInlineConfig.plugins.push(vuetifyDateConfigurationPlugin(
          nuxt.options.dev,
          i18n,
          dateAdapter,
          dateOptions!,
        ))
      }
    })

    addPlugin({
      src: resolver.resolve(runtimeDir, 'plugins/vuetify.mts'),
    })

    if (i18n) {
      addPlugin({
        src: resolver.resolve(runtimeDir, 'plugins/vuetify-i18n.mts'),
      })
    }

    if (dateAdapter) {
      addPlugin({
        src: resolver.resolve(runtimeDir, 'plugins/vuetify-date.mts'),
      })
    }
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

function detectDate() {
  return [
    'date-fns',
    'moment',
    'luxon',
    'dayjs',
    'js-joda',
    'date-fns-jalali',
    'jalaali',
    'hijri',
  ].map<[name: DateAdapter, exists: boolean]>(m => [m as DateAdapter, isPackageExists(`@date-io/${m}`)])
    .filter(([, exists]) => exists)
}
