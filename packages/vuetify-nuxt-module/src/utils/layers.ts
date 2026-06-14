import type { Nuxt } from '@nuxt/schema'
import type { FontIconSet, IconFontName, InlineModuleOptions, VuetifyModuleOptions } from '../types'
import defu from 'defu'
import { loadVuetifyConfiguration } from './config'

/**
 * Module defaults — applied as the LOWEST-priority `defu` argument so that
 * `vuetify:registerModule` hooks and layers can override them, while the app's
 * explicit `nuxt.config` values (the defu base) still win (#290).
 */
export const MODULE_DEFAULTS: InlineModuleOptions = {
  moduleOptions: {
    importComposables: true,
    includeTransformAssetsUrls: true,
    styles: true,
    rulesConfiguration: {
      fromLabs: true,
    },
  },
  vuetifyOptions: {
    labComponents: false,
    directives: false,
  },
}

/**
 * Merge collected configuration entries — `[app, ...hooks, ...layers]` — applying
 * MODULE_DEFAULTS last. `app` is the defu base (#231); ordering is not reversed (#218);
 * icons `sets` are deduped across entries (#214/#217).
 */
export function finalizeConfiguration (moduleOptions: InlineModuleOptions[]): InlineModuleOptions {
  if (moduleOptions.length > 1) {
    const [app, ...rest] = moduleOptions
    const configuration = <InlineModuleOptions>defu(app, ...rest, MODULE_DEFAULTS)
    // dedupe icons sets: fix #214 and #217 — reverse so the last (app) wins
    dedupeIcons(configuration, moduleOptions.toReversed())
    return configuration
  }
  return <InlineModuleOptions>defu(moduleOptions[0] ?? {}, MODULE_DEFAULTS)
}

/**
 * Merges project layer with registered vuetify modules
 */
export async function mergeVuetifyModules (options: VuetifyModuleOptions, nuxt: Nuxt) {
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

      if (resolvedOptions.sources.length > 0) {
        for (const s of resolvedOptions.sources
          .map(s => s.replace(/\\/g, '/'))
          .filter(s => !s.includes('/node_modules/'))) {
          vuetifyConfigurationFilesToWatch.add(s)
        }
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

  // handle vuetify configuration files changes only in dev mode
  if (nuxt.options.dev && resolvedOptions.sources.length > 0) {
    for (const s of resolvedOptions.sources) {
      vuetifyConfigurationFilesToWatch.add(s.replace(/\\/g, '/'))
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
  return {
    configuration: finalizeConfiguration(moduleOptions),
    vuetifyConfigurationFilesToWatch,
  }
}

// dedupe icons sets: fix #214 and #217
function dedupeIcons (configuration: InlineModuleOptions, moduleOptions: InlineModuleOptions[]) {
  const vuetifyOptions = configuration.vuetifyOptions
  if (vuetifyOptions.icons && vuetifyOptions.icons.sets) {
    const sets = new Map<string, FontIconSet>()
    // modules are reversed, so the last one has the highest priority (app)
    for (const { vuetifyOptions } of moduleOptions) {
      if (vuetifyOptions.icons && vuetifyOptions.icons.sets) {
        const mSets = vuetifyOptions.icons.sets
        if (typeof mSets === 'string') {
          sets.set(mSets, { name: mSets as IconFontName })
        } else {
          for (const set of mSets) {
            if (typeof set === 'string') {
              sets.set(set, { name: set as IconFontName })
            } else {
              sets.set(set.name, set)
            }
          }
        }
      }
    }
    vuetifyOptions.icons.sets = Array.from(sets.values())
  }
}
