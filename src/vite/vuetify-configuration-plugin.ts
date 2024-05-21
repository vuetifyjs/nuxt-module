import type { Plugin } from 'vite'
import type { ComponentName, LabComponentName } from '../types'
import type { VuetifyNuxtContext } from '../utils/config'
import { toKebabCase } from '../utils'
import { RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION, VIRTUAL_VUETIFY_CONFIGURATION } from './constants'

interface ImportsResult {
  imports: string
  components: string
  aliases: string
  directives: string
  messages: string
}

export function vuetifyConfigurationPlugin(ctx: VuetifyNuxtContext) {
  return <Plugin>{
    name: 'vuetify:configuration:nuxt',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_VUETIFY_CONFIGURATION)
        return RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION) {
        const {
          directives: _directives,
          date: _date,
          icons: _icons,
          localeMessages: _localeMessages,
          components: _components,
          labComponents: _labComponents,
          ssr,
          aliases: _aliases,
          ...newVuetifyOptions
        } = ctx.vuetifyOptions
        if (ctx.isSSR)
          (newVuetifyOptions as any).ssr = ssr ?? true
        // remove i18n stuff: we don't need to send it to the client
        if (ctx.i18n && newVuetifyOptions.locale) {
          delete newVuetifyOptions.locale.rtl
          delete newVuetifyOptions.locale.locale
          delete newVuetifyOptions.locale.fallback
        }

        const result = await buildConfiguration(ctx)
        const deepCopy = result.messages.length > 0

        return `${result.imports}

export const isDev = ${ctx.isDev}
export function vuetifyConfiguration() {
  const options = ${JSON.stringify(newVuetifyOptions)}
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
        if (typeof des[key] !== 'object') des[key] = {}
        deepCopy(src[key], des[key])
      } else {
        des[key] = src[key]
      }
    }
  }
  `
  : ''
}
`
      }
    },
  }
}

async function buildConfiguration(ctx: VuetifyNuxtContext) {
  const {
    componentsPromise,
    labComponentsPromise,
    logger,
    vuetifyOptions,
  } = ctx
  const {
    aliases,
    components,
    directives,
    localeMessages,
    labComponents,
    date: dateOptions,
  } = vuetifyOptions
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
      const useDirectives = Array.isArray(directives) ? [...new Set(directives)] : [directives]
      config.imports.push(useDirectives.map(d => `import {${d}} from 'vuetify/directives/${toKebabCase(d)}'`).join('\n'))
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
    config.imports.push(`import {${Array.from(new Set(componentsArray)).join(',')}} from 'vuetify/components/${from}'`)
  })

  // lab components
  let addDatePicker = true

  if (labComponents) {
    const useLabComponents: LabComponentName[] = []
    if (typeof labComponents === 'boolean') {
      config.imports.push('import * as labsComponents from \'vuetify/labs/components\'')
      config.labComponents.add('*')
      if (ctx.vuetify3_4 === false)
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

      if (ctx.vuetify3_4 === false && dateOptions && !addDatePicker) {
        const entry = componentsToImport.get('VDatePicker')
        if (entry) {
          entry.push('VDatePicker')
          // @ts-expect-error VDatePicker is on labs when version < 3.4
          config.labComponents.add('VDatePicker')
          addDatePicker = false
        }
      }

      componentsToImport.forEach((componentsArray, from) => {
        config.imports.push(`import {${Array.from(new Set(componentsArray)).join(',')}} from 'vuetify/labs/${from}'`)
      })
    }
  }

  // include date picker only when needed
  if (dateOptions && addDatePicker) {
    let warn = true
    if (typeof ctx.vuetify3_4 === 'boolean') {
      warn = false
      if (ctx.vuetify3_4) {
        config.components.add('VDatePicker')
        config.imports.push('import {VDatePicker} from \'vuetify/components/VDatePicker\'')
      }
      else {
        // @ts-expect-error VDatePicker is on labs when version < 3.4
        config.labComponents.add('VDatePicker')
        config.imports.push('import {VDatePicker} from \'vuetify/labs/VDatePicker\'')
      }
    }

    warn && logger.warn('Unable to load Vuetify version from package.json, add VDatePicker to components or labComponents')
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

  if (!ctx.i18n && localeMessages) {
    const useLocales = Array.isArray(localeMessages) ? [...new Set([...localeMessages])] : [localeMessages]
    config.imports.push(`import {${useLocales.join(',')}} from 'vuetify/locale'`)
    config.messages = `
  options.locale = options.locale || {}
  options.locale.messages = options.locale.messages || {}
${useLocales.map((locale) => {
      return `
  if ('${locale}' in options.locale.messages)
    deepCopy(options.locale.messages['${locale}'],${locale})

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
