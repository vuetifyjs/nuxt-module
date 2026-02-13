import type { Plugin } from 'vite'
import path from 'pathe'

const pluginName = 'vuetify:styles:nuxt'

const RE_VUETIFY_STYLE_IMPORT = /^(?:\/)?virtual:vuetify-custom-styles(?:\?|$)/

const VIRTUAL_VUETIFY_STYLE = 'virtual:vuetify-style.scss'
const RE_VIRTUAL_VUETIFY_STYLE = new RegExp(VIRTUAL_VUETIFY_STYLE)

const SCSS_VUETIFY_STYLE_PATH = 'vuetify/lib/styles/main.scss'
const SASS_VUETIFY_STYLE_PATH = 'vuetify/lib/styles/main.sass'
const CSS_VUETIFY_STYLE_PATH = 'vuetify/lib/styles/main.css'

const SOURCE_PARAM = 'source'
const SETTINGS_PARAM = 'settings'

const vuetifyPaths = {
  scss: SCSS_VUETIFY_STYLE_PATH,
  sass: SASS_VUETIFY_STYLE_PATH,
  css: CSS_VUETIFY_STYLE_PATH,
}

export interface Options {
  styles: {
    configFile: string
  }
}

export function vuetifyStylesPlugin(options: Options, _viteVersion: string, _logger: any): Plugin {
  let appRoot: string | null = null

  return {
    name: pluginName,
    configResolved(config) {
      appRoot = config.root
    },
    resolveId: {
      filter: {
        id: RE_VUETIFY_STYLE_IMPORT
      },
      async handler(id, importer) {
        const inlineSource = new URLSearchParams(id.split('?')[1]).get(SETTINGS_PARAM)
        if (inlineSource) {
          const resolveDir = importer || appRoot || ''
          const params = new URLSearchParams(id.split('?')[1])
          params.set(SOURCE_PARAM, resolveDir)
          params.set(SETTINGS_PARAM, inlineSource)
          return VIRTUAL_VUETIFY_STYLE + '?' + params.toString()
        }
        return this.resolve(vuetifyPaths.css, 'vuetify', { skipSelf: true })
      }
    },
    load: {
      filter: {
        id: RE_VIRTUAL_VUETIFY_STYLE
      },
      async handler(id) {
        const params = new URLSearchParams(id.split('?')[1])
        const source = params.get(SOURCE_PARAM)
        const settings = params.get(SETTINGS_PARAM)

        const VUETIFY = await this.resolve(vuetifyPaths.sass, 'vuetify') ?? await this.resolve(vuetifyPaths.scss, 'vuetify')

        if (!VUETIFY) {
          console.error(`[${pluginName}:load] vuetify not found`, id)
          return
        }

        if (source && settings) {
          let settingsPath = null
          try {
            if (source.startsWith('virtual:') || source.endsWith('.html') || source === 'undefined') {
              settingsPath = await this.resolve(settings, appRoot || '')
            } else {
              settingsPath = await this.resolve(settings, source)
            }
          } catch (e) {
             console.error(`[${pluginName}:load]`, e)
             settingsPath = await this.resolve(settings, appRoot || '')
          }

          if (!settingsPath) {
             console.error(`[${pluginName}:load] settingsPath not found`, settings, source)
             return
          }

          this.addWatchFile(settingsPath.id)

          return {
            code: `@use '${path.normalize(settingsPath.id)}';
@use '${path.normalize(VUETIFY!.id)}';
`,
          }
        }
      },
    },
  }
}
