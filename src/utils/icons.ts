import { isPackageExists } from 'local-pkg'
import type { FontAwesomeSvgIconSet, IconSetName, VOptions } from '../types'

export interface ResolvedIcons {
  enabled: boolean
  defaultSet?: IconSetName
  cdn?: string[]
  local?: string[]
  svg?: {
    mdi?: boolean
    fa?: FontAwesomeSvgIconSet['imports']
  }
}

const cssFonts: IconSetName[] = ['mdi', 'md', 'fa', 'fa4']

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
  icons?: VOptions['icons'],
): ResolvedIcons {
  // TODO: handle blueprint icons
  if (icons === false)
    return { enabled: false }

  if (!icons) {
    const packageName = iconsPackageNames.mdi
    return isPackageExists(packageName.name)
      ? { enabled: true, defaultSet: 'mdi', local: [packageName.css] }
      : { enabled: true, defaultSet: 'mdi', cdn: [iconsCDN.mdi] }
  }

  if (!icons.sets?.length) {
    icons.sets ||= []
    icons.sets.push({ name: icons.defaultSet || 'mdi' })
  }

  const { defaultSet, sets = [] } = icons

  const result: ResolvedIcons = {
    enabled: true,
    defaultSet,
    cdn: [],
    local: [],
    svg: {
      mdi: false,
    },
  }

  sets.filter(s => cssFonts.includes(s.name)).map(s => s.name).forEach((name) => {
    if (isPackageExists(iconsPackageNames[name].name))
      result.local!.push(iconsPackageNames[name].css)
    else
      result.cdn!.push(iconsCDN[name])
  })

  const faSvg = icons.svg?.fa
  if (faSvg) {
    let faSvgExists = isPackageExists('@fortawesome/fontawesome-svg-core')
    if (!faSvgExists)
      logger.warn('Missing @fortawesome/fontawesome-svg-core dependency, install it!')

    faSvgExists = isPackageExists('@fortawesome/vue-fontawesome')
    if (faSvgExists) {
      if (!faSvg.imports?.length)
        faSvg.imports = [['fas', 'import { fas } from \'@fortawesome/free-solid-svg-icons\'']]

      for (const p in faSvg.imports) {
        const [name] = faSvg.imports[p]
        faSvgExists = isPackageExists(name)
        if (!faSvgExists)
          logger.warn(`Missing ${name} dependency, install it!`)
      }
    }
    else {
      logger.warn('Missing @fortawesome/vue-fontawesome dependency, install it!')
    }

    if (!faSvgExists)
      delete faSvg.imports
  }

  const mdiSvg = icons.svg?.mdi
  if (mdiSvg) {
    const mdiSvgExists = isPackageExists('@mdi/js')
    if (mdiSvgExists) {
      result.svg!.mdi = true
    }
    else {
      result.svg!.mdi = false
      logger.warn('Missing @mdi/js dependency, install it!')
    }
  }

  if (!result.local?.length && !result.cdn?.length && !result.svg?.mdi && !result.svg?.fa?.length) {
    logger.warn('No icons found, icons disabled!')
    return { enabled: false }
  }

  return result
}
