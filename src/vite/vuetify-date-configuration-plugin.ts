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

        const imports = ctx.dateAdapter === 'vuetify'
          ? ctx.vuetify3_4 === true
            ? ''
            : 'import { VuetifyDateAdapter } from \'vuetify/labs/date/adapters/vuetify\''
          : ctx.dateAdapter === 'custom'
            ? ''
            : `import Adapter from '@date-io/${ctx.dateAdapter}'`

        return `${imports}
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
    if (ctx.dateAdapter === 'custom')
      return ''

    if (ctx.dateAdapter === 'vuetify')
      return ctx.vuetify3_4 === true ? '' : 'options.adapter = VuetifyDateAdapter'

    return 'options.adapter = Adapter'
  }
}
