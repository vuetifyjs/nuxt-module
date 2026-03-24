import type { Nuxt } from '@nuxt/schema'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'pathe'

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

export function createStylesCacheHash (
  vuetifyVersion: string,
  viteVersion: string,
  configContent: string,
  configFile: string,
) {
  return createHash('sha256')
    .update(vuetifyVersion)
    .update(viteVersion)
    .update(configContent)
    .update(configFile)
    .digest('hex')
    .slice(0, 8)
}

export function resolveStylesCachePaths (rootDir: string, hash: string) {
  const stylesDir = resolve(rootDir, 'node_modules/.cache/vuetify-nuxt-module/styles')
  const cacheDir = join(stylesDir, hash)
  return {
    stylesDir,
    cacheDir,
  }
}

export function cleanupOldStylesCaches (stylesDir: string, currentHash: string) {
  if (!existsSync(stylesDir)) {
    return
  }

  const dirents = readdirSync(stylesDir, { withFileTypes: true })
  for (const dirent of dirents) {
    if (dirent.isDirectory() && dirent.name !== currentHash) {
      rmSync(join(stylesDir, dirent.name), { recursive: true, force: true })
    }
  }
}

export function collectVuetifyCssFiles (vuetifyBase: string) {
  const files: string[] = []
  findCssFiles(join(vuetifyBase, 'lib/components'), files)
  findCssFiles(join(vuetifyBase, 'lib/styles'), files)
  return files
}

function findCssFiles (dir: string, fileList: string[] = []) {
  if (!existsSync(dir)) {
    return fileList
  }
  const files = readdirSync(dir)
  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)
    if (stat.isDirectory()) {
      findCssFiles(filePath, fileList)
    } else {
      if (file.endsWith('.css')) {
        fileList.push(filePath)
      }
    }
  }
  return fileList
}
