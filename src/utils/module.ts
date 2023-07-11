import { isPackageExists } from 'local-pkg'
import type { DateAdapter, VOptions } from '../types'

export function detectDate() {
  const result: DateAdapter[] = []
  // todo: remove this once fixed on Vuetify side
  // eslint-disable-next-line no-constant-condition
  if (true)
    return result

  ;[
    'date-fns',
    'moment',
    'luxon',
    'dayjs',
    'js-joda',
    'date-fns-jalali',
    'jalaali',
    'hijri',
  ].forEach((adapter) => {
    if (isPackageExists(`@date-io/${adapter}`))
      result.push(adapter as DateAdapter)
  })

  return result
}

export function cleanupBlueprint(vuetifyOptions: VOptions) {
  const blueprint = vuetifyOptions.blueprint
  if (blueprint) {
    delete blueprint.ssr
    delete blueprint.components
    delete blueprint.directives
    delete blueprint.locale
    delete blueprint.date
    delete blueprint.icons
    vuetifyOptions.blueprint = blueprint
  }
}
