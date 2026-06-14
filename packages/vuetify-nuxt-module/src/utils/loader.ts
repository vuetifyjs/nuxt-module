import type { Nuxt } from '@nuxt/schema'
import type { ModuleNode } from 'vite'
import type { VOptions, VuetifyModuleOptions } from '../types'
import type { VuetifyNuxtContext } from './config'
import { addVitePlugin } from '@nuxt/kit'
import defu from 'defu'
import { relative, resolve } from 'pathe'
import { debounce } from 'perfect-debounce'
import { RESOLVED_VIRTUAL_MODULES } from '../vite/constants'
import { prepareIcons } from './icons'
import { mergeVuetifyModules } from './layers'
import { cleanupBlueprint, detectDate, multipleDateAdaptersError, resolveVuetifyComponents } from './module'
import { prepareSSRClientHints } from './ssr-client-hints'

export async function load (
  options: VuetifyModuleOptions,
  nuxt: Nuxt,
  ctx: VuetifyNuxtContext,
  reload = false,
) {
  const {
    configuration,
    vuetifyConfigurationFilesToWatch,
  } = await mergeVuetifyModules(options, nuxt, ctx)

  // we only need to load json files once
  if (ctx.componentsPromise === undefined) {
    const {
      componentsPromise,
      labComponentsPromise,
    } = resolveVuetifyComponents(ctx.resolver, ctx.vuetifyBase)
    ctx.componentsPromise = componentsPromise
    ctx.labComponentsPromise = labComponentsPromise
  }

  const { vuetifyOptions = {} } = configuration

  const {
    directives: _directives,
    labComponents: _labComponents,
    ...vOptions
  } = vuetifyOptions

  // Prepare options for the runtime plugin
  const vuetifyAppOptions = <VOptions>defu(vOptions, {})

  cleanupBlueprint(vuetifyAppOptions)

  ctx.dateAdapter = undefined

  const dateOptions = vuetifyOptions.date

  if (dateOptions) {
    const adapter = dateOptions.adapter
    const date = detectDate(ctx.resolvePaths)
    if (!adapter && date.length > 1) {
      throw new Error(multipleDateAdaptersError(date))
    }

    if (adapter) {
      if (adapter === 'vuetify' || adapter === 'custom') {
        ctx.dateAdapter = adapter
      } else {
        if (date.includes(adapter)) {
          ctx.dateAdapter = adapter
        } else {
          ctx.logger.warn(`[vuetify-nuxt-module] Ignoring Vuetify Date configuration, date adapter "@date-io/${adapter}" not installed!`)
        }
      }
    } else if (date.length === 0) {
      ctx.dateAdapter = 'vuetify'
    } else {
      ctx.dateAdapter = date[0]
    }
  }

  /* handle old stuff */
  if (!reload) {
    const oldIcons = ctx.icons
    if (oldIcons && oldIcons.cdn?.length && nuxt.options.app.head.link) {
      nuxt.options.app.head.link = nuxt.options.app.head.link.filter(link => !link.key || !oldIcons.cdn.some(([key]) => link.key === key))
    }
  }

  /* handle new stuff */
  ctx.moduleOptions = configuration.moduleOptions!
  ctx.vuetifyOptions = configuration.vuetifyOptions!
  ctx.enableRules = ctx.moduleOptions.enableRules
  ctx.rulesConfiguration = ctx.moduleOptions.rulesConfiguration
  ctx.vuetifyFilesToWatch = Array.from(vuetifyConfigurationFilesToWatch)
  ctx.icons = prepareIcons(ctx.unocss, ctx.logger, vuetifyAppOptions, ctx.resolvePaths)
  ctx.ssrClientHints = prepareSSRClientHints(nuxt.options.app.baseURL ?? '/', ctx)

  if (
    ctx.isSSR
    && !ctx.ssrClientHints.prefersColorScheme
    && ctx.vuetifyOptions.theme
    && typeof ctx.vuetifyOptions.theme === 'object'
    && ctx.vuetifyOptions.theme.defaultTheme === 'system'
  ) {
    ctx.logger.warn('`theme.defaultTheme: "system"` cannot be resolved during SSR/SSG: the server has no access to the OS color-scheme preference, so the first paint defaults to light and may flash on dark systems. Set explicit dark/light themes and enable `moduleOptions.ssrClientHints.prefersColorScheme` (optionally `prefersColorSchemeOptions.useBrowserThemeOnly`). See the SSR guide.')
  }

  if (!reload && ctx.icons.enabled) {
    if (ctx.icons.local) {
      for (const css of ctx.icons.local) {
        nuxt.options.css.push(css)
      }
    }
    if (ctx.icons.cdn?.length) {
      nuxt.options.app.head.link ??= []
      for (const [key, href] of ctx.icons.cdn) {
        nuxt.options.app.head.link!.push({
          key,
          rel: 'stylesheet',
          href,
          type: 'text/css',
          crossorigin: 'anonymous',
        })
      }
    }
  }
}

export function registerWatcher (options: VuetifyModuleOptions, nuxt: Nuxt, ctx: VuetifyNuxtContext) {
  if (!nuxt.options.dev) {
    return
  }

  // When SSR config HMR is unsupported (older Nuxt), changes to SSR-consumed
  // virtual modules can't be evicted from the vite-node runner cache, so fall
  // back to a full dev-server restart.
  const needsRestart = !ctx.canHmrConfig

  let pageReload: (() => Promise<void>) | undefined

  nuxt.hooks.hook('builder:watch', (_event, path) => {
    if (!needsRestart) {
      return
    }
    path = relative(nuxt.options.srcDir, resolve(nuxt.options.srcDir, path))
    if (!pageReload && ctx.vuetifyFilesToWatch.includes(path)) {
      return nuxt.callHook('restart')
    }
  })

  nuxt.hook('vite:serverCreated', (server, { isClient }) => {
    if (!server.ws || !isClient) {
      return
    }

    pageReload = debounce(async () => {
      const modules: ModuleNode[] = []
      for (const v of RESOLVED_VIRTUAL_MODULES) {
        const module = server.moduleGraph.getModuleById(v)
        if (module) {
          modules.push(module)
        }
      }
      // reload configuration always: refresh ctx before the SSR runner
      // re-executes the (invalidated) virtual modules on the next render
      await load(options, nuxt, ctx, true)
      // server.reloadModule escalates to a full client reload for our
      // non-accepting virtual modules, which re-requests the SSR page.
      if (modules.length > 0) {
        await Promise.all(modules.map(m => server.reloadModule(m)))
      }
    }, 50, { trailing: false })
  })

  addVitePlugin({
    name: 'vuetify:configuration:watch',
    enforce: 'pre',
    handleHotUpdate ({ file }) {
      if (!ctx.vuetifyFilesToWatch.includes(file)) {
        return
      }
      if (needsRestart) {
        // restart is driven by the builder:watch hook above; suppress the
        // default client HMR for the (stale-until-restart) virtual module.
        return []
      }
      if (pageReload) {
        return pageReload()
      }
    },
  })
}
