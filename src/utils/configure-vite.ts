import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import type { ObjectImportPluginOptions } from '@vuetify/loader-shared'
import { isPackageExists } from 'local-pkg'
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

    if (ctx.isSSR) {
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

    if (!ctx.moduleOptions.disableModernSassCompiler) {
      // vite version >= 5.4.0
      const [major, minor, patch] = ctx.viteVersion
      const enableModernSassCompiler = major > 5 || (major === 5 && minor >= 4)
      if (enableModernSassCompiler) {
        const sassEmbedded = isPackageExists('sass-embedded')
        if (sassEmbedded) {
          viteInlineConfig.css ??= {}
          viteInlineConfig.css.preprocessorOptions ??= {}
          viteInlineConfig.css.preprocessorOptions.sass ??= {}
          viteInlineConfig.css.preprocessorOptions.sass.api = 'modern-compiler'
          viteInlineConfig.css.preprocessorOptions.scss ??= {}
          viteInlineConfig.css.preprocessorOptions.scss.api = 'modern-compiler'
        }
        else {
          viteInlineConfig.css ??= {}
          viteInlineConfig.css.preprocessorOptions ??= {}
          viteInlineConfig.css.preprocessorOptions.sass ??= {}
          viteInlineConfig.css.preprocessorOptions.sass.api = 'modern'
          viteInlineConfig.css.preprocessorOptions.scss ??= {}
          viteInlineConfig.css.preprocessorOptions.scss.api = 'modern'
          if (!('preprocessorMaxWorkers' in viteInlineConfig.css))
            viteInlineConfig.css.preprocessorMaxWorkers = true
        }
      }
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
    if (typeof ctx.moduleOptions.styles !== 'boolean')
      viteInlineConfig.plugins.push(vuetifyStylesPlugin({ styles: ctx.moduleOptions.styles }, ctx.viteVersion, ctx.logger))
    viteInlineConfig.plugins.push(vuetifyConfigurationPlugin(ctx))
    viteInlineConfig.plugins.push(vuetifyIconsPlugin(ctx))
    viteInlineConfig.plugins.push(vuetifyDateConfigurationPlugin(ctx))
    if (ctx.ssrClientHints.enabled)
      viteInlineConfig.plugins.push(vuetifySSRClientHintsPlugin(ctx))
  })
}
