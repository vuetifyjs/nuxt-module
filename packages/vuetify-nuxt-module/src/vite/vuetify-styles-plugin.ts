import type { Plugin } from 'vite'
import type { MOptions } from '../types'
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
  options: Pick<MOptions, 'styles'>,
  viteVersion: VuetifyNuxtContext['viteVersion'],
  _logger: ReturnType<typeof import('@nuxt/kit')['useLogger']>,
) {
  let configFile: string | undefined
  let useLoadCache = false
  const vuetifyBase = resolveVuetifyBase()
  const noneFiles = new Set<string>()
  const loadCache = new Map<string, { code: string, map: { mappings: string } }>()
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
        useLoadCache = !config.isProduction && !!options.styles.experimental?.cache
        // use file import when vite version > 5.4.2
        // check https://github.com/vitejs/vite/pull/17909
        fileImport = semver.gt(viteVersion, '5.4.2')

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

        if (resolutionId.startsWith(PREFIX) || resolutionId.startsWith(SSR_PREFIX)) {
          return resolutionId
        }

        const target = await resolveCss(resolutionId)

        if (isNone) {
          noneFiles.add(target)
          return target
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
          if (useLoadCache) {
            const cached = loadCache.get(id)
            if (cached) {
              return cached
            }
          }
          const suffix = /\.scss/.test(target) ? ';\n' : '\n'
          const result = {
            code: `@use "${toPath(configFile!)}"${suffix}@use "${toPath(target)}"${suffix}`,
            map: {
              mappings: '',
            },
          }
          if (useLoadCache) {
            loadCache.set(id, result)
          }
          return result
        }
      }
      return isNone && noneFiles.has(id) ? '' : undefined
    },
    handleHotUpdate ({ file }) {
      if (!useLoadCache) {
        return
      }

      const normalizedFile = normalizePath(file)
      if (
        normalizedFile === normalizePath(configFile || '')
        || normalizedFile.endsWith('.sass')
        || normalizedFile.endsWith('.scss')
      ) {
        loadCache.clear()
      }
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
        mapping = source.replace(/\.css$/, '.scss')
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
