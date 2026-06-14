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
  // On reload, skip nuxt.options mutations (they trigger a Nitro dev:reload and
  // accumulate duplicates); icon CDN/CSS <head> changes then need a restart.
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

// Returns a fn that invalidates our virtual config modules on the given graph
// (the legacy ModuleGraph or a Vite Environment's EnvironmentModuleGraph).
function bindInvalidator<M> (graph: {
  getModuleById: (id: string) => M | null | undefined
  invalidateModule: (mod: M) => void
}) {
  return () => {
    for (const id of RESOLVED_VIRTUAL_MODULES) {
      const mod = graph.getModuleById(id)
      if (mod) {
        graph.invalidateModule(mod)
      }
    }
  }
}

export function registerWatcher (options: VuetifyModuleOptions, nuxt: Nuxt, ctx: VuetifyNuxtContext) {
  if (!nuxt.options.dev) {
    return
  }

  // Older Nuxt (Vite 6) can't evict the SSR runner cache — fall back to restart.
  if (!ctx.canHmrConfig) {
    for (const file of ctx.vuetifyFilesToWatch) {
      nuxt.options.watch.push(file)
    }
    return
  }

  let clientServer: ViteDevServer | undefined
  let invalidateSsrModules: (() => void) | undefined

  nuxt.hook('vite:serverCreated', (server, { isClient }) => {
    // Capture the SSR module graph regardless of `experimental.viteEnvironmentApi`:
    // a dedicated SSR dev server when it's off, else the single server's `ssr`
    // environment (which only emits an isClient event).
    if (!isClient) {
      invalidateSsrModules = bindInvalidator(server.moduleGraph)
      return
    }
    if (!server.ws) {
      return
    }

    clientServer = server
    const ssrEnv = server.environments?.ssr
    if (ssrEnv) {
      invalidateSsrModules ??= bindInvalidator(ssrEnv.moduleGraph)
    }
    // Feed the config files to vite-node's `invalidates` set on edit.
    server.watcher.add(ctx.vuetifyFilesToWatch)
  })

  // Refresh ctx, invalidate the SSR transforms, then full-reload the browser.
  // Awaited in handleHotUpdate to win the race against the next render's drain.
  async function reloadConfig () {
    await load(options, nuxt, ctx, true)
    invalidateSsrModules?.()
    clientServer?.ws.send({ type: 'full-reload' })
  }

  addVitePlugin({
    name: 'vuetify:configuration:watch',
    enforce: 'pre',
    async handleHotUpdate ({ file }) {
      if (clientServer && ctx.vuetifyFilesToWatch.includes(file)) {
        await reloadConfig()
        return [] // handled; skip vite's own full-reload
      }
    },
  })
}
