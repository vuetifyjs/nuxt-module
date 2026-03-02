import type { Nuxt } from '@nuxt/schema'
import type { ObjectImportPluginOptions } from '@vuetify/loader-shared'
import type { VuetifyNuxtContext } from './config'
import defu from 'defu'
import { vuetifyConfigurationPlugin } from '../vite/vuetify-configuration-plugin'
import { vuetifyDateConfigurationPlugin } from '../vite/vuetify-date-configuration-plugin'
import { vuetifyIconsPlugin } from '../vite/vuetify-icons-configuration-plugin'
import { vuetifyImportPlugin } from '../vite/vuetify-import-plugin'
import { vuetifySSRClientHintsPlugin } from '../vite/vuetify-ssr-client-hints-plugin'
import { createTransformAssetUrls } from './index'
import { checkVuetifyPlugins } from './module'

export function configureVite (configKey: string, nuxt: Nuxt, ctx: VuetifyNuxtContext) {
  nuxt.hook('vite:extend', ({ config }) => checkVuetifyPlugins(config))
  nuxt.hook('vite:extendConfig', viteInlineConfig => {
    viteInlineConfig.plugins = viteInlineConfig.plugins || []
    checkVuetifyPlugins(viteInlineConfig)

    viteInlineConfig.optimizeDeps = defu(viteInlineConfig.optimizeDeps, { exclude: ['vuetify'] })

    if (ctx.isSSR) {
      viteInlineConfig.ssr ||= {}
      viteInlineConfig.ssr.noExternal = [
        ...(Array.isArray(viteInlineConfig.ssr.noExternal)
          ? viteInlineConfig.ssr.noExternal
          : (viteInlineConfig.ssr.noExternal && typeof viteInlineConfig.ssr.noExternal !== 'boolean'
              ? [viteInlineConfig.ssr.noExternal]
              : [])
        ),
        configKey,
      ]
    }

    const transformAssetUrls = createTransformAssetUrls(
      ctx,
      viteInlineConfig,
    )
    if (transformAssetUrls) {
      viteInlineConfig.vue ??= {}
      viteInlineConfig.vue.template ??= {}
      viteInlineConfig.vue.template.transformAssetUrls = transformAssetUrls
    }

    const autoImport: ObjectImportPluginOptions = { labs: true }
    const ignoreDirectives = ctx.moduleOptions.ignoreDirectives
    // fix #236
    if (ignoreDirectives) {
      autoImport.ignore = Array.isArray(ignoreDirectives)
        ? ignoreDirectives
        : [ignoreDirectives]
    }

    viteInlineConfig.plugins.push(vuetifyImportPlugin({ autoImport }))
    // exclude styles plugin
    // if (typeof ctx.moduleOptions.styles !== 'boolean') {
    //   viteInlineConfig.plugins.push(vuetifyStylesPlugin({ styles: ctx.moduleOptions.styles }, ctx.viteVersion, ctx.logger))
    // }
    viteInlineConfig.plugins.push(vuetifyConfigurationPlugin(ctx), vuetifyIconsPlugin(ctx), vuetifyDateConfigurationPlugin(ctx))
    if (ctx.ssrClientHints.enabled) {
      viteInlineConfig.plugins.push(vuetifySSRClientHintsPlugin(ctx))
    }
  })
}
