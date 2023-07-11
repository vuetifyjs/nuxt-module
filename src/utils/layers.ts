import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import type { ModuleOptions } from '../types'

/**
 * Merges project layer with registered vuetify modules
 */
export async function mergeVuetifyModules(options: ModuleOptions, nuxt: Nuxt) {
  const projectLayer = nuxt.options._layers[0]
  const moduleOptions: ModuleOptions[] = []

  await nuxt.callHook('vuetify:registerModule', layerModuleOptions => moduleOptions.push(layerModuleOptions))

  if (nuxt.options._layers.length > 1) {
    nuxt.options._layers.forEach((layer, idx) => {
      if (idx > 0 && layer.config.vuetify)
        moduleOptions.push(layer.config.vuetify)
    })
  }

  if (projectLayer.config.vuetify)
    moduleOptions.push(projectLayer.config.vuetify)

  if (moduleOptions.length) {
    if (moduleOptions.length > 1) {
      const [base, ...rest] = moduleOptions
      projectLayer.config.vuetify = <ModuleOptions>defu(base, ...rest)
    }
    else {
      projectLayer.config.vuetify = moduleOptions[0]
    }
  }
}
