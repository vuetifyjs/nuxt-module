import type { Plugin } from 'vite'
import type { VuetifyOptions } from 'vuetify'
import type { BooleanOrArrayString } from './types'

interface PromiseResult {
  imports: string
  expression: string
}

const VUETIFY_CONFIGURATION_PLUGIN = 'virtual:vuetify-configuration'
const RESOLVED_VUETIFY_CONFIGURATION_PLUGIN = `\0${VUETIFY_CONFIGURATION_PLUGIN}`

export function vuetifyConfigurationPlugin(
  directives: BooleanOrArrayString,
  labComponents: BooleanOrArrayString,
  vuetifyAppOptions: VuetifyOptions,
) {
  const directivesPromise = new Promise<PromiseResult>((resolve) => {
    if (!directives)
      return resolve({ imports: '', expression: '' })

    if (typeof directives === 'boolean') {
      resolve({
        imports: 'import * as directives from \'vuetify/directives\'',
        expression: 'options.directives = directives',
      })
    }
    else {
      resolve({
        imports: `import { ${directives.join(',')} } from 'vuetify/directives'`,
        expression: `options.directives = {${directives.join(',')}}`,
      })
    }
  })

  const labsComponentsPromise = new Promise<PromiseResult>((resolve) => {
    if (!labComponents)
      return resolve({ imports: '', expression: '' })

    if (typeof labComponents === 'boolean') {
      resolve({
        imports: 'import * as components from \'vuetify/labs/components\'',
        expression: 'options.components = components',
      })
    }
    else {
      resolve({
        imports: `import { ${labComponents.join(',')} } from 'vuetify/labs/components'`,
        expression: `options.components = {${labComponents.join(',')}}`,
      })
    }
  })

  return <Plugin>{
    name: 'vuetify-nuxt-configuration',
    enforce: 'pre',
    resolveId(id) {
      if (id === VUETIFY_CONFIGURATION_PLUGIN)
        return RESOLVED_VUETIFY_CONFIGURATION_PLUGIN
    },
    async load(id) {
      if (id === RESOLVED_VUETIFY_CONFIGURATION_PLUGIN) {
        const [directivesResult, labsComponentsResult] = await Promise.all([
          directivesPromise,
          labsComponentsPromise,
        ])

        return `${directivesResult.imports}
${labsComponentsResult.imports}
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
}
