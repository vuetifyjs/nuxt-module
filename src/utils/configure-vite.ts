import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import type { AssetURLOptions } from '@vue/compiler-sfc'
import { transformAssetUrls as vuetifyTransformAssetUrls } from 'vite-plugin-vuetify'
import { vuetifyStylesPlugin } from '../vite/vuetify-styles-plugin'
import { vuetifyConfigurationPlugin } from '../vite/vuetify-configuration-plugin'
import { vuetifyIconsPlugin } from '../vite/vuetify-icons-configuration-plugin'
import { vuetifyDateConfigurationPlugin } from '../vite/vuetify-date-configuration-plugin'
import { vuetifySSRClientHintsPlugin } from '../vite/vuetify-ssr-client-hints-plugin'
import { vuetifyImportPlugin } from '../vite/vuetify-import-plugin'
import { checkVuetifyPlugins } from './module'
import type { VuetifyNuxtContext } from './config'
import { normalizeTransformAssetUrls } from './index'

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

    const { includeTransformAssetsUrls, styles } = ctx.moduleOptions
    if (includeTransformAssetsUrls) {
      viteInlineConfig.vue ??= {}
      viteInlineConfig.vue.template ??= {}
      let existingTransformAssetUrls = viteInlineConfig.vue.template.transformAssetUrls ?? {}
      let useURLOptions: AssetURLOptions | undefined
      if (typeof existingTransformAssetUrls === 'boolean') {
        existingTransformAssetUrls = {}
      }
      else if ('base' in existingTransformAssetUrls || 'includeAbsolute' in existingTransformAssetUrls || 'tags' in existingTransformAssetUrls) {
        useURLOptions = {
          base: existingTransformAssetUrls.base as string | undefined,
          includeAbsolute: existingTransformAssetUrls.includeAbsolute as boolean | undefined,
        }
        existingTransformAssetUrls = (existingTransformAssetUrls.tags ?? {}) as Record<string, string[]>
      }

      const transformAssetUrls = normalizeTransformAssetUrls(
        typeof includeTransformAssetsUrls === 'object'
          ? defu(existingTransformAssetUrls, vuetifyTransformAssetUrls, includeTransformAssetsUrls)
          : defu(existingTransformAssetUrls, vuetifyTransformAssetUrls),
      )

      if (useURLOptions) {
        useURLOptions.tags = transformAssetUrls
        viteInlineConfig.vue.template.transformAssetUrls = useURLOptions
      }
      else {
        viteInlineConfig.vue.template.transformAssetUrls = transformAssetUrls
      }
    }

    viteInlineConfig.plugins.push(vuetifyImportPlugin({}))
    viteInlineConfig.plugins.push(vuetifyStylesPlugin({ styles }, ctx.logger))
    viteInlineConfig.plugins.push(vuetifyConfigurationPlugin(ctx))
    viteInlineConfig.plugins.push(vuetifyIconsPlugin(ctx))
    viteInlineConfig.plugins.push(vuetifyDateConfigurationPlugin(ctx))
    if (ctx.ssrClientHints.enabled)
      viteInlineConfig.plugins.push(vuetifySSRClientHintsPlugin(ctx))
  })
}
