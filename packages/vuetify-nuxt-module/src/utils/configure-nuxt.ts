import type { Nuxt } from '@nuxt/schema'
import type { VuetifyNuxtContext } from './config'
import { addImports, addPlugin, addTemplate, extendWebpackConfig, isNuxtMajorVersion, resolvePath } from '@nuxt/kit'
import { RESOLVED_VIRTUAL_MODULES } from '../vite/constants'
import { toKebabCase } from './index'
import { addVuetifyNuxtPlugins } from './vuetify-nuxt-plugins'

export function getTemplate (source: string, settings: string | null): string {
  return [settings ? `@use '${settings}';` : '', `@use '${source}';`].filter(Boolean).join('\n')
}

export async function configureNuxt (
  configKey: string,
  nuxt: Nuxt,
  ctx: VuetifyNuxtContext,
) {
  const {
    styles,
    importComposables,
    prefixComposables,
  } = ctx.moduleOptions

  const runtimeDir = ctx.resolver.resolve('./runtime')

  // Automatically enable rules if not disabled
  if (ctx.enableRules === undefined) {
    ctx.enableRules = ctx.vuetifyGte('3.8.0')
  }

  if (styles !== 'none' && (styles as any) !== false) {
    nuxt.options.css ??= []
    if (typeof styles === 'object' && 'configFile' in styles) {
      const a = addTemplate({
        filename: 'vuetify.settings.scss',
        getContents: async () => getTemplate('vuetify/styles', await resolvePath(styles.configFile)),
      })
      nuxt.options.css.push(a.dst)
    } else if (ctx.vuetifyGte('4.0.0')) {
      nuxt.options.css.push(await resolvePath('vuetify/styles/core'))
      if (typeof styles === 'object' && styles?.utilities !== false) {
        nuxt.options.css.push(await resolvePath('vuetify/styles/utilities'))
      }
      if (typeof styles === 'object' && styles?.colors !== false) {
        nuxt.options.css.push(await resolvePath('vuetify/styles/colors'))
      }
    } else {
      nuxt.options.css.push(await resolvePath('vuetify/styles'))
    }
  }

  // transpile always vuetify and runtime folder
  nuxt.options.build.transpile.push(configKey, runtimeDir)
  if (ctx.enableRules) {
    const rulesConfigurationFile = `vuetify/${ctx.rulesConfiguration!.fromLabs ? 'labs-' : ''}rules-configuration.mjs`
    nuxt.options.build.transpile.push(`#build/${rulesConfigurationFile}`)
    addTemplate({
      filename: rulesConfigurationFile,
      getContents: async () => {
        if (ctx.rulesConfiguration?.configFile) {
          const resolvedPath = await resolvePath(ctx.rulesConfiguration.configFile)
          return `export { default as rulesOptions } from '${resolvedPath}'`
        }

        return 'export const rulesOptions = {}'
      },
      write: true,
    })
  }
  // transpile vuetify nuxt plugin
  nuxt.options.build.transpile.push(/\/vuetify-nuxt-plugin\.(client|server)\.mjs$/)
  // transpile all virtual configuration modules
  // check nuxt:imports-transform unplugin: packages/nuxt/src/imports/transform.ts
  nuxt.options.imports.transform ??= {}
  nuxt.options.imports.transform.include ??= []
  for (const virtual of RESOLVED_VIRTUAL_MODULES) {
    nuxt.options.imports.transform.include.push(new RegExp(`${virtual}$`))
  }

  extendWebpackConfig(() => {
    throw new Error('Webpack is not supported: vuetify-nuxt-module module can only be used with Vite!')
  })

  const v4Available = isNuxtMajorVersion(4, nuxt)

  nuxt.hook('prepare:types', ({ references, nodeReferences }) => {
    references.push({ types: 'vuetify' }, { types: 'vuetify-nuxt-module/custom-configuration' }, { types: 'vuetify-nuxt-module/configuration' }, { path: ctx.resolver.resolve(runtimeDir, 'plugins/types') })
    if (ctx.enableRules) {
      references.push({ types: `vuetify-nuxt-module/custom-${ctx.rulesConfiguration!.fromLabs ? 'labs-' : ''}rules-configuration` })
    }

    if (v4Available) {
      nodeReferences.push({ types: 'vuetify-nuxt-module/custom-configuration' })
      if (ctx.enableRules) {
        nodeReferences.push({ types: `vuetify-nuxt-module/custom-${ctx.rulesConfiguration!.fromLabs ? 'labs-' : ''}rules-configuration` })
      }
    }
  })

  if (importComposables) {
    const composables = ['useDate', 'useLocale', 'useDefaults', 'useDisplay', 'useLayout', 'useRtl', 'useTheme']
    if (ctx.vuetifyGte('3.5.0')) {
      composables.push('useGoTo')
    }
    if (ctx.vuetifyGte('3.8.0')) {
      composables.push('useHotkey')
      if (ctx.enableRules) {
        composables.push('useRules')
      }
    }
    if (ctx.vuetifyGte('3.10.0')) {
      composables.push('useMask')
    }

    addImports(composables.map(name => {
      let from = ctx.vuetifyGte('3.4.0') || name !== 'useDate' ? 'vuetify' : 'vuetify/labs/date'
      if (name === 'useRules' && ctx.rulesConfiguration?.fromLabs) {
        from = 'vuetify/labs/rules'
      }
      return {
        name,
        from,
        as: prefixComposables ? name.replace(/^use/, 'useV') : undefined,
        meta: { docsUrl: name === 'useRules' ? 'https://vuetifyjs.com/en/features/rules/' : `https://vuetifyjs.com/en/api/${toKebabCase(name)}/` },
      }
    }))
  }

  if (ctx.ssrClientHints.enabled) {
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-client-hints.client'),
      mode: 'client',
    })
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-client-hints.server'),
      mode: 'server',
    })
  } else {
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-no-client-hints'),
    })
  }

  addPlugin({
    src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-icons'),
  })

  if (ctx.i18n) {
    addPlugin({
      src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-i18n'),
    })
  }

  if (nuxt.options.dev || ctx.dateAdapter) {
    if (ctx.i18n) {
      addPlugin({
        src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-i18n-date'),
      })
    } else {
      addPlugin({
        src: ctx.resolver.resolve(runtimeDir, 'plugins/vuetify-date'),
      })
    }
  }

  addVuetifyNuxtPlugins(nuxt, ctx)
}
