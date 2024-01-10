import { extname } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Plugin } from 'vite'
import { type Options, generateImports } from '@vuetify/loader-shared'
import { parseQuery, parseURL } from 'ufo'
import { isAbsolute } from 'pathe'
import destr from 'destr'

function parseId2(id: string) {
  id = id.replace(/^(virtual:nuxt:|virtual:)/, '')
  return parseURL(decodeURIComponent(isAbsolute(id) ? pathToFileURL(id).href : id))
}

function parseId(id: string) {
  const { search, pathname } = parseId2(id)
  const query = parseQuery(search)
  const urlProps = query.props ? destr<Record<string, any>>(query.props as string) : undefined

  return {
    query: urlProps,
    path: pathname ?? id,
  }
}

export function vuetifyImportPlugin(options: Options) {
  return <Plugin>{
    name: 'vuetify:import:nuxt',
    configResolved(config) {
      if (config.plugins.findIndex(plugin => plugin.name === 'vuetify:import') > -1)
        throw new Error('Remove vite-plugin-vuetify from your Nuxt config file, this module registers a modified version.')
    },
    async transform(code, id) {
      const { query, path } = parseId(id)

      if (
        ((!query || !('vue' in query)) && extname(path) === '.vue' && !/^import { render as _sfc_render } from ".*"$/m.test(code))
        || (query && 'vue' in query && (query.type === 'template' || (query.type === 'script' && query.setup === 'true')))
      ) {
        const { code: imports, source } = generateImports(code, options)
        return {
          code: source + imports,
          map: null,
        }
      }

      return null
    },
  }
}
