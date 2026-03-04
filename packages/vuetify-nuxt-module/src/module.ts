import type { HookResult } from '@nuxt/schema'
import type { createVuetify, VuetifyOptions } from 'vuetify'
import type {
  InlineModuleOptions,
  SSRClientHints,
  SSRClientHintsConfiguration,
  VuetifyModuleOptions,
} from './types'
import type { VuetifyNuxtContext } from './utils/config'
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
import { version as VITE_VERSION } from 'vite'
import { version } from '../package.json'
import { configureNuxt } from './utils/configure-nuxt'
import { configureVite } from './utils/configure-vite'
import { load, registerWatcher } from './utils/loader'

export * from './types'

/**
 * Configuration options for the Vuetify Nuxt module.
 */
export interface ModuleOptions extends VuetifyModuleOptions {}

export interface ModuleHooks {
  /**
   * Hook called when the module is registered.
   *
   * @param registerModule - A function to register a Vuetify module with inline options.
   */
  'vuetify:registerModule': (registerModule: (config: InlineModuleOptions) => void) => HookResult
}

export interface ModuleRuntimeHooks {
  /**
   * Hook called before the Vuetify configuration is resolved.
   * allowing you to modify the configuration.
   *
   * @param options - The configuration options including `isDev` and `vuetifyOptions`.
   */
  'vuetify:configuration': (options: {
    isDev: boolean
    vuetifyOptions: VuetifyOptions
  }) => HookResult
  /**
   * Hook called before the Vuetify instance is created.
   *
   * @param options - The options used to create the Vuetify instance.
   */
  'vuetify:before-create': (options: {
    isDev: boolean
    vuetifyOptions: VuetifyOptions
  }) => HookResult
  /**
   * Hook called after the Vuetify instance has been created.
   *
   * @param vuetify - The created Vuetify instance.
   */
  'vuetify:ready': (vuetify: ReturnType<typeof createVuetify>) => HookResult
  /**
   * Hook called to configure SSR client hints.
   *
   * @param options - The SSR client hints configuration options.
   */
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
  /**
   * Default configuration options of the Nuxt module
   */
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
      rulesConfiguration: {
        fromLabs: true,
      },
    },
  }),
  /**
   * Sets up the Vuetify Nuxt module.
   *
   * @param options - The module options.
   * @param nuxt - The Nuxt instance.
   */
  async setup (options, nuxt) {
    if (isNuxtMajorVersion(2, nuxt)) {
      logger.error(`Cannot support nuxt version: ${getNuxtVersion(nuxt)}`)
    }

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

    await configureNuxt(CONFIG_KEY, nuxt, ctx)

    registerWatcher(options, nuxt, ctx)

    configureVite(CONFIG_KEY, nuxt, ctx)
  },
})
