import type { Plugin } from 'vite'
import type { ComponentName, Directives, LabComponentName, LabComponents, VOptions } from '../types'
import { RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION, VIRTUAL_VUETIFY_CONFIGURATION } from './constants'

interface ImportsResult {
  imports: string
  components: string
  aliases: string
  directives: string
}

export function vuetifyConfigurationPlugin(
  isDev: boolean,
  i18n: boolean,
  directives: Directives,
  labComponents: LabComponents,
  vuetifyAppOptions: VOptions,
) {
  const {
    directives: _directives,
    date: _date,
    icons: _icons,
    components,
    aliases,
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
        // remove i18n stuff: we don't need to send it to the client
        if (i18n && newVuetifyOptions.locale) {
          delete newVuetifyOptions.locale.rtl
          delete newVuetifyOptions.locale.locale
          delete newVuetifyOptions.locale.fallback
        }

        const result = buildConfiguration()

        return `${result.imports}

export const isDev = ${isDev}
export function vuetifyConfiguration() {
  const options = JSON.parse('${JSON.stringify(newVuetifyOptions)}')
  ${result.directives}
  ${result.aliases}
  ${result.components}
  return options
}
`
      }
    },
  }

  function buildConfiguration() {
    const dateOptions = vuetifyAppOptions.date
    const config: {
      directives: string
      imports: string[]
      aliasEntries: string[]
      aliases: Record<string, ComponentName>
      components: Set<ComponentName>
      labComponents: Set<LabComponentName | '*'>
    } = {
      directives: '',
      imports: [],
      aliasEntries: [],
      aliases: aliases || {},
      components: new Set(components ? (Array.isArray(components) ? components : [components]) : []),
      labComponents: new Set(),
    }

    // directives
    if (typeof directives === 'boolean') {
      config.imports.push('import * as directives from \'vuetify/directives\'')
      config.directives = 'options.directives = directives'
    }
    else {
      const useDirectives = Array.isArray(directives) ? directives : [directives]
      config.imports.push(useDirectives.map(d => `import { ${d} } from 'vuetify/directives/${d}'`).join('\n'))
      config.directives = `options.directives = {${useDirectives.join(',')}}`
    }

    // components
    config.imports.push(...Array.from(config.components).map(c => `import {${c}} from 'vuetify/components/${c}'`))

    // aliases
    Object.entries(config.aliases).forEach(([key, component]) => {
      if (!config.components.has(component)) {
        config.components.add(component)
        config.imports.push(`import {${component}} from 'vuetify/components/${component}'`)
      }
      config.aliasEntries.push(`'${key}': ${component}`)
    })

    // lab components
    let addDatePicker = true

    if (labComponents) {
      if (typeof labComponents === 'boolean') {
        config.imports.push('import * as labsComponents from \'vuetify/labs/components\'')
        config.labComponents.add('*')
        addDatePicker = false
      }
      else if (Array.isArray(labComponents)) {
        labComponents.forEach((labComponent) => {
          if (!config.labComponents.has(labComponent)) {
            config.labComponents.add(labComponent)
            config.imports.push(`import {${labComponent}} from 'vuetify/labs/${labComponent}'`)
          }
        })
        addDatePicker = !config.labComponents.has('VDatePicker')
      }
      else {
        config.imports.push(`import {${labComponents}} from 'vuetify/labs/${labComponents}'`)
        config.labComponents.add(labComponents)
        addDatePicker = labComponents !== 'VDatePicker'
      }
    }

    // include date picker only when needed
    if (dateOptions && addDatePicker) {
      config.imports.push('import {VDatePicker} from \'vuetify/labs/VDatePicker\'')
      config.labComponents.add('VDatePicker')
    }

    // components entry
    let componentsEntry = ''
    if (config.components.size) {
      if (config.labComponents.size) {
        if (config.labComponents.has('*'))
          componentsEntry = `options.components = {...labsComponents,${Array.from(config.components).join(',')}}`
        else
          componentsEntry = `options.components = {${Array.from(config.labComponents).join(',')},${Array.from(config.components).join(',')}}`
      }
      else {
        componentsEntry = `options.components = {${Array.from(config.components).join(',')}}`
      }
    }
    else if (config.labComponents.size) {
      if (config.labComponents.has('*'))
        componentsEntry = 'options.components = {...labsComponents}'
      else
        componentsEntry = `options.components = {${Array.from(config.labComponents).join(',')}}`
    }

    return <ImportsResult>{
      imports: config.imports.length ? config.imports.join('\n') : '',
      components: componentsEntry,
      aliases: config.aliasEntries.length ? `options.aliases = {${config.aliasEntries.join(',')}}` : '',
      directives: config.directives,
    }
  }
}
