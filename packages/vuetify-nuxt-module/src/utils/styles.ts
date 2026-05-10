import type { Nuxt } from '@nuxt/schema'
import { existsSync } from 'node:fs'
import { isAbsolute, resolve } from 'pathe'

export function resolveVuetifyConfigFile (configFile: string, nuxt: Nuxt) {
  if (typeof configFile === 'string' && !isAbsolute(configFile)) {
    for (const layer of nuxt.options._layers) {
      const resolved = resolve(layer.config.srcDir, configFile)
      if (existsSync(resolved)) {
        return resolved
      }
    }
  }
  return configFile
}
