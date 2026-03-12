import type { Nuxt } from '@nuxt/schema'
import type { VuetifyNuxtContext } from './config'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { resolvePath } from '@nuxt/kit'

import { isObject, normalizePath, resolveVuetifyBase } from '@vuetify/loader-shared'

export async function prepareVuetifyStyles (nuxt: Nuxt, ctx: VuetifyNuxtContext) {
  const stylesConfig = ctx.moduleOptions.styles

  if (!isObject(stylesConfig) || !('configFile' in stylesConfig)) {
    return
  }

  if (stylesConfig.experimental?.cache === false) {
    return
  }

  const vuetifyBase = resolveVuetifyBase()
  let configFile: string | undefined
  let configContent = ''

  if (stylesConfig.configFile) {
    configFile = await resolvePath(stylesConfig.configFile)
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
  const hash = createHash('sha256')
    .update(ctx.vuetifyVersion)
    .update(ctx.viteVersion)
    .update(configContent)
    .update(configFile)
    .digest('hex')
    .slice(0, 8)

  const stylesDir = resolve(nuxt.options.rootDir, 'node_modules/.cache/vuetify-nuxt-module/styles')
  const cacheDir = join(stylesDir, hash)
  ctx.stylesCachePath = cacheDir

  // Cleanup old caches
  if (existsSync(stylesDir)) {
    const dirents = readdirSync(stylesDir, { withFileTypes: true })
    for (const dirent of dirents) {
      if (dirent.isDirectory() && dirent.name !== hash) {
        rmSync(join(stylesDir, dirent.name), { recursive: true, force: true })
      }
    }
  }

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
  const files: string[] = []
  findCssFiles(join(vuetifyBase, 'lib/components'), files)
  findCssFiles(join(vuetifyBase, 'lib/styles'), files)

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
