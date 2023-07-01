import type { Plugin } from 'vite'
import type { VuetifyOptions } from 'vuetify'
import type { BooleanOrArrayString } from './types'

interface ImportsResult {
  imports: string
  expression: string
}

export function vuetifyConfigurationPlugin(
  isDev: boolean,
  directives: BooleanOrArrayString,
  labComponents: BooleanOrArrayString,
  vuetifyAppOptions: VuetifyOptions,
) {
  const VIRTUAL_VUETIFY_CONFIGURATION = 'virtual:vuetify-configuration'
  const RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION = `\0${VIRTUAL_VUETIFY_CONFIGURATION}`

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
        const labsComponentsResult = builLabsComponents()

        return `${directivesResult.imports}
${labsComponentsResult.imports}

export const isDev = ${isDev}
export function vuetifyConfiguration() {
  const options = ${JSON.stringify(vuetifyAppOptions)}
  ${directivesResult.expression}
  ${labsComponentsResult.expression}
  return options
}
`
      }
    },
  }

  function builLabsComponents() {
    if (!labComponents)
      return <ImportsResult>{ imports: '', expression: '' }

    if (typeof labComponents === 'boolean') {
      return <ImportsResult>{
        imports: 'import * as labsComponents from \'vuetify/labs/components\'',
        expression: 'options.components = labsComponents',
      }
    }
    else {
      return <ImportsResult>{
        imports: `${labComponents.map(d => `import { ${d} } from 'vuetify/labs/${d}'`).join('\n')}`,
        expression: `options.components = {${labComponents.join(',')}}`,
      }
    }
  }

  function buildDirectives() {
    if (!labComponents)
      return <ImportsResult>{ imports: '', expression: '' }

    if (typeof labComponents === 'boolean') {
      return <ImportsResult>{
        imports: 'import * as labsComponents from \'vuetify/labs/components\'',
        expression: 'options.components = labsComponents',
      }
    }
    else {
      return <ImportsResult>{
        imports: `${labComponents.map(d => `import { ${d} } from 'vuetify/labs/${d}'`).join('\n')}`,
        expression: `options.components = {${labComponents.join(',')}}`,
      }
    }
  }
}
