import { isPackageExists } from 'local-pkg'
import type { IconSetName, VOptions } from '../types'

export interface ResolvedIcons {
  enabled: boolean
  defaultSet?: IconSetName
  sets: string[]
  cdn: string[]
  local: string[]
  aliases: string[]
  imports: Record<string, string[]>
  svg: {
    mdi?: boolean
    fa?: string[]
  }
}

export const cssFonts: IconSetName[] = ['mdi', 'md', 'fa', 'fa4']

const iconsPackageNames: Record<IconSetName, { name: string; css: string }> = {
  mdi: { name: '@mdi/font', css: '@mdi/font/css/materialdesignicons.css' },
  md: { name: 'material-design-icons-iconfont', css: '@mdi/font/css/materialdesignicons.css' },
  fa: { name: '@fortawesome/fontawesome-free', css: '@fortawesome/fontawesome-free/css/all.css' },
  fa4: { name: 'font-awesome@4.7.0', css: 'font-awesome/css/font-awesome.min.css' },
}

const iconsCDN: Record<IconSetName, string> = {
  mdi: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css',
  md: 'https://fonts.googleapis.com/css?family=Material+Icons',
  fa: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css',
  fa4: 'https://cdn.jsdelivr.net/npm/font-awesome@4.x/css/font-awesome.min.css',
}

export function prepareIcons(
  logger: ReturnType<typeof import('@nuxt/kit')['useLogger']>,
  vuetifyOptions: VOptions,
): ResolvedIcons {
  // TODO: handle blueprint icons
  if (vuetifyOptions.icons === false)
    return { enabled: false }

  vuetifyOptions.icons = vuetifyOptions.icons ?? {}

  let { defaultSet = 'mdi', sets } = vuetifyOptions.icons

  if (!defaultSet)
    defaultSet = vuetifyOptions.icons.defaultSet = 'mdi'

  if (!sets)
    sets = [{ name: defaultSet || 'mdi' }]

  const resolvedIcons: ResolvedIcons = {
    enabled: true,
    defaultSet,
    sets: [],
    aliases: [],
    imports: [],
    cdn: [],
    local: [],
    svg: {
      mdi: false,
    },
  }

  sets.filter(s => cssFonts.includes(s.name)).map(s => s.name).forEach((name) => {
    resolvedIcons.imports.push(`import {${name === defaultSet ? 'aliases,' : ''}${name}} from \'vuetify/iconsets/${name}\'`)
    resolvedIcons.sets.push(name)
    if (isPackageExists(iconsPackageNames[name].name))
      resolvedIcons.local!.push(iconsPackageNames[name].css)
    else
      resolvedIcons.cdn!.push(iconsCDN[name])
  })

  let faSvg = vuetifyOptions.icons.svg?.fa
  if (defaultSet === 'fa-svg' || faSvg) {
    let faSvgExists = isPackageExists('@fortawesome/fontawesome-svg-core')
    if (!faSvgExists)
      logger.warn('Missing @fortawesome/fontawesome-svg-core dependency, install it!')

    faSvgExists = isPackageExists('@fortawesome/vue-fontawesome')
    if (faSvgExists) {
      if (!faSvg?.libraries?.length) {
        faSvg = faSvg || {}
        faSvg.libraries = [[false, 'fas', '@fortawesome/free-solid-svg-icons']]
      }

      for (const p in faSvg.libraries) {
        const [_defaultExport, _name, library] = faSvg.libraries[p]
        faSvgExists = isPackageExists(library)
        if (!faSvgExists)
          logger.warn(`Missing library ${library} dependency, install it!`)
      }
    }
    else {
      logger.warn('Missing @fortawesome/vue-fontawesome dependency, install it!')
    }

    if (faSvgExists) {
      resolvedIcons.imports.push(`import {${defaultSet === 'fa-svg' ? 'aliases,' : ''}fa} from \'vuetify/iconsets/fa-svg\'`)
      resolvedIcons.imports.push('import { library } from \'@fortawesome/fontawesome-svg-core\'')
      resolvedIcons.imports.push('import { FontAwesomeIcon } from \'@fortawesome/vue-fontawesome\'')
      resolvedIcons.imports.push('import { useNuxtApp } from \'#app\'')
      resolvedIcons.svg.fa = ['useNuxtApp().vueApp.component(\'font-awesome-icon\', FontAwesomeIcon)']
      faSvg.libraries.forEach(([defaultExport, name, library]) => {
        resolvedIcons.imports.push(`import ${defaultExport ? name : `{${name}}`} from \'${library}\'`)
        resolvedIcons.svg.fa.push(`library.add(${name})`)
      })
      resolvedIcons.sets.push('fa')
      if (defaultSet === 'fa-svg')
        resolvedIcons.defaultSet = 'fa'
    }
  }

  const mdiSvg = vuetifyOptions.icons.svg?.mdi
  if (defaultSet === 'mdi-svg' || mdiSvg) {
    const mdiSvgExists = isPackageExists('@mdi/js')
    if (mdiSvgExists) {
      resolvedIcons.svg!.mdi = true
      resolvedIcons.imports.push(`import {${defaultSet === 'mdi-svg' ? 'aliases,' : ''}mdi} from \'vuetify/iconsets/mdi-svg\'`)
      if (mdiSvg && mdiSvg.aliases) {
        resolvedIcons.imports.push(`import {${Object.values(mdiSvg.aliases).join(',')}} from \'@mdi/js\'`)
        Object.entries(mdiSvg.aliases).forEach(([alias, icon]) => {
          resolvedIcons.aliases.push(`${alias}: ${icon}`)
        })
      }
      resolvedIcons.sets.push('mdi')
      if (defaultSet === 'mdi-svg')
        resolvedIcons.defaultSet = 'mdi'
    }
    else {
      resolvedIcons.svg!.mdi = false
      logger.warn('Missing @mdi/js dependency, install it!')
    }
  }

  if (!resolvedIcons.local?.length && !resolvedIcons.cdn?.length && !resolvedIcons.svg?.mdi && !resolvedIcons.svg?.fa?.length) {
    logger.warn('No icons found, icons disabled!')
    return { enabled: false }
  }

  return resolvedIcons
}
