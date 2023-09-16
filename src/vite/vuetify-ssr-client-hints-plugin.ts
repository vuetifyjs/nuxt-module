import type { Plugin } from 'vite'
import type { VuetifyNuxtContext } from '../utils/config'
import {
  RESOLVED_VIRTUAL_VUETIFY_SSR_CLIENT_HINTS_CONFIGURATION,
  VIRTUAL_VUETIFY_SSR_CLIENT_HINTS_CONFIGURATION,
} from './constants'

export function vuetifySSRClientHintsPlugin(ctx: VuetifyNuxtContext) {
  return <Plugin>{
    name: 'vuetify:ssr-client-hints:nuxt',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_VUETIFY_SSR_CLIENT_HINTS_CONFIGURATION)
        return RESOLVED_VIRTUAL_VUETIFY_SSR_CLIENT_HINTS_CONFIGURATION
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_VUETIFY_SSR_CLIENT_HINTS_CONFIGURATION) {
        const data: Record<string, any> = {
          viewportSize: ctx.ssrClientHints.viewportSize,
          prefersColorScheme: ctx.ssrClientHints.prefersColorScheme,
          prefersReducedMotion: ctx.ssrClientHints.prefersReducedMotion,
          clientWidth: ctx.vuetifyOptions.ssr?.clientWidth,
          clientHeight: ctx.vuetifyOptions.ssr?.clientHeight,
        }

        return `export function clientHintsConfiguration() { return JSON.parse('${JSON.stringify(data)}') }`
      }
    },
  }
}
