import type { Plugin } from 'vite'
import type { DateAdapter, DateOptions } from '../types'
import { RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION, VIRTUAL_VUETIFY_DATE_CONFIGURATION } from './constants'

export function vuetifyDateConfigurationPlugin(
  isDev: boolean,
  i18n: boolean,
  dateAdapter: DateAdapter,
  dateOptions: DateOptions,
) {
  const { adapter: _adapter, ...newDateOptions } = dateOptions
  return <Plugin>{
    name: 'vuetify:date-configuration:nuxt',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_VUETIFY_DATE_CONFIGURATION)
        return RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION) {
        const imports = dateAdapter === 'vuetify'
          ? 'import { VuetifyDateAdapter } from \'vuetify/labs/date/adapters/vuetify\''
          : dateAdapter === 'custom'
            ? ''
            : `import Adapter from '@date-io/${dateAdapter}'`

        return `${imports}
export const isDev = ${isDev}
export const i18n = ${i18n}
export const adapter = '${dateAdapter}'
export function dateConfiguration() {
  const options = ${JSON.stringify(newDateOptions)}
  ${buildAdapter(dateAdapter)}
  return options
}
`
      }
    },
  }
}

function buildAdapter(dateAdapter: DateAdapter) {
  if (dateAdapter === 'custom')
    return ''

  if (dateAdapter === 'vuetify')
    return 'options.adapter = VuetifyDateAdapter'

  return 'options.adapter = Adapter'
}
