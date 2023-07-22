import { existsSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { LoadConfigResult, LoadConfigSource } from 'unconfig'
import { createConfigLoader as createLoader } from 'unconfig'
import type { Resolver } from '@nuxt/kit'
import type { DateAdapter, MOptions, VOptions } from '../types'
import type { ResolvedIcons } from './icons'
import type { VuetifyComponentsImportMap } from './module'

export interface VuetifyNuxtContext {
  resolver: Resolver
  logger: ReturnType<typeof import('@nuxt/kit')['useLogger']>
  moduleOptions: MOptions
  vuetifyOptions: VOptions
  vuetifyFilesToWatch: string[]
  isDev: boolean
  i18n: boolean
  isSSR: boolean
  unocss: boolean
  dateAdapter?: DateAdapter
  icons: ResolvedIcons
  componentsPromise: Promise<VuetifyComponentsImportMap>
  labComponentsPromise: Promise<VuetifyComponentsImportMap>
}

export function defineVuetifyConfiguration(vuetifyOptions: VOptions) {
  return vuetifyOptions
}

export async function loadVuetifyConfiguration<U extends VOptions>(
  cwd = process.cwd(),
  configOrPath: string | U = cwd,
  defaults: VOptions = {},
  extraConfigSources: LoadConfigSource[] = [],
): Promise<LoadConfigResult<U>> {
  let inlineConfig = {} as U
  if (typeof configOrPath !== 'string') {
    inlineConfig = configOrPath
    configOrPath = process.cwd()
  }

  const resolved = resolve(cwd, configOrPath)

  let isFile = false
  if (existsSync(resolved) && statSync(resolved).isFile()) {
    isFile = true
    cwd = dirname(resolved).replace(/\\/g, '/')
  }

  const loader = createLoader<U>({
    sources: isFile
      ? [
          {
            files: resolved,
            extensions: [],
          },
        ]
      : [
          {
            files: [
              'vuetify.config',
            ],
          },
          ...extraConfigSources,
        ],
    cwd,
    defaults: inlineConfig,
  })

  const result = await loader.load()
  result.config = Object.assign(defaults, result.config || inlineConfig)

  return result
}
