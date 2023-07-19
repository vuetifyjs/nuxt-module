import type { Plugin } from 'vite'
import type { ComponentName, Directives, LabComponentName, LabComponents, VOptions } from '../types'
import type { VuetifyComponentsImportMap } from '../utils/module'
import { RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION, VIRTUAL_VUETIFY_CONFIGURATION } from './constants'

interface ImportsResult {
  imports: string
  components: string
  aliases: string
  directives: string
  messages: string
}

export function vuetifyConfigurationPlugin(
  isDev: boolean,
  i18n: boolean,
  directives: Directives,
  labComponents: LabComponents,
  vuetifyAppOptions: VOptions,
  componentsPromise: Promise<VuetifyComponentsImportMap>,
  labComponentsPromise: Promise<VuetifyComponentsImportMap>,
  logger: ReturnType<typeof import('@nuxt/kit')['useLogger']>,
) {
  const {
    directives: _directives,
    date: _date,
    icons: _icons,
    localeMessages,
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

        const result = await buildConfiguration()
        const deepCopy = result.messages.length > 0

        return `${result.imports}

export const isDev = ${isDev}
export function vuetifyConfiguration() {
  const options = JSON.parse('${JSON.stringify(newVuetifyOptions)}')
  ${result.directives}
  ${result.aliases}
  ${result.components}
  ${result.messages}
  return options
}
${deepCopy
  ? `function deepCopy(src,des) {
    for (const key in src) {
      if (typeof src[key] === 'object') {
        if (!typeof des[key] === 'object') des[key] = {}
        deepCopy(src[key], des[key])
      } else {
        des[key] = src[key]
      }
    }
    return des
  }
  `
  : ''
}
`
      }
    },
  }

  async function buildConfiguration() {
    const dateOptions = vuetifyAppOptions.date
    const config: {
      directives: string
      imports: string[]
      aliasEntries: string[]
      aliases: Record<string, ComponentName>
      components: Set<ComponentName>
      labComponents: Set<LabComponentName | '*'>
      messages: string
    } = {
      directives: '',
      imports: [],
      aliasEntries: [],
      aliases: aliases || {},
      components: new Set(components ? (Array.isArray(components) ? components : [components]) : []),
      labComponents: new Set(),
      messages: '',
    }

    // directives
    if (directives) {
      if (typeof directives === 'boolean') {
        config.imports.push('import * as directives from \'vuetify/directives\'')
        config.directives = 'options.directives = directives'
      }
      else {
        const useDirectives = Array.isArray(directives) ? [...new Set(...directives)] : [directives]
        config.imports.push(useDirectives.map(d => `import { ${d} } from 'vuetify/directives/${d}'`).join('\n'))
        config.directives = `options.directives = {${useDirectives.join(',')}}`
      }
    }

    // components
    const importMapComponents = await componentsPromise

    const componentsToImport = new Map<string, string[]>()
    config.components.forEach((component) => {
      const { from } = importMapComponents[component]
      if (!from) {
        logger.warn(`Component ${component} not found in Vuetify.`)
        return
      }

      const parts = from.split('/')
      if (parts.length < 2) {
        logger.warn(`Component ${component} not found in Vuetify, please report a new issue.`)
        return
      }

      if (!componentsToImport.has(parts[1]))
        componentsToImport.set(parts[1], [])

      const componentsArray = componentsToImport.get(parts[1])!
      if (!componentsArray.includes(component))
        componentsArray.push(component)
    })

    Object.entries(config.aliases).forEach(([key, component]) => {
      const { from } = importMapComponents[component]
      if (!from) {
        logger.warn(`Component ${component} not found in Vuetify.`)
        return
      }

      const parts = from.split('/')
      if (parts.length < 2) {
        logger.warn(`Component ${component} not found in Vuetify, please report a new issue.`)
        return
      }

      if (!componentsToImport.has(parts[1]))
        componentsToImport.set(parts[1], [])

      const componentsArray = componentsToImport.get(parts[1])!
      if (!componentsArray.includes(component))
        componentsArray.push(component)

      config.aliasEntries.push(`'${key}': ${component}`)
    })

    componentsToImport.forEach((componentsArray, from) => {
      config.imports.push(`import {${componentsArray.join(',')}} from 'vuetify/components/${from}'`)
    })

    // lab components
    let addDatePicker = true

    if (labComponents) {
      const useLabComponents: LabComponentName[] = []
      if (typeof labComponents === 'boolean') {
        config.imports.push('import * as labsComponents from \'vuetify/labs/components\'')
        config.labComponents.add('*')
        addDatePicker = false
      }
      else if (typeof labComponents === 'string') {
        useLabComponents.push(labComponents)
      }
      else if (Array.isArray(labComponents)) {
        useLabComponents.push(...labComponents)
      }

      if (useLabComponents.length) {
        componentsToImport.clear()
        const importMapLabComponents = await labComponentsPromise
        useLabComponents.forEach((component) => {
          const { from } = importMapLabComponents[component]
          if (!from) {
            logger.warn(`Lab Component ${component} not found in Vuetify.`)
            return
          }

          const parts = from.split('/')
          if (parts.length < 2) {
            logger.warn(`Lab Component ${component} not found in Vuetify, please report a new issue.`)
            return
          }

          if (!componentsToImport.has(parts[1]))
            componentsToImport.set(parts[1], [])

          const componentsArray = componentsToImport.get(parts[1])!
          if (!componentsArray.includes(component))
            componentsArray.push(component)

          config.labComponents.add(component)
        })

        if (dateOptions && !config.labComponents.has('VDatePicker')) {
          const entry = componentsToImport.get('VDatePicker')
          if (entry) {
            entry.push('VDatePicker')
            config.labComponents.add('VDatePicker')
          }
        }

        componentsToImport.forEach((componentsArray, from) => {
          config.imports.push(`import {${componentsArray.join(',')}} from 'vuetify/labs/${from}'`)
        })
        addDatePicker = !config.labComponents.has('VDatePicker')
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
          componentsEntry = `options.components = {${Array.from(config.components).join(',')},...labsComponents}`
        else
          componentsEntry = `options.components = {${Array.from(config.components).join(',')},${Array.from(config.labComponents).join(',')}}`
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

    if (/*! i18n && */localeMessages) {
      const useLocales = Array.isArray(localeMessages) ? [...new Set([...localeMessages])] : [localeMessages]
      config.imports.push(`import {${useLocales.join(',')}} from 'vuetify/locale'`)
      config.messages = `
  options.locale = options.locale || {}
  options.locale.messages = options.locale.messages || {}
${useLocales.map((locale) => {
  return `
  if ('${locale}' in options.locale.messages)
    options.locale.messages['${locale}'] = deepCopy(options.locale.messages['${locale}'],${locale})
  else
    options.locale.messages['${locale}'] = ${locale}
`
}).join('')}
`
    }

    return <ImportsResult>{
      imports: config.imports.length ? config.imports.join('\n') : '',
      components: componentsEntry,
      aliases: config.aliasEntries.length ? `options.aliases = {${config.aliasEntries.join(',')}}` : '',
      directives: config.directives,
      messages: config.messages,
    }
  }
}
