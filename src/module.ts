import {
  createResolver,
  defineNuxtModule,
  getNuxtVersion,
  hasNuxtModule,
  isNuxt2,
  useLogger,
} from '@nuxt/kit'
import { getPackageInfo } from 'local-pkg'
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
      nuxt: '>=3.9.0',
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
    },
  }),
  async setup(options, nuxt) {
    if (isNuxt2(nuxt))
      logger.error(`Cannot support nuxt version: ${getNuxtVersion(nuxt)}`)

    const vuetifyPkg = await getPackageInfo('vuetify')
    const versions = vuetifyPkg?.version?.split('.').map(v => Number.parseInt(v))
    const vuetify3_4 = versions
      && versions.length > 1
      && (versions[0] > 3 || (versions[0] === 3 && versions[1] >= 4))
    const vuetify3_5 = versions
      && versions.length > 1
      && (versions[0] > 3 || (versions[0] === 3 && versions[1] >= 5))

    const viteVersion = VITE_VERSION.split('.')
      .map((v: string) => v.includes('-') ? v.split('-')[0] : v)
      .map(v => Number.parseInt(v)) as VuetifyNuxtContext['viteVersion']

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
      vuetify3_4,
      vuetify3_5,
      viteVersion,
    }

    await load(options, nuxt, ctx)

    configureNuxt(CONFIG_KEY, nuxt, ctx)

    registerWatcher(options, nuxt, ctx)

    configureVite(CONFIG_KEY, nuxt, ctx)
  },
})
