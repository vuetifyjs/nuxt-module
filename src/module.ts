import {
  createResolver,
  defineNuxtModule,
  getNuxtVersion,
  hasNuxtModule,
  isNuxt3,
  useLogger,
} from '@nuxt/kit'
import { getPackageInfo } from 'local-pkg'
import type { HookResult } from '@nuxt/schema'
import type { VuetifyOptions, createVuetify } from 'vuetify'
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

const CONFIG_KEY = 'vuetify'
const logger = useLogger(`nuxt:${CONFIG_KEY}`)

export default defineNuxtModule<VuetifyModuleOptions>({
  meta: {
    name: 'vuetify-nuxt-module',
    configKey: 'vuetify',
    compatibility: {
      nuxt: '^3.6.5',
      bridge: false,
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
      styles: true,
    },
  }),
  async setup(options, nuxt) {
    if (!isNuxt3(nuxt))
      logger.error(`Cannot support nuxt version: ${getNuxtVersion(nuxt)}`)

    const vuetifyPkg = await getPackageInfo('vuetify')
    const versions = vuetifyPkg?.version?.split('.').map(v => Number.parseInt(v))
    const vuetify3_4 = versions
      && versions.length > 1
      && (versions[0] > 3 || (versions[0] === 3 && versions[1] >= 4))

    const ctx: VuetifyNuxtContext = {
      logger,
      resolver: createResolver(import.meta.url),
      moduleOptions: undefined!,
      vuetifyOptions: undefined!,
      vuetifyFilesToWatch: [],
      isSSR: nuxt.options.ssr,
      isDev: nuxt.options.dev,
      isNuxtGenerate: nuxt.options._generate,
      unocss: hasNuxtModule('@unocss/nuxt', nuxt),
      i18n: hasNuxtModule('@nuxtjs/i18n', nuxt),
      icons: undefined!,
      ssrClientHints: undefined!,
      componentsPromise: undefined!,
      labComponentsPromise: undefined!,
      vuetify3_4,
    }

    await load(options, nuxt, ctx)

    configureNuxt(CONFIG_KEY, nuxt, ctx)

    registerWatcher(options, nuxt, ctx)

    configureVite(CONFIG_KEY, nuxt, ctx)
  },
})

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

declare module '#app' {
  interface RuntimeNuxtHooks {
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
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    ['vuetify']?: Partial<ModuleOptions>
  }
  interface NuxtOptions {
    ['vuetify']?: ModuleOptions
  }
  interface NuxtHooks {
    'vuetify:registerModule': (registerModule: (config: InlineModuleOptions) => void) => HookResult
  }
}
