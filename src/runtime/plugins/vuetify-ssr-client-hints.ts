import type { IncomingHttpHeaders, ServerResponse } from 'node:http'

import { type ClientHints, clientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'
import { defineNuxtPlugin } from '#imports'
import { useNuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const clientHints = clientHintsConfiguration()
  const state = useState<SSRClientHints>('ssrClientHints')
  const event = useRequestEvent(nuxtApp)

  if (!event) {
    const { viewportSize, prefersColorScheme, prefersColorSchemeOptions } = clientHints
    if (viewportSize || (prefersColorScheme && prefersColorSchemeOptions)) {
      nuxtApp.hook('app:beforeMount', () => {
        const vuetify = useNuxtApp().$vuetify
        // on client, we update the display to avoid hydration mismatch on page refresh
        // there will be some hydration mismatch since the headers sent by the user agent may not be accurate
        if (viewportSize)
          vuetify.display.update()

        // update the theme
        if (prefersColorScheme && prefersColorSchemeOptions) {
          const cookieName = prefersColorSchemeOptions.cookieName
          const parseCookieName = `${cookieName}=`
          const theme = state.value.ssrClientHints.colorSchemeFromCookie ?? prefersColorSchemeOptions.defaultTheme

          if (theme)
            vuetify.theme.global.name.value = theme

          watch(() => vuetify.theme.global.name.value, (newThemeName) => {
            const newCookies: string[] = []
            document.cookie.split(';').map(c => c.trim()).forEach((c) => {
              if (c.startsWith(parseCookieName))
                newCookies.push(`${cookieName}=${newThemeName}`)
              else
                newCookies.push(c)
            })
            document.cookie = newCookies.join('; ')
          })
        }
      })
    }
    return {
      provide: reactive({
        ssrClientHints: state,
      }),
    }
  }

  const request = event.node.req
  const response = event.node.res

  const requestHeaders = request.headers ?? {}

  // 1. check if we should send client hints
  // TODO: detect user agent
  // 2. prepare client hints request
  const clientHintsRequest = collectClientHints(clientHints, requestHeaders)
  // 3. send client hints request
  const responseHeader = createClientHintsResponseHeaders(clientHints)
  Object.entries(responseHeader).forEach(([key, value]) => {
    response.setHeader(key, value)
  })
  // 4. send the theme cookie to the client
  if (clientHints.prefersColorScheme && clientHints.prefersColorSchemeOptions) {
    sendThemeCookie(
      clientHints.prefersColorSchemeOptions!.cookieName,
      clientHintsRequest.colorSchemeFromCookie ?? clientHints.prefersColorSchemeOptions.defaultTheme,
      clientHints.prefersColorSchemeOptions!.baseUrl,
      response,
    )
  }

  state.value = {
    ssrClientHints: clientHintsRequest,
  }

  nuxtApp.hook('vuetify:before-create', async ({ vuetifyOptions }) => {
    const clientWidth = clientHintsRequest.viewPortWidth
    const clientHeight = clientHintsRequest.viewportHeight
    vuetifyOptions.ssr = typeof clientWidth === 'number'
      ? {
          clientWidth,
          clientHeight,
        }
      : true

    // update theme from cookie
    if (clientHintsRequest.colorSchemeFromCookie)
      vuetifyOptions.theme.defaultTheme = clientHintsRequest.colorSchemeFromCookie

    await nuxtApp.hooks.callHook('vuetify:ssr-client-hints', {
      vuetifyOptions,
      ssrClientHints: state.value,
    })
  })

  return {
    provide: reactive({
      ssrClientHints: state,
    }),
  }
})

const AcceptClientHintsHeaders = {
  prefersColorScheme: 'Sec-CH-Prefers-Color-Scheme',
  prefersReducedMotion: 'Sec-CH-Prefers-Reduced-Motion',
  viewportHeight: 'Sec-CH-Viewport-Height',
  viewPortWidth: 'Sec-CH-Viewport-Width',
}

type AcceptClientHintsHeadersKey = keyof typeof AcceptClientHintsHeaders

const AcceptClientHintsRequestHeaders = Object.entries(AcceptClientHintsHeaders).reduce((acc, [key, value]) => {
  acc[key as AcceptClientHintsHeadersKey] = value.toLowerCase()
  return acc
}, {} as Record<AcceptClientHintsHeadersKey, string>)

const ClientHeaders = ['Accept-CH', 'Vary', 'Critical-CH']

interface ClientHintsRequest {
  prefersColorScheme?: 'dark' | 'light' | 'no-preference'
  prefersReducedMotion?: 'no-preference' | 'reduce'
  viewportHeight?: number
  viewPortWidth?: number
  colorSchemeFromCookie?: string
}

interface SSRClientHints {
  ssrClientHints: ClientHintsRequest
}

function readClientHeader(name: string, headers: IncomingHttpHeaders) {
  const value = headers[name]
  if (Array.isArray(value))
    return value[0]

  return value
}

function collectClientHints(clientHints: ClientHints, headers: IncomingHttpHeaders) {
  const hints: ClientHintsRequest = {}

  if (clientHints.prefersColorScheme) {
    if (clientHints.prefersColorSchemeOptions) {
      const cookieName = clientHints.prefersColorSchemeOptions.cookieName
      const cookieValue = readClientHeader('cookie', headers)?.split(';').find(c => c.trim().startsWith(`${cookieName}=`))
      if (cookieValue) {
        const value = cookieValue.split('=')?.[1].trim()
        if (clientHints.prefersColorSchemeOptions.themeNames.includes(value))
          hints.colorSchemeFromCookie = value
      }
    }
    if (!hints.colorSchemeFromCookie) {
      const value = readClientHeader(AcceptClientHintsRequestHeaders.prefersColorScheme, headers)?.toLowerCase()
      if (value === 'dark' || value === 'light' || value === 'no-preference')
        hints.prefersColorScheme = value

      // update the color scheme cookie
      if (clientHints.prefersColorSchemeOptions) {
        if (!value || value === 'no-preference') {
          hints.colorSchemeFromCookie = clientHints.prefersColorSchemeOptions.defaultTheme
        }
        else {
          hints.colorSchemeFromCookie = value === 'dark'
            ? clientHints.prefersColorSchemeOptions.darkThemeName
            : clientHints.prefersColorSchemeOptions.lightThemeName
        }
      }
    }
  }

  if (clientHints.prefersReducedMotion) {
    const value = readClientHeader(AcceptClientHintsRequestHeaders.prefersReducedMotion, headers)?.toLowerCase()
    if (value === 'no-preference' || value === 'reduce')
      hints.prefersReducedMotion = value
  }

  if (clientHints.viewportSize) {
    let header = readClientHeader(AcceptClientHintsRequestHeaders.viewportHeight, headers)
    if (header) {
      try {
        hints.viewportHeight = Number.parseInt(header)
      }
      catch {
        hints.viewportHeight = clientHints.clientHeight
      }
    }

    header = readClientHeader(AcceptClientHintsRequestHeaders.viewPortWidth, headers)
    if (header) {
      try {
        hints.viewPortWidth = Number.parseInt(header)
      }
      catch {
        hints.viewPortWidth = clientHints.clientWidth
      }
    }
  }
  else {
    hints.viewportHeight = clientHints.clientHeight
    hints.viewPortWidth = clientHints.clientWidth
  }

  return hints
}

function writeClientHintHeaders(key: string, headers: Record<string, string[]>) {
  ClientHeaders.forEach((header) => {
    headers[header] = (headers[header] ? headers[header] : []).concat(key)
  })
}

function createClientHintsResponseHeaders(clientHints: ClientHints) {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Critical-CH
  // Each header listed in the Critical-CH header should also be present in the Accept-CH and Vary headers.

  const headers: Record<string, string[]> = {}

  if (clientHints.prefersColorScheme)
    writeClientHintHeaders(AcceptClientHintsHeaders.prefersColorScheme, headers)

  if (clientHints.prefersReducedMotion)
    writeClientHintHeaders(AcceptClientHintsHeaders.prefersReducedMotion, headers)

  if (clientHints.viewportSize) {
    writeClientHintHeaders(AcceptClientHintsHeaders.viewportHeight, headers)
    writeClientHintHeaders(AcceptClientHintsHeaders.viewPortWidth, headers)
  }

  return headers
}

function sendThemeCookie(
  cookieName: string,
  themeName: string,
  path: string,
  response: ServerResponse,
) {
  const setCookie = response.getHeaders()['Set-Cookie']
  const setCookieHeader: string[] = []
  if (typeof setCookie === 'string')
    setCookieHeader.push(setCookie)
  else if (typeof setCookie === 'number')
    setCookieHeader.push(`${setCookie}`)
  else if (Array.isArray(setCookie))
    setCookieHeader.push(...setCookie)

  const date = new Date()
  const secure = response.req.url?.startsWith('https:') ? 'Secure; ' : ''
  setCookieHeader.push(`${cookieName}=${themeName}; ${secure}SameSite=Lax; Expires=${new Date(date.setDate(date.getDate() + 365))}; Path=${path}`)
  response.setHeader('Set-Cookie', setCookieHeader)
}
