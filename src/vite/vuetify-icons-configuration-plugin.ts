import type { Plugin } from 'vite'
import type { VuetifyOptions } from 'vuetify'
import type { ResolvedIcons } from '../utils/icons'
import type { IconSetName, IconsOptions } from '../types'
import {
  RESOLVED_VIRTUAL_VUETIFY_ICONS_CONFIGURATION,
  VIRTUAL_VUETIFY_ICONS_CONFIGURATION,
} from './constants'

export function vuetifyIconsPlugin(
  isDev: boolean,
  vuetifyAppOptions: VuetifyOptions,
  resolvedIcons: ResolvedIcons,
) {
  const iconsOptionsPromise = prepareIcons()

  return <Plugin>{
    name: 'vuetify:icons-configuration:nuxt',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_VUETIFY_ICONS_CONFIGURATION)
        return RESOLVED_VIRTUAL_VUETIFY_ICONS_CONFIGURATION
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_VUETIFY_ICONS_CONFIGURATION) {
        if (!resolvedIcons.enabled) {
          return `export const isDev = ${isDev}
export function configureIcons(vuetifyOptions) {
  vuetifyOptions.icons = { defaultSet: undefined }
}
`
        }
        const { imports, icons } = await iconsOptionsPromise

        return `${imports}

export const isDev = ${isDev}
export function configureIcons(vuetifyOptions) {
  console.log('${icons.defaultSet}')
  // vuetifyOptions.icons = ${JSON.stringify(icons)}
}
`
      }
    },
  }

  function buildImports(defaultSet: IconSetName) {
    const imports: string[] = []

    return imports.join('\n')
  }

  async function prepareIcons() {
    if (!resolvedIcons.enabled) {
      return {
        imports: '',
        icons: {
          defaultSet: 'mdi',
        },
      }
    }

    const { icons = {} } = vuetifyAppOptions
    let defaultSet = vuetifyAppOptions.icons?.defaultSet
    if (!defaultSet && vuetifyAppOptions.icons?.defaultSet?.length)
      defaultSet = vuetifyAppOptions.icons.defaultSet[0]

    icons.defaultSet = defaultSet || 'mdi'

    if (!icons.sets)
      icons.sets = {}

    return <{
      icons: IconsOptions
      imports: string
    }>{
      icons,
      imports: buildImports(icons.defaultSet as IconSetName),
    }
  }
}
