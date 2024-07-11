import { readFile } from 'node:fs/promises'
import { isPackageExists } from 'local-pkg'
import { resolveVuetifyBase } from '@vuetify/loader-shared'
import type { ViteConfig } from '@nuxt/schema'
import type { DateAdapter, DirectiveName, VOptions } from '../types'
import type { VuetifyNuxtContext } from '~/src/utils/config'

export interface VuetifyImportMap {
  from: string
}
export type VuetifyComponentsImportMap = Record<string, VuetifyImportMap>
export type VuetifyDirective = [name: DirectiveName, ignore: boolean]

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

export function resolveVuetifyComponents(ctx: VuetifyNuxtContext) {
  const vuetifyBase = resolveVuetifyBase()
  const componentsPromise = importMapResolver()
  const directivesPromise = importDirectivesResolver()
  const labComponentsPromise = importMapLabResolver()

  return {
    vuetifyBase,
    componentsPromise,
    directivesPromise,
    labComponentsPromise,
  }

  async function importMapResolver(): Promise<VuetifyComponentsImportMap> {
    return JSON.parse(await readFile(ctx.resolver.resolve(vuetifyBase, 'dist/json/importMap.json'), 'utf-8')).components!
  }
  async function importDirectivesResolver(): Promise<VuetifyDirective[]> {
    const existingDirectives: DirectiveName[] = JSON.parse(await readFile(ctx.resolver.resolve(vuetifyBase, 'dist/json/importMap.json'), 'utf-8')).directives!
    const useOldDirectivesBehavior = ctx.moduleOptions.useOldDirectivesBehavior === true
    const directives: VuetifyDirective[] = existingDirectives.map(name => ([name, false]))
    const configuredDirectives = ctx.vuetifyOptions.directives
    // all directives enabled by default: old behavior will not add ignored directives
    if (!useOldDirectivesBehavior && configuredDirectives !== undefined) {
      // ignore all directives by default
      if (configuredDirectives === false) {
        directives.forEach(directive => (directive[1] = true))
      }
      else if (typeof configuredDirectives !== 'boolean') {
        const checkDirectives = Array.isArray(configuredDirectives)
          ? configuredDirectives
          : [configuredDirectives]
        // ignore directives not added to the list
        for (const directive of directives) {
          if (!(directive[0] in checkDirectives))
            directive[1] = true
        }
      }
    }

    return directives
  }
  async function importMapLabResolver(): Promise<VuetifyComponentsImportMap> {
    return JSON.parse(await readFile(ctx.resolver.resolve(vuetifyBase, 'dist/json/importMap-labs.json'), 'utf-8')).components!
  }
}
