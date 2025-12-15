import type { Plugin } from 'vite'
import type { VuetifyNuxtContext } from '../utils/config'
import { RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION, VIRTUAL_VUETIFY_DATE_CONFIGURATION } from './constants'

export function vuetifyDateConfigurationPlugin(ctx: VuetifyNuxtContext) {
  return <Plugin>{
    name: 'vuetify:date-configuration:nuxt',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_VUETIFY_DATE_CONFIGURATION)
        return RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION) {
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

        return `${buildImports()}
export const enabled = true
export const isDev = ${ctx.isDev}
export const i18n = ${ctx.i18n}
export const adapter = '${ctx.dateAdapter}'
export function dateConfiguration() {
  const options = JSON.parse('${JSON.stringify(newDateOptions)}')
  ${buildAdapter()}
  return options
}
`
      }
    },
  }

  function buildAdapter() {
    if (ctx.dateAdapter === 'custom' || (ctx.dateAdapter === 'vuetify' && ctx.isVuetifyAtLeast(3, 4)))
      return ''

    if (ctx.dateAdapter === 'vuetify')
      return 'options.adapter = VuetifyDateAdapter'

    const locale = ctx.vuetifyOptions.locale?.locale ?? 'en'
    if (ctx.dateAdapter === 'date-fns')
      return `options.adapter = new Adapter({ locale: ${locale} })`

    return 'options.adapter = Adapter'
  }

  function buildImports() {
    if (ctx.dateAdapter === 'custom' || (ctx.dateAdapter === 'vuetify' && ctx.isVuetifyAtLeast(3, 4)))
      return ''

    if (ctx.dateAdapter === 'vuetify')
      return 'import { VuetifyDateAdapter } from \'vuetify/labs/date/adapters/vuetify\''

    const imports = [`import Adapter from '@date-io/${ctx.dateAdapter}'`]
    if (ctx.dateAdapter === 'date-fns')
      imports.push(`import { ${ctx.vuetifyOptions.locale?.locale ?? 'en'} } from 'date-fns/locale'`)

    return imports.join('\n')
  }
}
