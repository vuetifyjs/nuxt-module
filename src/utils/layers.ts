import { resolve } from 'node:path'
import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import { relative } from 'pathe'
import type { InlineModuleOptions, ModuleOptions } from '../types'
import { loadVuetifyConfiguration } from './config'

/**
 * Merges project layer with registered vuetify modules
 */
export async function mergeVuetifyModules(options: ModuleOptions, nuxt: Nuxt) {
  const moduleOptions: InlineModuleOptions[] = []
  const vuetifyConfigurationFilesToWatch = new Set<string>()

  // if (typeof moduleOptions.vuetifyOptions === 'string')
  //   nuxt.

  await nuxt.callHook('vuetify:registerModule', layerModuleOptions => moduleOptions.push(layerModuleOptions))

  if (nuxt.options._layers.length > 1) {
    for (let i = 1; i < nuxt.options._layers.length; i++) {
      const layer = nuxt.options._layers[i]
      if (layer.config.vuetify) {
        const configOrPath = layer.config.vuetify.vuetifyOptions
        if (typeof configOrPath === 'string' && !configOrPath.includes('node_modules')) {
          const fullPath = resolve(layer.config.rootDir, configOrPath)
          const relativePath = relative(nuxt.options.srcDir, fullPath).replace(/\\/g, '/')
          vuetifyConfigurationFilesToWatch.add(relativePath.replace(/\\/g, '/'))
          vuetifyConfigurationFilesToWatch.add(relativePath)
          vuetifyConfigurationFilesToWatch.add(`${relativePath}~`)
        }

        moduleOptions.push({
          moduleOptions: layer.config.vuetify.moduleOptions,
          vuetifyOptions: (await loadVuetifyConfiguration(
            layer.config.rootDir,
            layer.config.vuetify.vuetifyOptions,
          )).config,
        })
      }
    }
  }

  const resolvedOptions = await loadVuetifyConfiguration(
    nuxt.options.rootDir,
    options.vuetifyOptions,
  )

  if (typeof options.vuetifyOptions === 'string') {
    const fullPath = resolve(nuxt.options.rootDir, options.vuetifyOptions)
    const relativePath = relative(nuxt.options.srcDir, fullPath).replace(/\\/g, '/')
    vuetifyConfigurationFilesToWatch.add(relativePath.replace(/\\/g, '/'))
    vuetifyConfigurationFilesToWatch.add(relativePath)
    vuetifyConfigurationFilesToWatch.add(`${relativePath}~`)
  }

  moduleOptions.push({
    moduleOptions: options.moduleOptions,
    vuetifyOptions: resolvedOptions.config,
  })

  if (moduleOptions.length > 1) {
    const [base, ...rest] = moduleOptions
    return {
      configuration: <InlineModuleOptions>defu(base, ...rest),
      vuetifyConfigurationFilesToWatch,
    }
  }
  else {
    return {
      configuration: <InlineModuleOptions>{
        moduleOptions: options.moduleOptions,
        vuetifyOptions: resolvedOptions.config,
      },
      vuetifyConfigurationFilesToWatch,
    }
  }
}
