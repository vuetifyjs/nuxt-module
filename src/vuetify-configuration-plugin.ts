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
        const labsComponentsResult = buildLabsComponents()

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
      return <ImportsResult>{
        imports: `${directives.map(d => `import { ${d} } from 'vuetify/directives/${d}'`).join('\n')}`,
        expression: `options.directives = {${directives.join(',')}}`,
      }
    }
  }

  function buildLabsComponents() {
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
