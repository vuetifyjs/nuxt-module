import type { Nuxt } from '@nuxt/schema'
import { addImports, addPlugin, extendWebpackConfig } from '@nuxt/kit'
import { transformAssetUrls } from 'vite-plugin-vuetify'
import defu from 'defu'
import type { VuetifyNuxtContext } from './config'
import { normalizeTransformAssetUrls, toKebabCase } from './index'

export function configureNuxt(
  configKey: string,
  nuxt: Nuxt,
  ctx: VuetifyNuxtContext,
) {
  const {
    importComposables,
    prefixComposables,
    styles,
    includeTransformAssetsUrls = true,
  } = ctx.moduleOptions

  const runtimeDir = ctx.resolver.resolve('./runtime')

  if (!nuxt.options.ssr) {
    nuxt.options.build.transpile.push(configKey)
    nuxt.options.build.transpile.push(runtimeDir)
  }

  nuxt.options.css ??= []
  if (typeof styles === 'string' && ['sass', 'expose'].includes(styles))
    nuxt.options.css.unshift('vuetify/styles/main.sass')
  else if (styles === true)
    nuxt.options.css.unshift('vuetify/styles')
  else if (typeof styles === 'object' && typeof styles?.configFile === 'string')
    nuxt.options.css.unshift(styles.configFile)

  if (includeTransformAssetsUrls && typeof nuxt.options.vite.vue?.template?.transformAssetUrls === 'undefined') {
    nuxt.options.vite.vue ??= {}
    nuxt.options.vite.vue.template ??= {}
    nuxt.options.vite.vue.template.transformAssetUrls = normalizeTransformAssetUrls(
      typeof includeTransformAssetsUrls === 'object'
        ? defu(includeTransformAssetsUrls, transformAssetUrls)
        : transformAssetUrls,
    )
  }

  extendWebpackConfig(() => {
    throw new Error('Webpack is not supported: vuetify-nuxt-module module can only be used with Vite!')
  })

  nuxt.hook('prepare:types', ({ references }) => {
    references.push({ types: 'vuetify' })
    references.push({ types: 'vuetify-nuxt-module/custom-configuration' })
    references.push({ types: 'vuetify-nuxt-module/configuration' })
    const types = ctx.resolver.resolve(runtimeDir, 'plugins/types')
    references.push({ path: ctx.resolver.resolve(nuxt.options.buildDir, types) })
  })

  /* nuxt.hook('components:extend', async (c) => {
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
  }) */

  if (importComposables) {
    const composables = ['useDate', 'useLocale', 'useDefaults', 'useDisplay', 'useLayout', 'useRtl', 'useTheme']
    addImports(composables.map(name => ({
      name,
      from: ctx.vuetify3_4 || name !== 'useDate' ? 'vuetify' : 'vuetify/labs/date',
      as: prefixComposables ? name.replace(/^use/, 'useV') : undefined,
      meta: { docsUrl: `https://vuetifyjs.com/en/api/${toKebabCase(name)}/` },
    })))
  }

  if (ctx.ssrClientHints.enabled) {
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-client-hints.client'),
      mode: 'client',
    })
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-client-hints.server'),
      mode: 'server',
    })
  }
  else {
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-no-client-hints'),
    })
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

  if (nuxt.options.dev || ctx.dateAdapter) {
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-date'),
    })
  }
}
