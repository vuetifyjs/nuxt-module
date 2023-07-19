import { readFile } from 'node:fs/promises'
import { isPackageExists } from 'local-pkg'
import { resolveVuetifyBase } from '@vuetify/loader-shared'
import type { Resolver } from '@nuxt/kit'
import type { ViteConfig } from '@nuxt/schema'
import type { DateAdapter, VOptions } from '../types'

export interface VuetifyImportMap {
  from: string
}
export type VuetifyComponentsImportMap = Record<string, VuetifyImportMap>

export function detectDate() {
  const result: DateAdapter[] = []

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

export function checkVuetifyPlugins(config: ViteConfig) {
  let plugin = config.plugins?.find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vuetify:import')
  if (plugin)
    throw new Error('Remove vite-plugin-vuetify plugin from Vite Plugins entry in Nuxt config file!')

  plugin = config.plugins?.find(p => p && typeof p === 'object' && 'name' in p && p.name === 'vuetify:styles')
  if (plugin)
    throw new Error('Remove vite-plugin-vuetify plugin from Vite Plugins entry in Nuxt config file!')
}

export function resolveVuetifyComponents(resolver: Resolver) {
  const vuetifyBase = resolveVuetifyBase()
  const componentsPromise = importMapResolver()
  const labComponentsPromise = importMapLabResolver()

  return {
    vuetifyBase,
    componentsPromise,
    labComponentsPromise,
  }

  async function importMapResolver(): Promise<VuetifyComponentsImportMap> {
    return JSON.parse(await readFile(resolver.resolve(vuetifyBase, 'dist/json/importMap.json'), 'utf-8')).components!
  }
  async function importMapLabResolver(): Promise<VuetifyComponentsImportMap> {
    return JSON.parse(await readFile(resolver.resolve(vuetifyBase, 'dist/json/importMap-labs.json'), 'utf-8')).components!
  }
}
