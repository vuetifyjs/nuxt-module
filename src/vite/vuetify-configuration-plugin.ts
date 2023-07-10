import type { Plugin } from 'vite'
import type { Directives, LabComponents, VOptions } from '../types'
import { RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION, VIRTUAL_VUETIFY_CONFIGURATION } from './constants'

interface ImportsResult {
  imports: string
  expression: string
}

export function vuetifyConfigurationPlugin(
  isDev: boolean,
  directives: Directives,
  labComponents: LabComponents,
  vuetifyAppOptions: VOptions,
) {
  // TODO: handle blueprint
  const {
    directives: _directives,
    date: _date,
    icons: _icons,
    ...newVuetifyOptions
  } = vuetifyAppOptions
  return <Plugin>{
    name: 'vuetify:configuration:nuxt',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_VUETIFY_CONFIGURATION)
        return RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION) {
        const directivesResult = buildDirectives()
        const labComponentsResult = buildLabComponents()

        return `${directivesResult.imports}
${labComponentsResult.imports}

export const isDev = ${isDev}
export function vuetifyConfiguration() {
  const options = ${JSON.stringify(newVuetifyOptions)}
  ${directivesResult.expression}
  ${labComponentsResult.expression}
  return options
}
`
      }
    },
  }

  function buildDirectives() {
    if (!directives)
      return <ImportsResult>{ imports: '', expression: '' }

    if (typeof directives === 'boolean') {
      return <ImportsResult>{
        imports: 'import * as directives from \'vuetify/directives\'',
        expression: 'options.directives = directives',
      }
    }
    else {
      const useDirectives = Array.isArray(directives) ? directives : [directives]
      return <ImportsResult>{
        imports: `${useDirectives.map(d => `import { ${d} } from 'vuetify/directives/${d}'`).join('\n')}`,
        expression: `options.directives = {${useDirectives.join(',')}}`,
      }
    }
  }

  function buildLabComponents() {
    const dateOptions = vuetifyAppOptions.date
    if (!labComponents && !dateOptions)
      return <ImportsResult>{ imports: '', expression: '' }

    if (typeof labComponents === 'boolean') {
      return <ImportsResult>{
        imports: 'import * as labsComponents from \'vuetify/labs/components\'',
        expression: 'options.components = labsComponents',
      }
    }
    else {
      const useComponents = Array.isArray(labComponents) ? labComponents : [labComponents]
      const components = [...new Set(dateOptions ? ['VDatePicker', ...useComponents] : useComponents)]
      return <ImportsResult>{
        imports: `${components.map(d => `import { ${d} } from 'vuetify/labs/${d}'`).join('\n')}`,
        expression: `options.components = {${components.join(',')}}`,
      }
    }
  }
}
