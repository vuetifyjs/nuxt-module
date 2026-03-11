import type { Resolver } from '@nuxt/kit'
import type { LoadConfigResult, LoadConfigSource } from 'unconfig'
import type { DateAdapter, ExternalVuetifyOptions, MOptions, VOptions } from '../types'
import type { ResolvedIcons } from './icons'
import type { VuetifyComponentsImportMap } from './module'
import type { ResolvedClientHints } from './ssr-client-hints'
import { existsSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { createConfigLoader as createLoader } from 'unconfig'

export interface VuetifyNuxtContext {
  resolver: Resolver
  logger: ReturnType<typeof import('@nuxt/kit')['useLogger']>
  moduleOptions: MOptions
  vuetifyOptions: VOptions
  vuetifyFilesToWatch: string[]
  isDev: boolean
  i18n: boolean
  isSSR: boolean
  isNuxtGenerate: boolean
  unocss: boolean
  dateAdapter?: DateAdapter
  icons: ResolvedIcons
  ssrClientHints: ResolvedClientHints
  componentsPromise: Promise<VuetifyComponentsImportMap>
  labComponentsPromise: Promise<VuetifyComponentsImportMap>
  /**
   * Check if Vuetify version is greater than or equal to the given version
   * @example ctx.vuetifyGte('3.4.0') // true if Vuetify version is 3.4.0 or greater
   */
  vuetifyGte: (version: string) => boolean
  viteVersion: string
  enableRules?: boolean
  rulesConfiguration?: { fromLabs?: boolean, configFile?: string }
}

export async function loadVuetifyConfiguration<U extends ExternalVuetifyOptions> (
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

  const rewrite = <U>(config: U) => {
    if (typeof config === 'function') {
      return config() as U
    }

    return config
  }

  const loader = createLoader<U>({
    sources: isFile
      ? [
          {
            files: resolved,
            extensions: [],
            rewrite,
          },
        ]
      : [
          {
            files: [
              'vuetify.config',
            ],
            // we don't want `package.json` to be loaded
            extensions: ['mts', 'cts', 'ts', 'mjs', 'cjs', 'js'],
            rewrite,
          },
          ...extraConfigSources,
        ],
    cwd,
    defaults: inlineConfig,
    merge: false,
  })

  const result = await loader.load()
  result.config = result.config?.config === false ? Object.assign(defaults, inlineConfig) : Object.assign(defaults, result.config || inlineConfig)

  if (result.config && typeof result.config === 'object' && 'vuetifyOptions' in result.config) {
    const nestedOptions = (result.config as any).vuetifyOptions
    if (typeof nestedOptions === 'object' && nestedOptions !== null) {
      console.warn('[@vuetify/nuxt-module] Detected nested "vuetifyOptions" in your configuration file. This usually happens when using a named export or wrapping options incorrectly. Please export the options directly using "export default".')
      Object.assign(result.config, nestedOptions)
      delete (result.config as any).vuetifyOptions
    }
  }

  delete result.config.config

  return result
}
