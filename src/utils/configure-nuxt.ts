import type { Nuxt } from '@nuxt/schema'
import { addImports, addPlugin, addPluginTemplate, extendWebpackConfig } from '@nuxt/kit'
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
    references.push({ path: ctx.resolver.resolve(runtimeDir, 'plugins/types') })
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

  let addHttpClientHintsPlugin = ''

  if (ctx.ssrClientHints.enabled) {
    addHttpClientHintsPlugin = `
if (import.meta.client)
dependsOn.push('vuetify:client-hints:client:plugin')
if (import.meta.server)
dependsOn.push('vuetify:client-hints:server:plugin')
`
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

  const dependsOn = ['vuetify:icons:plugin']

  addPlugin({
    src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-icons'),
  })

  if (ctx.i18n) {
    dependsOn.push('vuetify:i18n:plugin')
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-i18n'),
    })
  }

  if (nuxt.options.dev || ctx.dateAdapter) {
    if (ctx.i18n) {
      dependsOn.push('vuetify:date-i18n:plugin')
      addPlugin({
        src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-i18n-date'),
      })
    }
    else {
      dependsOn.push('vuetify:date:plugin')
      addPlugin({
        src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-date'),
      })
    }
  }

  addPluginTemplate({
    filename: 'vuetify-nuxt-plugin.mjs',
    write: false,
    getContents() {
      return `
import { defineNuxtPlugin } from '#imports'
import { isDev, vuetifyConfiguration } from 'virtual:vuetify-configuration'
import { createVuetify } from 'vuetify'

const dependsOn = ${JSON.stringify(dependsOn)}
${addHttpClientHintsPlugin}

export default defineNuxtPlugin({
  name: 'vuetify:nuxt:plugin',
  order: 25,
  dependsOn,
  parallel: true,
  async setup(nuxtApp) {
    const vuetifyOptions = vuetifyConfiguration()
    await nuxtApp.hooks.callHook('vuetify:configuration', { isDev, vuetifyOptions })
    await nuxtApp.hooks.callHook('vuetify:before-create', { isDev, vuetifyOptions })
    const vuetify = createVuetify(vuetifyOptions)
    nuxtApp.vueApp.use(vuetify)
    nuxtApp.provide('vuetify', vuetify)
    await nuxtApp.hooks.callHook('vuetify:ready', vuetify)
    if (process.client)
      isDev && console.log('Vuetify 3 initialized', vuetify)
  },
})
`
    },
  })
}
