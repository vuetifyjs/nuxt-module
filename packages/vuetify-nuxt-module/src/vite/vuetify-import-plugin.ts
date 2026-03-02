import type { Options } from '@vuetify/loader-shared'
import type { Plugin } from 'vite'
import { pathToFileURL } from 'node:url'
import { generateImports } from '@vuetify/loader-shared'
import destr from 'destr'
import { isAbsolute } from 'pathe'
import { parseQuery, parseURL } from 'ufo'
import { createFilter } from 'vite'

function parseId2 (id: string) {
  id = id.replace(/^(virtual:nuxt:|virtual:)/, '')
  return parseURL(decodeURIComponent(isAbsolute(id) ? pathToFileURL(id).href : id))
}

function parseId (id: string) {
  const { search, pathname } = parseId2(id)
  const query = parseQuery(search)
  const urlProps = query.props ? destr<Record<string, any>>(query.props as string) : undefined

  return {
    query: urlProps,
    path: pathname ?? id,
  }
}

export function vuetifyImportPlugin (options: Options) {
  let filter: (id: unknown) => boolean
  return <Plugin>{
    name: 'vuetify:import:nuxt',
    configResolved (config) {
      if (config.plugins.some(plugin => plugin.name === 'vuetify:import')) {
        throw new Error('Remove vite-plugin-vuetify from your Nuxt config file, this module registers a modified version.')
      }

      const vueIdx = config.plugins.findIndex(plugin => plugin.name === 'vite:vue')
      const vueOptions = vueIdx === -1 ? {} : config.plugins[vueIdx].api?.options
      filter = createFilter(vueOptions.include, vueOptions.exclude)
    },
    async transform (code, id) {
      const { query, path } = parseId(id)

      const isVueVirtual = query && 'vue' in query
      const isVueFile = !isVueVirtual
        && filter(path)
        && !/^import { render as _sfc_render } from ".*"$/m.test(code)
      const isVueTemplate = isVueVirtual && (
        query.type === 'template'
        || (query.type === 'script' && query.setup === 'true')
      )

      if (isVueFile || isVueTemplate) {
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
