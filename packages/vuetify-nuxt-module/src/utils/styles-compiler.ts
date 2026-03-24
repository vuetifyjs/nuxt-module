import type { Nuxt } from '@nuxt/schema'
import type { VuetifyNuxtContext } from './config'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolvePath } from '@nuxt/kit'
import { isObject, normalizePath, resolveVuetifyBase } from '@vuetify/loader-shared'
import { dirname, join, relative, resolve } from 'pathe'

import { cleanupOldStylesCaches, collectVuetifyCssFiles, createStylesCacheHash, resolveStylesCachePaths, resolveVuetifyConfigFile } from './styles'

export async function prepareVuetifyStyles (nuxt: Nuxt, ctx: VuetifyNuxtContext) {
  const stylesConfig = ctx.moduleOptions.styles

  if (!isObject(stylesConfig) || !('configFile' in stylesConfig)) {
    return
  }

  if (stylesConfig.experimental?.cache === false) {
    return
  }

  const vuetifyBase = await resolveVuetifyBase()
  let configFile: string | undefined
  let configContent = ''

  if (stylesConfig.configFile) {
    configFile = await resolvePath(resolveVuetifyConfigFile(stylesConfig.configFile, nuxt))
    ctx.stylesConfigFile = configFile
    if (existsSync(configFile)) {
      configContent = readFileSync(configFile, 'utf8')
      // Add to watch list
      if (!ctx.vuetifyFilesToWatch.includes(configFile)) {
        ctx.vuetifyFilesToWatch.push(configFile)
      }
    }
  }

  if (!configFile) {
    return
  }

  // Calculate hash
  const hash = createStylesCacheHash(
    ctx.vuetifyVersion,
    ctx.viteVersion,
    configContent,
    configFile,
  )

  const { stylesDir, cacheDir } = resolveStylesCachePaths(nuxt.options.rootDir, hash)
  ctx.stylesCachePath = cacheDir

  cleanupOldStylesCaches(stylesDir, hash)

  if (existsSync(cacheDir)) {
    return
  }

  ctx.logger.info('Compiling Vuetify styles...')

  // Load SASS compiler
  let sass: any
  try {
    sass = await import('sass')
  } catch {
    try {
      sass = await import('sass-embedded')
    } catch {
      ctx.logger.warn('Could not load "sass" or "sass-embedded". Skipping styles pre-compilation.')
      return
    }
  }

  // Generate cache
  const files = collectVuetifyCssFiles(vuetifyBase)

  for (const file of files) {
    const relativePath = relative(vuetifyBase, file)
    const cacheFile = join(cacheDir, relativePath) // .css

    // Check if .sass or .scss exists
    const sassFile = file.replace(/\.css$/, '.sass')
    const scssFile = file.replace(/\.css$/, '.scss')

    let targetFile: string | undefined
    if (existsSync(sassFile)) {
      targetFile = sassFile
    } else if (existsSync(scssFile)) {
      targetFile = scssFile
    }

    if (targetFile) {
      const dir = dirname(cacheFile)
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      const content = `@use "${normalizePath(configFile)}";\n@use "${normalizePath(targetFile)}";\n`

      try {
        const result = sass.compileString(content, {
          loadPaths: [
            dirname(configFile),
            dirname(targetFile),
            resolve(vuetifyBase, '..'),
            resolve(vuetifyBase, '../..'), // In case of monorepo/hoisting issues, but standard is enough
            vuetifyBase,
          ],
          url: new URL(pathToFileURL(cacheFile).href),
        })
        writeFileSync(cacheFile, result.css, 'utf8')
      } catch (error) {
        ctx.logger.error(`Failed to compile ${targetFile}:`, error)
      }
    }
  }

  // Create metadata.json
  const metadata = {
    hash,
    vuetifyVersion: ctx.vuetifyVersion,
    viteVersion: ctx.viteVersion,
    configFile,
    createdAt: new Date().toISOString(),
  }
  writeFileSync(join(cacheDir, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf8')
}
