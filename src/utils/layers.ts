import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import { normalize } from 'pathe'
import type { FontIconSet, IconFontName, InlineModuleOptions, VuetifyModuleOptions } from '../types'
import { loadVuetifyConfiguration } from './config'

/**
 * Merges project layer with registered vuetify modules
 */
export async function mergeVuetifyModules(options: VuetifyModuleOptions, nuxt: Nuxt) {
  const moduleOptions: InlineModuleOptions[] = []
  const vuetifyConfigurationFilesToWatch = new Set<string>()

  await nuxt.callHook('vuetify:registerModule', layerModuleOptions => moduleOptions.push(layerModuleOptions))

  if (nuxt.options._layers.length > 1) {
    for (let i = 1; i < nuxt.options._layers.length; i++) {
      const layer = nuxt.options._layers[i]
      const resolvedOptions = await loadVuetifyConfiguration(
        layer.config.rootDir,
        layer.config.vuetify?.vuetifyOptions,
      )

      if (resolvedOptions.sources.length) {
        resolvedOptions.sources
          .map(s => s.replace(/\\/g, '/'))
          .filter(s => !s.includes('/node_modules/'))
          .forEach(s => vuetifyConfigurationFilesToWatch.add(s))
      }

      moduleOptions.push({
        moduleOptions: layer.config.vuetify?.moduleOptions,
        vuetifyOptions: resolvedOptions.config,
      })
    }
  }

  const resolvedOptions = await loadVuetifyConfiguration(
    nuxt.options.rootDir,
    options.vuetifyOptions,
  )

  // handle vuetify configuraton files changes only in dev mode
  if (nuxt.options.dev && resolvedOptions.sources.length) {
    // we need to restart nuxt dev server when SSR is enabled: vite-node doesn't support HMR in server yet
    if (nuxt.options.ssr) {
      if (nuxt.options.future?.compatibilityVersion === 4) {
        if (resolvedOptions.sources.length) {
          resolvedOptions.sources
            .map(s => s.replace(/\\/g, '/'))
            .filter(s => !s.includes('/node_modules/'))
            .forEach(s => vuetifyConfigurationFilesToWatch.add(s))
        }
      }
      else {
        resolvedOptions.sources.forEach(s => nuxt.options.watch.push(normalize(s)))
      }
    }
    else {
      resolvedOptions.sources.forEach(s => vuetifyConfigurationFilesToWatch.add(s))
    }
  }

  // unshift since we need to use the app configuration as base in defu call (L64 below): fix #231
  moduleOptions.unshift({
    moduleOptions: options.moduleOptions,
    vuetifyOptions: resolvedOptions.config,
  })

  // this can be complex and may require dedupe a few more entries:
  // - we don't know if the vuetify configuration is merged:
  //   for example, adding a layer with inlined vuetify options:
  //   nuxt will merge the conf for us (see issue #214 and #217)
  // - if the layer is configured using an external file, then we need to merge the configuration
  if (moduleOptions.length > 1) {
    const [app, ...rest] = moduleOptions
    // we don't need to reverse (defu second arg are the defaults): fix #218
    const configuration = <InlineModuleOptions>defu(app, ...rest)
    // dedupe icons sets: fix #214 and #217
    // we need to reverse the modules to override the icons from bottom to top layer
    dedupeIcons(configuration, moduleOptions.reverse())
    return {
      configuration,
      vuetifyConfigurationFilesToWatch,
    }
  }
  else {
    return {
      configuration: {
        moduleOptions: options.moduleOptions,
        vuetifyOptions: resolvedOptions.config,
      } satisfies InlineModuleOptions,
      vuetifyConfigurationFilesToWatch,
    }
  }
}

// dedupe icons sets: fix #214 and #217
function dedupeIcons(configuration: InlineModuleOptions, moduleOptions: InlineModuleOptions[]) {
  const vuetifyOptions = configuration.vuetifyOptions
  if (vuetifyOptions.icons) {
    if (vuetifyOptions.icons.sets) {
      const sets = new Map<string, FontIconSet>()
      // modules are reversed, so the last one has the highest priority (app)
      for (const { vuetifyOptions } of moduleOptions) {
        if (vuetifyOptions.icons && vuetifyOptions.icons.sets) {
          const mSets = vuetifyOptions.icons.sets
          if (typeof mSets === 'string') {
            sets.set(mSets, { name: mSets as IconFontName })
          }
          else {
            for (const set of mSets) {
              if (typeof set === 'string')
                sets.set(set, { name: set as IconFontName })
              else
                sets.set(set.name, set)
            }
          }
        }
      }
      vuetifyOptions.icons.sets = Array.from(sets.values())
    }
  }
}
