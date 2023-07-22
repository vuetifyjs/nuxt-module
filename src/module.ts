import {
  createResolver,
  defineNuxtModule,
  getNuxtVersion,
  hasNuxtModule,
  isNuxt3,
  useLogger,
} from '@nuxt/kit'
import { version } from '../package.json'
import type { ModuleOptions } from './types'
import type { VuetifyNuxtContext } from './utils/config'
import { load, registerWatcher } from './utils/load'
import { configureVite } from './utils/configure-vite'
import { configureNuxt } from './utils/configure-nuxt'

export * from './types'

export { defineVuetifyConfiguration } from './utils/config'

const CONFIG_KEY = 'vuetify'
const logger = useLogger(`nuxt:${CONFIG_KEY}`)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vuetify-nuxt-module',
    configKey: 'vuetify',
    compatibility: { nuxt: '^3.0.0' },
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

    const ctx: VuetifyNuxtContext = {
      logger,
      resolver: createResolver(import.meta.url),
      moduleOptions: undefined!,
      vuetifyOptions: undefined!,
      vuetifyFilesToWatch: [],
      isSSR: nuxt.options.ssr,
      isDev: nuxt.options.dev,
      unocss: hasNuxtModule('@unocss/nuxt', nuxt),
      i18n: hasNuxtModule('@nuxtjs/i18n', nuxt),
      icons: undefined!,
      componentsPromise: undefined!,
      labComponentsPromise: undefined!,
    }

    await load(options, nuxt, ctx)

    configureNuxt(CONFIG_KEY, nuxt, ctx)

    registerWatcher(options, nuxt, ctx)

    configureVite(CONFIG_KEY, nuxt, ctx)
  },
})
