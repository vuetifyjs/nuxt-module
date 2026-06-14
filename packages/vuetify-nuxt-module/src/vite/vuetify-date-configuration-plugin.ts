import type { Plugin } from 'vite'
import type { VuetifyNuxtContext } from '../utils/config'
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
        // Bind the resolved config sources to this virtual module so an edit
        // invalidates it on the client graph in dev. Unlike the main config
        // plugin, we do NOT emit a dev-SSR import edge here, so a change to the
        // date adapter is not re-evaluated by the SSR runtime on the fly (it
        // needs a manual restart).
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

    return 'options.adapter = Adapter'
  }

  function buildImports (dateFnsLocale?: string) {
    if (ctx.dateAdapter === 'custom' || (ctx.dateAdapter === 'vuetify' && ctx.vuetifyGte('3.4.0'))) {
      return ''
    }

    if (ctx.dateAdapter === 'vuetify') {
      return 'import { VuetifyDateAdapter } from \'vuetify/labs/date/adapters/vuetify\''
    }

    const imports = [`import Adapter from '@date-io/${ctx.dateAdapter}'`]
    if (ctx.dateAdapter === 'date-fns') {
      imports.push(`import { ${dateFnsLocale} } from 'date-fns/locale'`)
    }

    return imports.join('\n')
  }
}
