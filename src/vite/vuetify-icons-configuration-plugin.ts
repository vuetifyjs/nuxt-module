import type { Plugin } from 'vite'
import type { ResolvedIcons } from '../utils/icons'
import {
  RESOLVED_VIRTUAL_VUETIFY_ICONS_CONFIGURATION,
  VIRTUAL_VUETIFY_ICONS_CONFIGURATION,
} from './constants'

export function vuetifyIconsPlugin(
  isDev: boolean,
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
          // no idea how to disable icons in vuetify
          return `export const isDev = ${isDev}
export function iconsConfiguration() {
  return { defaultSet: undefined }
}
`
        }

        const { unocss, aliases, fa, defaultSet, imports, sets } = await iconsOptionsPromise

        if (!defaultSet) {
          return `export const isDev = ${isDev}
export function iconsConfiguration() {
  return { defaultSet: undefined }
}
`
        }

        return `${imports}
export const isDev = ${isDev}
export function iconsConfiguration() {
${fa.map(f => `  ${f}`).join('\n')}
  return {
    defaultSet: '${defaultSet}',
    ${aliases}
    sets: { ${sets} }
  }
}
${unocss}
`
      }
    },
  }

  async function prepareIcons(): Promise<{
    fa: string[]
    unocss: string
    defaultSet?: string
    imports: string
    sets: string
    aliases: string
  }> {
    if (!resolvedIcons.enabled) {
      return {
        unocss: '',
        defaultSet: undefined,
        imports: '',
        sets: '',
        aliases: '',
        fa: [],
      }
    }

    let aliases = 'aliases,'
    const alias = resolvedIcons.aliases
    if (alias.length) {
      aliases = `aliases: {
      ...aliases,
      ${alias.join(',\n')}
    },
`
    }

    let unocss = ''

    if (resolvedIcons.unocss && resolvedIcons.unocssAliases) {
      resolvedIcons.imports.unshift('// @unocss-include')
      unocss = `const aliases = ${JSON.stringify({
  collapse: 'i-mdi:chevron-up',
  complete: 'i-mdi:check',
  cancel: 'i-mdi:close-circle',
  close: 'i-mdi:close',
  delete: 'i-mdi:close-circle',
  // delete (e.g. v-chip close)
  clear: 'i-mdi:close-circle',
  success: 'i-mdi:check-circle',
  info: 'i-mdi:information',
  warning: 'i-mdi:alert-circle',
  error: 'i-mdi:close-circle',
  prev: 'i-mdi:chevron-left',
  next: 'i-mdi:chevron-right',
  checkboxOn: 'i-mdi:checkbox-marked',
  checkboxOff: 'i-mdi:checkbox-blank-outline',
  checkboxIndeterminate: 'i-mdi:minus-box',
  delimiter: 'i-mdi:circle',
  // for carousel
  sortAsc: 'i-mdi:arrow-up',
  sortDesc: 'i-mdi:arrow-down',
  expand: 'i-mdi:chevron-down',
  menu: 'i-mdi:menu',
  subgroup: 'i-mdi:menu-down',
  dropdown: 'i-mdi:menu-down',
  radioOn: 'i-mdi:radiobox-marked',
  radioOff: 'i-mdi:radiobox-blank',
  edit: 'i-mdi:pencil',
  ratingEmpty: 'i-mdi:star-outline',
  ratingFull: 'i-mdi:star',
  ratingHalf: 'i-mdi:star-half-full',
  loading: 'i-mdi:cached',
  first: 'i-mdi:page-first',
  last: 'i-mdi:page-last',
  unfold: 'i-mdi:unfold-more-horizontal',
  file: 'i-mdi:paperclip',
  plus: 'i-mdi:plus',
  minus: 'i-mdi:minus',
  calendar: 'i-mdi:calendar',
  })}
`
    }

    return {
      unocss,
      fa: resolvedIcons.svg?.fa ?? [],
      defaultSet: resolvedIcons.defaultSet,
      imports: Object.values(resolvedIcons.imports).join('\n'),
      sets: resolvedIcons.sets.join(','),
      aliases,
    }
  }
}
