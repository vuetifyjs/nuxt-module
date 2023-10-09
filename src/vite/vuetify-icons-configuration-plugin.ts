import type { Plugin } from 'vite'
import type { VuetifyNuxtContext } from '../utils/config'
import {
  RESOLVED_VIRTUAL_VUETIFY_ICONS_CONFIGURATION,
  VIRTUAL_VUETIFY_ICONS_CONFIGURATION,
} from './constants'

export function vuetifyIconsPlugin(ctx: VuetifyNuxtContext) {
  return <Plugin>{
    name: 'vuetify:icons-configuration:nuxt',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_VUETIFY_ICONS_CONFIGURATION)
        return RESOLVED_VIRTUAL_VUETIFY_ICONS_CONFIGURATION
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_VUETIFY_ICONS_CONFIGURATION) {
        const {
          enabled,
          unocss,
          aliases,
          fa,
          defaultSet,
          imports,
          sets,
        } = await prepareIcons()
        if (!enabled) {
          // no idea how to disable icons in vuetify
          return `export const enabled = false
export const isDev = ${ctx.isDev}
export function iconsConfiguration() {
  return {}
}
`
        }

        if (!defaultSet) {
          return `export const enabled = true
export const isDev = ${ctx.isDev}
export function iconsConfiguration() {
  return {}
}
`
        }

        return `${imports}
export const enabled = true
export const isDev = ${ctx.isDev}
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
    enabled: boolean
    fa: string[]
    unocss: string
    defaultSet?: string
    imports: string
    sets: string
    aliases: string
  }> {
    if (!ctx.icons.enabled) {
      return {
        enabled: false,
        unocss: '',
        defaultSet: undefined,
        imports: '',
        sets: '',
        aliases: '',
        fa: [],
      }
    }

    let aliases = 'aliases,'
    if (!ctx.icons.aliasesImportPresent || (ctx.vuetifyOptions.icons && ctx.vuetifyOptions.icons.defaultSet === 'custom')) {
      aliases = ''
    }
    else {
      const alias = ctx.icons.aliases
      if (alias.length) {
        aliases = `aliases: {
      ...aliases,
      ${alias.join(',\n')}
    },
`
      }
    }

    let unocss = ''

    if (ctx.icons.unocss && ctx.icons.unocssAliases) {
      ctx.icons.imports.unshift('// @unocss-include')
      const prefix = `${ctx.icons.unocssIconPrefix}mdi:`
      const {
        collapse = `${prefix}chevron-up`,
        complete = `${prefix}check`,
        cancel = `${prefix}close-circle`,
        close = `${prefix}close`,
        // delete (e.g. v-chip close)
        clear = `${prefix}close-circle`,
        success = `${prefix}check-circle`,
        info = `${prefix}information`,
        warning = `${prefix}alert-circle`,
        error = `${prefix}close-circle`,
        prev = `${prefix}chevron-left`,
        next = `${prefix}chevron-right`,
        checkboxOn = `${prefix}checkbox-marked`,
        checkboxOff = `${prefix}checkbox-blank-outline`,
        checkboxIndeterminate = `${prefix}minus-box`,
        delimiter = `${prefix}circle`,
        // for carousel
        sortAsc = `${prefix}arrow-up`,
        sortDesc = `${prefix}arrow-down`,
        expand = `${prefix}chevron-down`,
        menu = `${prefix}menu`,
        subgroup = `${prefix}menu-down`,
        dropdown = `${prefix}menu-down`,
        radioOn = `${prefix}radiobox-marked`,
        radioOff = `${prefix}radiobox-blank`,
        edit = `${prefix}pencil`,
        ratingEmpty = `${prefix}star-outline`,
        ratingFull = `${prefix}star`,
        ratingHalf = `${prefix}star-half-full`,
        loading = `${prefix}cached`,
        first = `${prefix}page-first`,
        last = `${prefix}page-last`,
        unfold = `${prefix}unfold-more-horizontal`,
        file = `${prefix}paperclip`,
        plus = `${prefix}plus`,
        minus = `${prefix}minus`,
        calendar = `${prefix}calendar`,
      } = ctx.icons.unocssIcons
      const useIcons: Record<string, string> = {
        collapse,
        complete,
        cancel,
        close,
        delete: ctx.icons.unocssIcons.delete ?? `${prefix}close-circle`,
        clear,
        success,
        info,
        warning,
        error,
        prev,
        next,
        checkboxOn,
        checkboxOff,
        checkboxIndeterminate,
        delimiter,
        sortAsc,
        sortDesc,
        expand,
        menu,
        subgroup,
        dropdown,
        radioOn,
        radioOff,
        edit,
        ratingEmpty,
        ratingFull,
        ratingHalf,
        loading,
        first,
        last,
        unfold,
        file,
        plus,
        minus,
        calendar,
      }
      Object.entries(ctx.icons.unocssAdditionalIcons).forEach(([key, value]) => {
        useIcons[key] = value
      })
      unocss = `const aliases = JSON.parse('${JSON.stringify(useIcons)}');
`
    }

    return {
      enabled: true,
      unocss,
      fa: ctx.icons.svg?.fa ?? [],
      defaultSet: ctx.icons.defaultSet,
      imports: Object.values(ctx.icons.imports).join('\n'),
      sets: ctx.icons.sets.join(','),
      aliases,
    }
  }
}
