import { isAbsolute } from 'pathe'
import { pathToFileURL } from 'node:url'
import type { VuetifyNuxtContext } from './config'
import type { Nuxt } from '@nuxt/schema'
import { addPlugin, addTemplate, extendWebpackConfig, isNuxtMajorVersion, resolvePath } from '@nuxt/kit'
import { RESOLVED_VIRTUAL_MODULES } from '../vite/constants'
import { registerComposableImports } from './composables'
import { toKebabCase } from './index'
import { applyCascadeLayersHeadStyle, resolveVuetifyConfigFile } from './styles'
import { addVuetifyNuxtPlugins } from './vuetify-nuxt-plugins'

/**
 * Dart Sass resolves `@use` arguments as URLs, so a bare Windows path such as
 * `C:/foo/bar.scss` is read as the scheme `c:` and never reaches the filesystem
 * importer (`Can't find stylesheet to import`). On POSIX the resolved path
 * starts with `/`, which Sass accepts, so only Windows is affected. Emitting a
 * `file://` URL works on every platform and also handles spaces in the path.
 *
 * POSIX absolute paths get the same treatment rather than being left bare, which is what upstream
 * `@vuetify/unplugin-styles` does for both its `sassPath` and its `configFile` — the two halves of
 * the `@use` list are then written in one vocabulary instead of two.
 *
 * Absolute only. A relative path comes back unchanged because there is no directory to resolve it
 * against here, and the one call site (`resolvePath`) never produces one. "Absolute" is decided by
 * `pathe.isAbsolute` rather than `node:path.isAbsolute`: the latter follows the host platform, so a
 * Windows path would be treated as relative when the module runs on POSIX (and vice versa). The rest
 * of this module already uses `pathe` for path semantics (`styles.ts`), so this keeps one definition.
 *
 * Known limit: a UNC path (`\\server\share\x.scss`) is absolute and becomes a `file://server/...`
 * URL with a non-empty host, which Dart Sass's filesystem importer may refuse to map. Left as is
 * because it could not be reproduced here — a project on a network share is the case to try first.
 *
 * The apostrophe is encoded on BOTH branches, not just the URL one: `pathToFileURL` leaves `'` alone
 * (RFC 3986 lists it as a sub-delimiter, so it is legal in a URL path) while the call site wraps the
 * result in SINGLE quotes — a path like `O'Brien/settings.scss` would end the string early and
 * produce a stylesheet that is a syntax error rather than a stylesheet. A relative path can carry
 * an apostrophe too, and this is an exported pure transform, so it must not rely on the call site
 * happening to pass an absolute path.
 *
 * Exported for the unit test. It is a pure string transform, and on a non-Windows CI that test is
 * the only way the Windows branch can be exercised at all.
 */
export function toSassImportUrl (path: string): string {
  const url = isAbsolute(path) ? pathToFileURL(path).href : path
  return url.replaceAll("'", '%27')
}

export function getTemplate (source: string, settings: string | null): string {
  return [settings ? `@use '${toSassImportUrl(settings)}';` : '', `@use '${source}';`].filter(Boolean).join('\n')
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
      const configFile = resolveVuetifyConfigFile(styles.configFile, nuxt)
      ctx.stylesConfigFile = await resolvePath(configFile)
      const a = addTemplate({
        // Write to disk: without `write` Nuxt serves the template from its
        // virtual FS, which 404s on Windows/SSR when the browser requests the
        // real file (#363). Nest under `vuetify/` to match unplugin-styles.
        write: true,
        filename: 'vuetify/vuetify.settings.scss',
        getContents: async () => getTemplate('vuetify/styles', ctx.stylesConfigFile!),
      })
      nuxt.options.css.push(a.dst)
    } else if (ctx.vuetifyGte('4.0.0')) {
      nuxt.options.css.push(await resolvePath('vuetify/styles/core'))
      if (styles === true || (typeof styles === 'object' && styles?.utilities !== false)) {
        nuxt.options.css.push(await resolvePath('vuetify/styles/utilities'))
      }
      if (styles === true || (typeof styles === 'object' && styles?.colors !== false)) {
        nuxt.options.css.push(await resolvePath('vuetify/styles/colors'))
      }
    } else {
      nuxt.options.css.push(await resolvePath('vuetify/styles'))
    }
  }

  // Inline the establishing cascade-layer order into the SSR'd <head> so layer
  // priority is parsed before any runtime-injected component <style>. Otherwise
  // injection order decides priority and `vuetify-core.reset` can outrank
  // component rules (#381). Vuetify 4 only; opt out / customise via cascadeLayers.
  applyCascadeLayersHeadStyle(nuxt, styles, ctx.moduleOptions.cascadeLayers, ctx.vuetifyGte('4.0.0'))

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
    let composables = ['useDate', 'useLocale', 'useDefaults', 'useDisplay', 'useLayout', 'useRtl', 'useTheme']
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

    if (Array.isArray(importComposables)) {
      composables = composables.filter(name => importComposables.includes(name))
    }

    registerComposableImports(nuxt, {
      composables,
      prefix: prefixComposables,
      toImport: ({ name, as }) => {
        let from = ctx.vuetifyGte('3.4.0') || name !== 'useDate' ? 'vuetify' : 'vuetify/labs/date'
        if (name === 'useRules' && ctx.rulesConfiguration?.fromLabs) {
          from = 'vuetify/labs/rules'
        }
        return {
          name,
          from,
          as,
          meta: { docsUrl: name === 'useRules' ? 'https://vuetifyjs.com/en/features/rules/' : `https://vuetifyjs.com/en/api/${toKebabCase(name)}/` },
        }
      },
      onPrefixed: renames => {
        if (!ctx.isDev) {
          return
        }
        for (const { name, as } of renames) {
          ctx.logger.info(
            `[vuetify-nuxt-module] Vuetify's \`${name}\` collides with a built-in auto-import and was registered as \`${as}\`. `
            + 'Set `vuetify.moduleOptions.prefixComposables` to override.',
          )
        }
      },
    })
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
