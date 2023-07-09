import { isPackageExists } from 'local-pkg'
import type { FontAwesomeSvgIconSet, IconSetName, VOptions } from '../types'

export interface ResolvedIcons {
  enabled: boolean
  defaultSet?: IconSetName
  sets: string[]
  cdn: string[]
  local: string[]
  imports: Record<string, string | string[]>
  svg: {
    mdi?: boolean
    fa?: FontAwesomeSvgIconSet['imports']
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
    imports: {},
    cdn: [],
    local: [],
    svg: {
      mdi: false,
    },
  }

  sets.filter(s => cssFonts.includes(s.name)).map(s => s.name).forEach((name) => {
    resolvedIcons.imports[name] = `import {${name === defaultSet ? 'aliases,' : ''}${name}} from \'vuetify/iconsets/${name}\'`
    resolvedIcons.sets.push(name)
    if (isPackageExists(iconsPackageNames[name].name))
      resolvedIcons.local!.push(iconsPackageNames[name].css)
    else
      resolvedIcons.cdn!.push(iconsCDN[name])
  })

  const faSvg = vuetifyOptions.icons.svg?.fa
  if (faSvg) {
    let faSvgExists = isPackageExists('@fortawesome/fontawesome-svg-core')
    if (!faSvgExists)
      logger.warn('Missing @fortawesome/fontawesome-svg-core dependency, install it!')

    faSvgExists = isPackageExists('@fortawesome/vue-fontawesome')
    if (faSvgExists) {
      if (!faSvg.imports?.length)
        faSvg.imports = [['fas', '@fortawesome/free-solid-svg-icons']]

      for (const p in faSvg.imports) {
        const [, pkg] = faSvg.imports[p]
        faSvgExists = isPackageExists(pkg)
        if (!faSvgExists)
          logger.warn(`Missing ${pkg} dependency, install it!`)
      }
    }
    else {
      logger.warn('Missing @fortawesome/vue-fontawesome dependency, install it!')
    }

    if (faSvgExists) {
      resolvedIcons.svg!.fa = [...faSvg.imports]
      delete faSvg.imports
    }
  }

  const mdiSvg = vuetifyOptions.icons.svg?.mdi
  if (mdiSvg) {
    const mdiSvgExists = isPackageExists('@mdi/js')
    if (mdiSvgExists) {
      resolvedIcons.svg!.mdi = true
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

  console.log(vuetifyOptions.icons)
  console.log(resolvedIcons)

  return resolvedIcons
}
