import type { Nuxt } from '@nuxt/schema'
import { addImports, addPlugin, extendWebpackConfig } from '@nuxt/kit'
import type { VuetifyNuxtContext } from './config'
import { toKebabCase } from './index'

export function configureNuxt(configKey: string, nuxt: Nuxt, ctx: VuetifyNuxtContext) {
  const { importComposables, prefixComposables, styles } = ctx.moduleOptions

  const runtimeDir = ctx.resolver.resolve('./runtime')

  nuxt.options.build.transpile.push(configKey)
  nuxt.options.build.transpile.push(runtimeDir)

  nuxt.options.css ??= []
  if (typeof styles === 'string' && ['sass', 'expose'].includes(styles))
    nuxt.options.css.unshift('vuetify/styles/main.sass')
  else if (styles === true)
    nuxt.options.css.unshift('vuetify/styles')
  else if (typeof styles === 'object' && typeof styles?.configFile === 'string')
    nuxt.options.css.unshift(styles.configFile)

  extendWebpackConfig(() => {
    throw new Error('Webpack is not supported: vuetify-nuxt-module module can only be used with Vite!')
  })

  nuxt.hook('prepare:types', ({ references }) => {
    references.push({ types: 'vuetify' })
    references.push({ types: 'vuetify-nuxt-module/custom-configuration' })
    references.push({ types: 'vuetify-nuxt-module/configuration' })
  })

  nuxt.hook('components:extend', async (c) => {
    const components = await ctx.componentsPromise
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

  if (importComposables) {
    const composables = ['useLocale', 'useDefaults', 'useDisplay', 'useLayout', 'useRtl', 'useTheme']
    addImports(composables.map(name => ({
      name,
      from: 'vuetify',
      as: prefixComposables ? name.replace(/^use/, 'useV') : undefined,
      meta: { docsUrl: `https://vuetifyjs.com/en/api/${toKebabCase(name)}/` },
    })))
  }

  addPlugin({
    src: ctx.resolver.resolve(runtimeDir, `plugins/vuetify${ctx.i18n ? '-sync' : ''}`),
  })
  addPlugin({
    src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-icons'),
  })

  if (ctx.i18n) {
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-i18n'),
    })
  }

  if (nuxt.options.dev) {
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-date'),
    })
  }
  else {
    if (ctx.dateAdapter) {
      addPlugin({
        src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-date'),
      })
    }
  }
}
