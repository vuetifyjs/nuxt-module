import {
  createResolver,
  defineNuxtModule,
  getNuxtVersion,
  hasNuxtModule,
  isNuxtMajorVersion,
  useLogger,
} from '@nuxt/kit'
import { getPackageInfo } from 'local-pkg'
import semver from 'semver'
import type { HookResult } from '@nuxt/schema'
import type { VuetifyOptions, createVuetify } from 'vuetify'
import { version as VITE_VERSION } from 'vite'
import { version } from '../package.json'
import type {
  InlineModuleOptions,
  SSRClientHints,
  SSRClientHintsConfiguration,
  VuetifyModuleOptions,
} from './types'
import type { VuetifyNuxtContext } from './utils/config'
import { load, registerWatcher } from './utils/loader'
import { configureVite } from './utils/configure-vite'
import { configureNuxt } from './utils/configure-nuxt'

export * from './types'

export interface ModuleOptions extends VuetifyModuleOptions {}

export interface ModuleHooks {
  'vuetify:registerModule': (registerModule: (config: InlineModuleOptions) => void) => HookResult
}

export interface ModuleRuntimeHooks {
  'vuetify:configuration': (options: {
    isDev: boolean
    vuetifyOptions: VuetifyOptions
  }) => HookResult
  'vuetify:before-create': (options: {
    isDev: boolean
    vuetifyOptions: VuetifyOptions
  }) => HookResult
  'vuetify:ready': (vuetify: ReturnType<typeof createVuetify>) => HookResult
  'vuetify:ssr-client-hints': (options: {
    vuetifyOptions: VuetifyOptions
    ssrClientHints: SSRClientHints
    ssrClientHintsConfiguration: SSRClientHintsConfiguration
  }) => HookResult
}

const CONFIG_KEY = 'vuetify'
const logger = useLogger(`nuxt:${CONFIG_KEY}`)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vuetify-nuxt-module',
    configKey: 'vuetify',
    compatibility: {
      nuxt: '>=3.15.0',
    },
    version,
  },
  // Default configuration options of the Nuxt module
  defaults: () => ({
    vuetifyOptions: {
      labComponents: false,
      directives: false,
    },
    moduleOptions: {
      importComposables: true,
      includeTransformAssetsUrls: true,
      styles: true,
      disableVuetifyStyles: false,
      disableModernSassCompiler: false,
      rulesConfiguration: {
        fromLabs: true,
      },
    },
  }),
  async setup(options, nuxt) {
    if (isNuxtMajorVersion(2, nuxt))
      logger.error(`Cannot support nuxt version: ${getNuxtVersion(nuxt)}`)

    const vuetifyPkg = await getPackageInfo('vuetify')
    const currentVersion = vuetifyPkg?.version
    const vuetifyGte = (version: string) =>
      !!currentVersion && semver.gte(currentVersion, version)

    const viteVersion = VITE_VERSION

    const ctx: VuetifyNuxtContext = {
      logger,
      resolver: createResolver(import.meta.url),
      moduleOptions: undefined!,
      vuetifyOptions: undefined!,
      vuetifyFilesToWatch: [],
      isSSR: nuxt.options.ssr,
      isDev: nuxt.options.dev,
      isNuxtGenerate: !!nuxt.options.nitro.static,
      unocss: hasNuxtModule('@unocss/nuxt', nuxt),
      i18n: hasNuxtModule('@nuxtjs/i18n', nuxt),
      icons: undefined!,
      ssrClientHints: undefined!,
      componentsPromise: undefined!,
      labComponentsPromise: undefined!,
      vuetifyGte,
      viteVersion,
    }

    await load(options, nuxt, ctx)

    configureNuxt(CONFIG_KEY, nuxt, ctx)

    registerWatcher(options, nuxt, ctx)

    configureVite(CONFIG_KEY, nuxt, ctx)
  },
})
