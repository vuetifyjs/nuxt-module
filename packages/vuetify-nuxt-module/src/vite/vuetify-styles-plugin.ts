import type { Plugin } from 'vite'
import type { VuetifyNuxtContext } from '../utils/config'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolvePath } from '@nuxt/kit'
import { isObject, normalizePath, resolveVuetifyBase } from '@vuetify/loader-shared'
import { isAbsolute, relative as relativePath } from 'pathe'
import semver from 'semver'
import path from 'upath'

export function vuetifyStylesPlugin (
  ctx: VuetifyNuxtContext,
) {
  let configFile: string | undefined
  const options = { styles: ctx.moduleOptions.styles }
  const vuetifyBase = resolveVuetifyBase()
  const noneFiles = new Set<string>()
  let isNone = false
  let sassVariables = false
  let fileImport = false
  const PREFIX = 'vuetify-styles/'
  const SSR_PREFIX = `/@${PREFIX}`
  const resolveCss = resolveCssFactory()
  const toPath = (file: string) => fileImport ? pathToFileURL(file).href : normalizePath(file)

  return <Plugin>{
    name: 'vuetify:styles:nuxt',
    enforce: 'pre',
    async configResolved (config) {
      if (config.plugins.some(plugin => plugin.name === 'vuetify:styles')) {
        throw new Error('Remove vite-plugin-vuetify from your Nuxt config file, this module registers a modified version.')
      }

      if (isObject(options.styles) && 'configFile' in options.styles) {
        sassVariables = true
        fileImport = semver.gt(ctx.viteVersion, '5.4.2')
        configFile = await resolvePath(options.styles.configFile)
      } else {
        isNone = options.styles === 'none'
      }
    },
    async resolveId (source, importer, { custom, ssr }) {
      if (!sassVariables) {
        return
      }

      if (source.startsWith(PREFIX) || source.startsWith(SSR_PREFIX)) {
        if (/\.s[ca]ss$/.test(source)) {
          return source
        }

        const idx = source.indexOf('?')
        return idx === -1 ? source : source.slice(0, idx)
      }

      if (
        importer
        && source.endsWith('.css')
        && isSubdir(vuetifyBase, path.isAbsolute(source) ? source : importer)
      ) {
        let resolutionId: string | undefined

        if (source.startsWith('.')) {
          resolutionId = path.resolve(path.dirname(importer), source)
        } else if (path.isAbsolute(source)) {
          resolutionId = source
        } else {
          const resolution = await this.resolve(source, importer, { skipSelf: true, custom })
          if (resolution) {
            resolutionId = resolution.id
          }
        }

        if (!resolutionId) {
          return
        }

        const target = await resolveCss(resolutionId)

        if (isNone) {
          noneFiles.add(target)
          return target
        }

        if (ctx.stylesCachePath) {
          const relative = path.relative(vuetifyBase, target)
          const cacheFile = path.resolve(ctx.stylesCachePath, relative.replace(/\.s[ac]ss$/, '.css'))
          if (fs.existsSync(cacheFile)) {
            return cacheFile
          }
        }

        return `${ssr ? SSR_PREFIX : PREFIX}${path.relative(vuetifyBase, target)}`
      }

      return undefined
    },
    load (id) {
      if (sassVariables) {
        const target = id.startsWith(PREFIX)
          ? path.resolve(vuetifyBase, id.slice(PREFIX.length))
          : (id.startsWith(SSR_PREFIX)
              ? path.resolve(vuetifyBase, id.slice(SSR_PREFIX.length))
              : undefined)

        if (target) {
          const suffix = /\.scss/.test(target) ? ';\n' : '\n'
          return {
            code: `@use "${toPath(configFile!)}"${suffix}@use "${toPath(target)}"${suffix}`,
            map: {
              mappings: '',
            },
          }
        }
      }

      return isNone && noneFiles.has(id) ? '' : undefined
    },
  }
}

function resolveCssFactory () {
  const mappings = new Map<string, string>()
  return async (source: string) => {
    let mapping = mappings.get(source)
    if (!mapping) {
      try {
        mapping = source.replace(/\.css$/, '.sass')
        await fsp.access(mapping, fs.constants.R_OK)
      } catch (error) {
        if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
          throw error
        }
        try {
          mapping = source.replace(/\.css$/, '.scss')
          await fsp.access(mapping, fs.constants.R_OK)
        } catch {
          // If neither sass nor scss exists, fallback to css
          mapping = source
        }
      }
      mappings.set(source, mapping)
    }
    return mapping
  }
}

function isSubdir (root: string, test: string) {
  const relative = relativePath(root, test)
  return relative && !relative.startsWith('..') && !isAbsolute(relative)
}
