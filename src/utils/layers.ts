import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import type { ModuleOptions } from '../types'

/**
 * Merges project layer with registered vuetify modules
 */
export async function mergeVuetifyModules(options: ModuleOptions, nuxt: Nuxt) {
  const moduleOptions: ModuleOptions[] = []

  await nuxt.callHook('vuetify:registerModule', layerModuleOptions => moduleOptions.push(layerModuleOptions))

  console.log(nuxt.options._layers.length)
  if (nuxt.options._layers.length > 1) {
    nuxt.options._layers.forEach((layer, idx) => {
      if (idx > 0 && layer.config.vuetify)
        moduleOptions.push(layer.config.vuetify)
    })
  }

  moduleOptions.push(options)

  console.log(moduleOptions.length)

  if (moduleOptions.length > 1) {
    const [base, ...rest] = moduleOptions
    return <ModuleOptions>defu(base, ...rest)
  }
  else {
    return options
  }
}
