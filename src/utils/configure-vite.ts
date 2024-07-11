import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import { vuetifyStylesPlugin } from '../vite/vuetify-styles-plugin'
import { vuetifyConfigurationPlugin } from '../vite/vuetify-configuration-plugin'
import { vuetifyIconsPlugin } from '../vite/vuetify-icons-configuration-plugin'
import { vuetifyDateConfigurationPlugin } from '../vite/vuetify-date-configuration-plugin'
import { vuetifySSRClientHintsPlugin } from '../vite/vuetify-ssr-client-hints-plugin'
import { vuetifyImportPlugin } from '../vite/vuetify-import-plugin'
import { checkVuetifyPlugins } from './module'
import type { VuetifyNuxtContext } from './config'
import { createTransformAssetUrls } from './index'

export function configureVite(configKey: string, nuxt: Nuxt, ctx: VuetifyNuxtContext) {
  nuxt.hook('vite:extend', ({ config }) => checkVuetifyPlugins(config))
  nuxt.hook('vite:extendConfig', (viteInlineConfig) => {
    viteInlineConfig.plugins = viteInlineConfig.plugins || []
    checkVuetifyPlugins(viteInlineConfig)

    viteInlineConfig.optimizeDeps = defu(viteInlineConfig.optimizeDeps, { exclude: ['vuetify'] })

    if (nuxt.options.ssr) {
      viteInlineConfig.ssr ||= {}
      viteInlineConfig.ssr.noExternal = [
        ...(Array.isArray(viteInlineConfig.ssr.noExternal)
          ? viteInlineConfig.ssr.noExternal
          : viteInlineConfig.ssr.noExternal && typeof viteInlineConfig.ssr.noExternal !== 'boolean'
            ? [viteInlineConfig.ssr.noExternal]
            : []
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

    viteInlineConfig.plugins.push(vuetifyImportPlugin({}))
    viteInlineConfig.plugins.push(vuetifyStylesPlugin({ styles: ctx.moduleOptions.styles }, ctx.logger))
    viteInlineConfig.plugins.push(vuetifyConfigurationPlugin(ctx))
    viteInlineConfig.plugins.push(vuetifyIconsPlugin(ctx))
    viteInlineConfig.plugins.push(vuetifyDateConfigurationPlugin(ctx))
    if (ctx.ssrClientHints.enabled)
      viteInlineConfig.plugins.push(vuetifySSRClientHintsPlugin(ctx))
  })
}
