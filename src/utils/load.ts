import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'
import type { ModuleNode } from 'vite'
import { debounce } from 'perfect-debounce'
import { addVitePlugin } from '@nuxt/kit'
import type { ModuleOptions, VOptions } from '../types'
import { RESOLVED_VIRTUAL_MODULES } from '../vite/constants'
import { mergeVuetifyModules } from './layers'
import { cleanupBlueprint, detectDate, resolveVuetifyComponents } from './module'
import { prepareIcons } from './icons'
import type { VuetifyNuxtContext } from './config'

export async function load(
  options: ModuleOptions,
  nuxt: Nuxt,
  ctx: VuetifyNuxtContext,
) {
  const {
    configuration,
    vuetifyConfigurationFilesToWatch,
  } = await mergeVuetifyModules(options, nuxt)

  // we only need to load json files once
  if (typeof ctx.componentsPromise === 'undefined') {
    const {
      componentsPromise,
      labComponentsPromise,
    } = resolveVuetifyComponents(ctx.resolver)
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
    const date = detectDate()
    if (!adapter && date.length > 1)
      throw new Error(`Multiple date adapters found: ${date.map(d => `@date-io/${d[0]}`).join(', ')}, please specify the adapter to use in the "vuetifyOptions.date.adapter" option.`)

    if (adapter) {
      if (adapter === 'vuetify' || adapter === 'custom') {
        ctx.dateAdapter = adapter
      }
      else {
        if (date.find(d => d === adapter) === undefined)
          ctx.logger.warn(`Ignoring Vuetify Date configuration, date adapter "@date-io/${adapter}" not installed!`)
        else
          ctx.dateAdapter = adapter
      }
    }
    else if (date.length === 0) {
      ctx.dateAdapter = 'vuetify'
    }
    else {
      ctx.dateAdapter = date[0]
    }
  }

  /* handle old stuff */
  const oldIcons = ctx.icons
  if (oldIcons && oldIcons.cdn?.length && nuxt.options.app.head.link)
    nuxt.options.app.head.link = nuxt.options.app.head.link.filter(link => !link.key || !oldIcons.cdn.some(([key]) => link.key === key))

  /* handle new stuff */
  ctx.moduleOptions = configuration.moduleOptions!
  ctx.vuetifyOptions = configuration.vuetifyOptions!
  ctx.vuetifyFilesToWatch = Array.from(vuetifyConfigurationFilesToWatch)
  ctx.icons = prepareIcons(ctx.unocss, ctx.logger, vuetifyAppOptions)

  if (ctx.icons.enabled) {
    ctx.icons.local?.forEach(css => nuxt.options.css.push(css))
    if (ctx.icons.cdn?.length) {
      nuxt.options.app.head.link ??= []
      ctx.icons.cdn.forEach(([key, href]) => nuxt.options.app.head.link!.push({
        key,
        rel: 'stylesheet',
        href,
        type: 'text/css',
        crossorigin: 'anonymous',
      }))
    }
  }
}

export function registerWatcher(options: ModuleOptions, nuxt: Nuxt, ctx: VuetifyNuxtContext) {
  if (nuxt.options.dev) {
    let pageReload: (() => Promise<ModuleNode[]>) | undefined

    nuxt.hooks.hook('builder:watch', (_event, path) => {
      if (!pageReload && ctx.vuetifyFilesToWatch.includes(path))
        return nuxt.callHook('restart')
    })

    nuxt.hook('vite:serverCreated', (server, { isClient }) => {
      if (!server.ws || !isClient)
        return

      pageReload = debounce(async () => {
        const modules: ModuleNode[] = []
        for (const v of RESOLVED_VIRTUAL_MODULES) {
          const module = server.moduleGraph.getModuleById(v)
          if (module) {
            modules.push(module)
            module.importers.forEach(i => modules.push(i))
          }
        }
        // reload configuration always
        await load(options, nuxt, ctx)
        if (modules.length)
          await Promise.all(modules.map(m => server.reloadModule(m)))

        return modules
      }, 100, { trailing: true })
    })

    addVitePlugin({
      name: 'vuetify:configuration:watch',
      enforce: 'pre',
      handleHotUpdate({ file }) {
        if (pageReload && ctx.vuetifyFilesToWatch.includes(file))
          return pageReload()
      },
    })
  }
}
