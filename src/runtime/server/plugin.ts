import type { NitroAppPlugin } from 'nitropack'

// @ts-expect-error no types
import ssrClientHintsConfiguration from '#internal/vuetify-no-ssr-page/conf.mjs'

export const nitroPlugin: NitroAppPlugin = (nitroApp) => {
  const { prefersColorScheme, prefersColorSchemeOptions } = ssrClientHintsConfiguration
  if (!prefersColorScheme || !prefersColorSchemeOptions)
    return

  const { baseUrl, cookieName, defaultTheme } = prefersColorSchemeOptions

  nitroApp.hooks.hook('beforeResponse', (event) => {
    if ('_nitro' in event.context) {
      const routeRules = event.context._nitro.routeRules
      if (routeRules && routeRules.ssr === false) {
        const configuredSetCookie = event.node.res.getHeader('set-cookie')
        const configuredServerTiming = event.node.res.getHeader('server-timing')
        const date = new Date()
        const expires = new Date(date.setDate(date.getDate() + 365))
        const themeName = event.node.req.headers.cookie?.split(';').find(cookie => cookie.startsWith(`${cookieName}=`))?.split('=')[1] ?? defaultTheme
        const setCookie = [`${cookieName}=${themeName}; Path=${baseUrl}; Expires=${expires.toUTCString()}; SameSite=Lax`]
        if (typeof configuredSetCookie !== 'undefined') {
          if (Array.isArray(configuredSetCookie))
            setCookie.unshift(...configuredSetCookie)
          else
            setCookie.unshift(typeof configuredSetCookie === 'string' ? configuredSetCookie : configuredSetCookie.toString())
        }
        const serverTiming = [`${cookieName};desc="${setCookie[0]}"`]
        if (typeof configuredServerTiming !== 'undefined') {
          if (Array.isArray(configuredServerTiming))
            serverTiming.unshift(...configuredServerTiming)
          else
            serverTiming.unshift(typeof configuredServerTiming === 'string' ? configuredServerTiming : configuredServerTiming.toString())
        }
        event.node.res.setHeader('set-cookie', setCookie)
        event.node.res.setHeader('server-timing', serverTiming)
      }
    }
  })
}

export default nitroPlugin
