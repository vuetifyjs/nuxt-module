import type { Nuxt } from '@nuxt/schema'
import type { ViteDevServer } from 'vite'
import type { VOptions, VuetifyModuleOptions } from '../types'
import type { VuetifyNuxtContext } from './config'
import { addVitePlugin } from '@nuxt/kit'
import defu from 'defu'
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
  } = await mergeVuetifyModules(options, nuxt)

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
  // On a dev config reload we deliberately leave nuxt.options (css + head links)
  // untouched: re-mutating them would trigger a full Nitro dev:reload (defeating
  // the HMR fast-path) and accumulate duplicate entries. Trade-off: changing the
  // icon CDN/local CSS in a config file needs a manual restart to update <head>.
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

  // see note above — skipped on reload
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

  // Legacy fallback: on Nuxt versions whose vite-node can't evict SSR-consumed
  // virtual modules from its runner cache (ctx.canHmrConfig === false), hot
  // reload isn't possible — register the config files with Nuxt so it restarts
  // the dev server natively when any of them changes.
  if (!ctx.canHmrConfig) {
    for (const file of ctx.vuetifyFilesToWatch) {
      nuxt.options.watch.push(file)
    }
    return
  }

  let ssrServer: ViteDevServer | undefined

  nuxt.hook('vite:serverCreated', (server, { isClient }) => {
    // The SSR moduleGraph lives on the server-environment vite server. Capture
    // it so a config edit can invalidate the virtual config module's SSR
    // transform (forcing its load() to re-run with the freshly reloaded ctx).
    if (!isClient) {
      ssrServer = server
      return
    }
    if (!server.ws) {
      return
    }

    // Add the config sources to the client vite server's chokidar watcher so
    // Nuxt's vite-node plugin (`clientServer.watcher.on('all')`) adds them to
    // its `invalidates` set on edit. On the next SSR render the vite-node
    // runner cascades the config file through its importer tree — config file
    // -> `\0virtual:vuetify-configuration` (via the dev-SSR-only import edge the
    // configuration plugin emits) -> the Vuetify plugin -> the server entry —
    // and re-renders, all without a dev-server restart.
    server.watcher.add(ctx.vuetifyFilesToWatch)
  })

  // Re-read the config into ctx (without re-mutating nuxt.options — see load()'s
  // `reload` flag) so the virtual modules emit fresh content, then invalidate
  // their SSR transforms so the runner re-fetches that content. Awaited inside
  // handleHotUpdate so it completes before Nuxt's vite-node runner drains the
  // `invalidates` set on the next render — otherwise a request landing between
  // the watcher feeding `invalidates` and this invalidation would lock in the
  // stale transform (the drain clears the set, so no further re-render fires).
  // We deliberately do NOT call server.reloadModule / send a full-reload: that
  // suspends SSR for plain (non-browser) requests until a client reconnects.
  async function reloadConfig () {
    await load(options, nuxt, ctx, true)
    if (!ssrServer) {
      return
    }
    for (const id of RESOLVED_VIRTUAL_MODULES) {
      const mod = ssrServer.moduleGraph.getModuleById(id)
      if (mod) {
        ssrServer.moduleGraph.invalidateModule(mod)
      }
    }
  }

  addVitePlugin({
    name: 'vuetify:configuration:watch',
    enforce: 'pre',
    async handleHotUpdate ({ file }) {
      if (ssrServer && ctx.vuetifyFilesToWatch.includes(file)) {
        await reloadConfig()
        // Returning an empty array marks the update handled with no modules to
        // apply, so vite does not escalate to a client full-reload.
        return []
      }
    },
  })
}
