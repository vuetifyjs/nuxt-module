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
      const prefix = `${resolvedIcons.unocssIconPrefix}mdi:`
      unocss = `const aliases = ${JSON.stringify({
  collapse: `${prefix}chevron-up`,
  complete: `${prefix}check`,
  cancel: `${prefix}close-circle`,
  close: `${prefix}close`,
  delete: `${prefix}close-circle`,
  // delete (e.g. v-chip close)
  clear: `${prefix}close-circle`,
  success: `${prefix}check-circle`,
  info: `${prefix}information`,
  warning: `${prefix}alert-circle`,
  error: `${prefix}close-circle`,
  prev: `${prefix}chevron-left`,
  next: `${prefix}chevron-right`,
  checkboxOn: `${prefix}checkbox-marked`,
  checkboxOff: `${prefix}checkbox-blank-outline`,
  checkboxIndeterminate: `${prefix}minus-box`,
  delimiter: `${prefix}circle`,
  // for carousel
  sortAsc: `${prefix}arrow-up`,
  sortDesc: `${prefix}arrow-down`,
  expand: `${prefix}chevron-down`,
  menu: `${prefix}menu`,
  subgroup: `${prefix}menu-down`,
  dropdown: `${prefix}menu-down`,
  radioOn: `${prefix}radiobox-marked`,
  radioOff: `${prefix}radiobox-blank`,
  edit: `${prefix}pencil`,
  ratingEmpty: `${prefix}star-outline`,
  ratingFull: `${prefix}star`,
  ratingHalf: `${prefix}star-half-full`,
  loading: `${prefix}cached`,
  first: `${prefix}page-first`,
  last: `${prefix}page-last`,
  unfold: `${prefix}unfold-more-horizontal`,
  file: `${prefix}paperclip`,
  plus: `${prefix}plus`,
  minus: `${prefix}minus`,
  calendar: `${prefix}calendar`,
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
