import type { VuetifyNuxtContext } from '../utils/config'
import type { Plugin } from 'vite'
import { resolveDateFnsLocaleName } from '../utils/date-fns-locale'
import { RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION, VIRTUAL_VUETIFY_DATE_CONFIGURATION } from './constants'

export function vuetifyDateConfigurationPlugin (ctx: VuetifyNuxtContext) {
  return <Plugin>{
    name: 'vuetify:date-configuration:nuxt',
    enforce: 'pre',
    resolveId (id) {
      if (id === VIRTUAL_VUETIFY_DATE_CONFIGURATION) {
        return RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION
      }
    },
    async load (id) {
      if (id === RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION) {
        // Client-graph only; no dev-SSR edge, so adapter changes need a restart.
        if (ctx.isDev && ctx.canHmrConfig) {
          for (const file of ctx.vuetifyFilesToWatch) {
            this.addWatchFile(file)
          }
        }
        if (!ctx.dateAdapter) {
          return `
export const enabled = false
export const isDev = ${ctx.isDev}
export const i18n = ${ctx.i18n}
export const adapter = 'custom'
export function dateConfiguration() {
  return {}
}
`
        }

        if (ctx.dateAdapter === 'string' && !ctx.vuetifyGte('3.9.0')) {
          throw new Error('[vuetify-nuxt-module] The "string" date adapter requires Vuetify 3.9.0 or newer.')
        }

        const { adapter: _adapter, ...newDateOptions } = ctx.vuetifyOptions.date ?? {}

        let dateFnsLocale: string | undefined
        if (ctx.dateAdapter === 'date-fns') {
          const resolved = resolveDateFnsLocaleName(ctx.vuetifyOptions.locale?.locale)
          dateFnsLocale = resolved.name
          if (resolved.fallback) {
            ctx.logger.warn(`[vuetify-nuxt-module] date-fns locale for "${ctx.vuetifyOptions.locale?.locale ?? '(unset)'}" not found, falling back to "enUS". Set "vuetifyOptions.locale.locale" to a supported locale.`)
          }
        }

        return `${buildImports(dateFnsLocale)}
export const enabled = true
export const isDev = ${ctx.isDev}
export const i18n = ${ctx.i18n}
export const adapter = '${ctx.dateAdapter}'
export function dateConfiguration() {
  const options = JSON.parse('${JSON.stringify(newDateOptions)}')
  ${buildAdapter(dateFnsLocale)}
  return options
}
`
      }
    },
  }

  function buildAdapter (dateFnsLocale?: string) {
    if (ctx.dateAdapter === 'custom' || (ctx.dateAdapter === 'vuetify' && ctx.vuetifyGte('3.4.0'))) {
      return ''
    }

    if (ctx.dateAdapter === 'vuetify') {
      return 'options.adapter = VuetifyDateAdapter'
    }

    if (ctx.dateAdapter === 'date-fns') {
      return `options.adapter = new Adapter({ locale: ${dateFnsLocale} })`
    }

    if (ctx.dateAdapter === 'string') {
      return 'options.adapter = new StringDateAdapter(options)'
    }

    return 'options.adapter = Adapter'
  }

  function buildImports (dateFnsLocale?: string) {
    if (ctx.dateAdapter === 'custom' || (ctx.dateAdapter === 'vuetify' && ctx.vuetifyGte('3.4.0'))) {
      return ''
    }

    if (ctx.dateAdapter === 'vuetify') {
      return 'import { VuetifyDateAdapter } from \'vuetify/labs/date/adapters/vuetify\''
    }

    if (ctx.dateAdapter === 'string') {
      return 'import { StringDateAdapter } from \'vuetify/labs/date/adapters/string\''
    }

    const imports = [`import Adapter from '@date-io/${ctx.dateAdapter}'`]
    if (ctx.dateAdapter === 'date-fns') {
      imports.push(`import { ${dateFnsLocale} } from 'date-fns/locale'`)
    }

    return imports.join('\n')
  }
}
