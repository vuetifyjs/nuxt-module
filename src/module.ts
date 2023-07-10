import { readFile } from 'node:fs/promises'
import {
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendWebpackConfig,
  hasNuxtModule,
  useLogger,
} from '@nuxt/kit'
import type { ViteConfig } from '@nuxt/schema'
import defu from 'defu'
import { isPackageExists } from 'local-pkg'
import { resolveVuetifyBase } from '@vuetify/loader-shared'
import { version } from '../package.json'
import { vuetifyStylesPlugin } from './vite/vuetify-styles-plugin'
import type { DateAdapter, MOptions, ModuleOptions, VOptions } from './types'
import { vuetifyConfigurationPlugin } from './vite/vuetify-configuration-plugin'
import { vuetifyDateConfigurationPlugin } from './vite/vuetify-date-configuration-plugin'
import { prepareIcons } from './utils/icons'
import { vuetifyIconsPlugin } from './vite/vuetify-icons-configuration-plugin'
import { toKebabCase } from './utils'

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
      importComposables: true,
      styles: true,
    },
  }),
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const { vuetifyOptions = {} } = options

    const {
      directives = false,
      labComponents = false,
      ...vOptions
    } = vuetifyOptions

    // prepare options module
    const moduleOptions = <MOptions>defu(options.moduleOptions ?? {}, {
      styles: true,
      importComposables: true,
      prefixComposables: false,
    })

    // Prepare options for the runtime plugin
    const isSSR = nuxt.options.ssr
    const vuetifyAppOptions = <VOptions>defu(vOptions, {
      ssr: isSSR,
    })

    cleanupBlueprint(vuetifyAppOptions)

    const { styles } = moduleOptions

    const i18n = hasNuxtModule('@nuxtjs/i18n', nuxt)

    let dateAdapter: DateAdapter | undefined

    const dateOptions = vuetifyOptions.date

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
          if (date.find(d => d === adapter) === undefined)
            logger.warn(`Ignoring Vuetify Date configuration, date adapter "@date-io/${adapter}" not installed!`)
          else
            dateAdapter = adapter
        }
      }
      else if (date.length === 0) {
        dateAdapter = 'vuetify'
      }
      else {
        dateAdapter = date[0]
      }
    }

    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push(CONFIG_KEY)

    const icons = prepareIcons(logger, vuetifyOptions)

    nuxt.options.css ??= []
    if (typeof styles === 'string' && ['sass', 'expose'].includes(styles))
      nuxt.options.css.unshift('vuetify/styles/main.sass')
    else if (styles === true)
      nuxt.options.css.unshift('vuetify/styles')
    else if (typeof styles === 'object' && styles?.configFile && typeof styles.configFile === 'string')
      nuxt.options.css.unshift(styles.configFile)

    if (icons.enabled) {
      icons.local?.forEach(css => nuxt.options.css.push(css))
      if (icons.cdn?.length) {
        nuxt.options.app.head.link ??= []
        icons.cdn.forEach(href => nuxt.options.app.head.link!.push({
          rel: 'stylesheet',
          href,
          type: 'text/css',
          crossorigin: 'anonymous',
        }))
      }
    }

    extendWebpackConfig(() => {
      throw new Error('Webpack is not supported: vuetify-nuxt-module module can only be used with Vite!')
    })

    nuxt.hook('vite:extend', ({ config }) => checkVuetifyPlugins(config))

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: 'vuetify-nuxt-module/configuration' })
    })

    nuxt.hook('components:extend', async (c) => {
      const vuetifyBase = resolveVuetifyBase()
      const { components } = JSON.parse(await readFile(resolver.resolve(vuetifyBase, 'dist/json/importMap.json'), 'utf-8'))
      Object.keys(components).forEach((component) => {
        const from = components[component].from
        c.push({
          pascalName: component,
          kebabName: toKebabCase(component),
          export: component,
          filePath: `${resolver.resolve(vuetifyBase, `lib/${from}`)}`,
          shortPath: `components/${from}`,
          chunkName: toKebabCase(component),
          prefetch: false,
          preload: false,
          global: false,
          mode: 'all',
        })
      })
    })

    if (moduleOptions.importComposables) {
      const composables = ['useLocale', 'useDefaults', 'useDisplay', 'useLayout', 'useRtl', 'useTheme']
      addImports(composables.map(name => ({
        name,
        from: 'vuetify',
        as: moduleOptions.prefixComposables ? name.replace(/^use/, 'useV') : undefined,
        meta: { docsUrl: `https://vuetifyjs.com/en/api/${toKebabCase(name)}/` },
      })))
    }

    nuxt.hook('vite:extendConfig', (viteInlineConfig) => {
      viteInlineConfig.plugins = viteInlineConfig.plugins || []
      checkVuetifyPlugins(viteInlineConfig)

      viteInlineConfig.optimizeDeps = defu(viteInlineConfig.optimizeDeps, { exclude: ['vuetify'] })

      viteInlineConfig.ssr ||= {}
      viteInlineConfig.ssr.noExternal = [
        ...(Array.isArray(viteInlineConfig.ssr.noExternal) ? viteInlineConfig.ssr.noExternal : []),
        CONFIG_KEY,
      ]

      viteInlineConfig.plugins.push(vuetifyStylesPlugin({ styles }, logger))
      viteInlineConfig.plugins.push(vuetifyConfigurationPlugin(
        nuxt.options.dev,
        i18n,
        directives,
        labComponents,
        vuetifyAppOptions,
      ))
      viteInlineConfig.plugins.push(vuetifyIconsPlugin(
        nuxt.options.dev,
        icons,
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
    addPlugin({
      src: resolver.resolve(runtimeDir, 'plugins/vuetify-icons.mts'),
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
  const result: DateAdapter[] = []
  // todo: remove this once fixed on Vuetify side
  if (true)
    return result

  ;[
    'date-fns',
    'moment',
    'luxon',
    'dayjs',
    'js-joda',
    'date-fns-jalali',
    'jalaali',
    'hijri',
  ].forEach((adapter) => {
    if (isPackageExists(`@date-io/${adapter}`))
      result.push(adapter as DateAdapter)
  })

  return result
}

function cleanupBlueprint(vuetifyOptions: VOptions) {
  const blueprint = vuetifyOptions.blueprint
  if (blueprint) {
    delete blueprint.ssr
    delete blueprint.components
    delete blueprint.directives
    delete blueprint.locale
    delete blueprint.date
    delete blueprint.icons
    vuetifyOptions.blueprint = blueprint
  }
}
