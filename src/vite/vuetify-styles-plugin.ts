import process from 'node:process'
import { pathToFileURL } from 'node:url'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import type { Plugin } from 'vite'
import { isObject, normalizePath, resolveVuetifyBase } from '@vuetify/loader-shared'
import { isAbsolute, relative as relativePath } from 'pathe'
import type { Options } from '@vuetify/loader-shared'
import path from 'upath'
import semver from 'semver'
import type { VuetifyNuxtContext } from '../utils/config'

export function vuetifyStylesPlugin(
  options: Options,
  viteVersion: VuetifyNuxtContext['viteVersion'],
  _logger: ReturnType<typeof import('@nuxt/kit')['useLogger']>,
) {
  let configFile: string | undefined
  // let cacheDir: string | undefined
  const vuetifyBase = resolveVuetifyBase()
  const noneFiles = new Set<string>()
  let isNone = false
  let sassVariables = false
  let fileImport = false
  const PREFIX = 'vuetify-styles/'
  const SSR_PREFIX = `/@${PREFIX}`
  const resolveCss = resolveCssFactory()

  return <Plugin>{
    name: 'vuetify:styles:nuxt',
    enforce: 'pre',
    configResolved(config) {
      if (config.plugins.findIndex(plugin => plugin.name === 'vuetify:styles') > -1)
        throw new Error('Remove vite-plugin-vuetify from your Nuxt config file, this module registers a modified version.')

      if (isObject(options.styles)) {
        sassVariables = true
        // use file import when vite version > 5.4.2
        // check https://github.com/vitejs/vite/pull/17909
        fileImport = semver.gt(viteVersion, '5.4.2')
        if (path.isAbsolute(options.styles.configFile))
          configFile = path.resolve(options.styles.configFile)
        else
          configFile = path.resolve(path.join(config.root || process.cwd(), options.styles.configFile))

        configFile = fileImport
          ? pathToFileURL(configFile).href
          : normalizePath(configFile)
      }
      else {
        isNone = options.styles === 'none'
      }
    },
    async resolveId(source, importer, { custom, ssr }) {
      if (source.startsWith(PREFIX) || source.startsWith(SSR_PREFIX)) {
        if (source.match(/\.s[ca]ss$/))
          return source

        const idx = source.indexOf('?')
        return idx > -1 ? source.slice(0, idx) : source
      }

      if (
        source === 'vuetify/styles' || (
          importer
          && source.endsWith('.css')
          && isSubdir(vuetifyBase, path.isAbsolute(source) ? source : importer)
        )
      ) {
        if (options.styles === 'sass')
          return this.resolve(await resolveCss(source), importer, { skipSelf: true, custom })

        const resolution = await this.resolve(source, importer, { skipSelf: true, custom })
        if (!resolution)
          return undefined

        const target = await resolveCss(resolution.id)
        if (isNone) {
          noneFiles.add(target)
          return target
        }

        return `${ssr ? SSR_PREFIX : PREFIX}${path.relative(vuetifyBase, target)}`
      }

      return undefined
    },
    load(id) {
      if (sassVariables) {
        const target = id.startsWith(PREFIX)
          ? path.resolve(vuetifyBase, id.slice(PREFIX.length))
          : id.startsWith(SSR_PREFIX)
            ? path.resolve(vuetifyBase, id.slice(SSR_PREFIX.length))
            : undefined

        if (target) {
          const suffix = target.match(/\.scss/) ? ';\n' : '\n'
          return {
            code: `@use "${configFile}"${suffix}@use "${fileImport ? pathToFileURL(target).href : normalizePath(target)}"${suffix}`,
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

function resolveCssFactory() {
  const mappings = new Map<string, string>()
  return async (source: string) => {
    let mapping = mappings.get(source)
    if (!mapping) {
      try {
        mapping = source.replace(/\.css$/, '.sass')
        await fsp.access(mapping, fs.constants.R_OK)
      }
      catch (err) {
        if (!(err instanceof Error && 'code' in err && err.code === 'ENOENT'))
          throw err
        mapping = source.replace(/\.css$/, '.scss')
      }
      mappings.set(source, mapping)
    }
    return mapping
  }
}

function isSubdir(root: string, test: string) {
  const relative = relativePath(root, test)
  return relative && !relative.startsWith('..') && !isAbsolute(relative)
}
