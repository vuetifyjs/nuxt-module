import {
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendWebpackConfig,
  getNuxtVersion,
  hasNuxtModule,
  isNuxt3,
  useLogger,
} from '@nuxt/kit'
import defu from 'defu'
import { version } from '../package.json'
import { vuetifyStylesPlugin } from './vite/vuetify-styles-plugin'
import type { DateAdapter, MOptions, ModuleOptions, VOptions } from './types'
import { vuetifyConfigurationPlugin } from './vite/vuetify-configuration-plugin'
import { vuetifyDateConfigurationPlugin } from './vite/vuetify-date-configuration-plugin'
import { prepareIcons } from './utils/icons'
import { vuetifyIconsPlugin } from './vite/vuetify-icons-configuration-plugin'
import { toKebabCase } from './utils'
import { checkVuetifyPlugins, cleanupBlueprint, detectDate, resolveVuetifyComponents } from './utils/module'
import { mergeVuetifyModules } from './utils/layers'

export * from './types'

export { defineVuetifyConfiguration } from './utils/config'

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
  async setup(options, nuxt) {
    if (!isNuxt3(nuxt))
      logger.error(`Cannot support nuxt version: ${getNuxtVersion(nuxt)}`)

    const resolver = createResolver(import.meta.url)

    const {
      configuration,
      vuetifyConfigurationFilesToWatch,
    } = await mergeVuetifyModules(options, nuxt)

    // right now we restart the dev server when any vuetify configuration file changes
    // TODO: there is a bug in nuxt that prevents this from working, I'll send a PR to fix it
    // `nuxt.options.watch` entries should be relative to `srcDir`, but the path in the callback is always absolute
    // https://github.com/nuxt/nuxt/blob/4b6f3e1ba11ee247906a34ea76292bf3a171ed3b/packages/nuxt/src/core/nuxt.ts#L350-L357
    // TODO: move the entire module to a new module and try to use HMR when Vuetify changes doesn't require a restart
    if (nuxt.options.dev && vuetifyConfigurationFilesToWatch.size) {
      // nuxt.options.watch.push(...vuetifyConfigurationFilesToWatch.keys())
      nuxt.hooks.hook('builder:watch', (event, path) => {
        if (vuetifyConfigurationFilesToWatch.has(path))
          return nuxt.callHook('restart')
      })
    }

    const { moduleOptions = {}, vuetifyOptions = {} } = configuration

    const {
      directives = false,
      labComponents = false,
      ...vOptions
    } = vuetifyOptions

    // prepare options module
    const newModuleOptions = <MOptions>defu(moduleOptions, {
      styles: true,
      importComposables: true,
      prefixComposables: false,
    })

    // Prepare options for the runtime plugin
    const isSSR = nuxt.options.ssr
    const vuetifyAppOptions = <VOptions>defu(vOptions, {})

    cleanupBlueprint(vuetifyAppOptions)

    const { styles } = newModuleOptions

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

    nuxt.options.build.transpile.push(CONFIG_KEY)
    nuxt.options.build.transpile.push(runtimeDir)

    const icons = prepareIcons(
      hasNuxtModule('@unocss/nuxt', nuxt),
      logger,
      vuetifyOptions,
    )

    nuxt.options.css ??= []
    if (typeof styles === 'string' && ['sass', 'expose'].includes(styles))
      nuxt.options.css.unshift('vuetify/styles/main.sass')
    else if (styles === true)
      nuxt.options.css.unshift('vuetify/styles')
    else if (typeof styles === 'object' && typeof styles?.configFile === 'string')
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
      references.push({ types: 'vuetify' })
      references.push({ types: 'vuetify-nuxt-module/configuration' })
    })

    const {
      componentsPromise,
      labComponentsPromise,
    } = resolveVuetifyComponents(resolver)

    nuxt.hook('components:extend', async (c) => {
      const components = await componentsPromise
      Object.keys(components).forEach((component) => {
        c.push({
          pascalName: component,
          kebabName: toKebabCase(component),
          export: component,
          filePath: 'vuetify/components',
          shortPath: 'vuetify/components',
          chunkName: toKebabCase(component),
          prefetch: false,
          preload: false,
          global: false,
          mode: 'all',
        })
      })
    })

    if (newModuleOptions.importComposables) {
      const composables = ['useLocale', 'useDefaults', 'useDisplay', 'useLayout', 'useRtl', 'useTheme']
      addImports(composables.map(name => ({
        name,
        from: 'vuetify',
        as: newModuleOptions.prefixComposables ? name.replace(/^use/, 'useV') : undefined,
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
        isSSR,
        i18n,
        directives,
        labComponents,
        vuetifyAppOptions,
        componentsPromise,
        labComponentsPromise,
        logger,
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
      src: resolver.resolve(runtimeDir, `plugins/vuetify${i18n ? '-sync' : ''}`),
    })
    addPlugin({
      src: resolver.resolve(runtimeDir, 'plugins/vuetify-icons'),
    })

    if (i18n) {
      addPlugin({
        src: resolver.resolve(runtimeDir, 'plugins/vuetify-i18n'),
      })
    }

    if (dateAdapter) {
      addPlugin({
        src: resolver.resolve(runtimeDir, 'plugins/vuetify-date'),
      })
    }
  },
})
