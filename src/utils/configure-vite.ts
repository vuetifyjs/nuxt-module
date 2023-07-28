import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import vuetify from 'vite-plugin-vuetify'
import { vuetifyStylesPlugin } from '../vite/vuetify-styles-plugin'
import { vuetifyConfigurationPlugin } from '../vite/vuetify-configuration-plugin'
import { vuetifyIconsPlugin } from '../vite/vuetify-icons-configuration-plugin'
import { vuetifyDateConfigurationPlugin } from '../vite/vuetify-date-configuration-plugin'
import { checkVuetifyPlugins } from './module'
import type { VuetifyNuxtContext } from './config'

export function configureVite(configKey: string, nuxt: Nuxt, ctx: VuetifyNuxtContext) {
  nuxt.hook('vite:extend', ({ config }) => checkVuetifyPlugins(config))
  nuxt.hook('vite:extendConfig', (viteInlineConfig) => {
    viteInlineConfig.plugins = viteInlineConfig.plugins || []
    checkVuetifyPlugins(viteInlineConfig)

    viteInlineConfig.optimizeDeps = defu(viteInlineConfig.optimizeDeps, { exclude: ['vuetify'] })

    viteInlineConfig.ssr ||= {}
    viteInlineConfig.ssr.noExternal = [
      ...(Array.isArray(viteInlineConfig.ssr.noExternal) ? viteInlineConfig.ssr.noExternal : []),
      configKey,
    ]

    viteInlineConfig.plugins.push(vuetify({ styles: true, autoImport: true }))
    viteInlineConfig.plugins.push(vuetifyStylesPlugin({ styles: ctx.moduleOptions.styles }, ctx.logger))
    viteInlineConfig.plugins.push(vuetifyConfigurationPlugin(ctx))
    viteInlineConfig.plugins.push(vuetifyIconsPlugin(ctx))
    viteInlineConfig.plugins.push(vuetifyDateConfigurationPlugin(ctx))
  })
}
