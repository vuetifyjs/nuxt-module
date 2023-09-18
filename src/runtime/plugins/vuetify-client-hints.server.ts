import type { IncomingHttpHeaders, ServerResponse } from 'node:http'
import { type ClientHints, clientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'
import type { ClientHintsRequest, SSRClientHints } from './client-hints'
import { type Browser, parseUserAgent } from './detect-browser'
import { defineNuxtPlugin, useNuxtApp } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const event = useRequestEvent()
  const clientHints = clientHintsConfiguration()
  const state = useState<SSRClientHints>('vuetify:nuxt:ssr-client-hints')

  const request = event.node.req
  const response = event.node.res

  const requestHeaders = request.headers ?? {}

  const userAgentHeader = readClientHeader('user-agent', requestHeaders)

  // 1. extract browser info
  const userAgent = userAgentHeader
    ? parseUserAgent(userAgentHeader)
    : null
  // 2. prepare client hints request
  const clientHintsRequest = collectClientHints(userAgent, clientHints, requestHeaders)
  // 3. write client hints request
  writeClientHintsResponseHeaders(clientHintsRequest, clientHints, response)
  state.value = {
    ssrClientHints: clientHintsRequest,
  }
  // 4. send the theme cookie to the client when required
  if (shouldWriteCookie(clientHintsRequest, clientHints)) {
    state.value.ssrClientHints.colorSchemeCookie = writeThemeCookie(
      clientHints.prefersColorSchemeOptions!.cookieName,
      clientHintsRequest.colorSchemeFromCookie ?? clientHints.prefersColorSchemeOptions!.defaultTheme,
      clientHints.prefersColorSchemeOptions!.baseUrl,
    )
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
      ssrClientHintsConfiguration: clientHints,
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

type BrowserFeatureAvailable = (android: boolean, versions: number[]) => boolean
type BrowserFeatures = Record<AcceptClientHintsHeadersKey, BrowserFeatureAvailable>

// Tests for Browser compatibility
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Reduced-Motion#browser_compatibility
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Color-Scheme#browser_compatibility
const chromiumBasedBrowserFeatures: BrowserFeatures = {
  prefersColorScheme: (_, v) => v[0] >= 93,
  prefersReducedMotion: (_, v) => v[0] >= 108,
  viewportHeight: (_, v) => v[0] >= 108,
  viewPortWidth: (_, v) => v[0] >= 108,
}
const allowedBrowsers: [browser: Browser, features: BrowserFeatures][] = [
  // 'edge',
  // 'edge-ios',
  ['chrome', chromiumBasedBrowserFeatures],
  ['edge-chromium', chromiumBasedBrowserFeatures],
  ['chromium-webview', chromiumBasedBrowserFeatures],
  ['opera', {
    prefersColorScheme: (android, v) => v[0] >= (android ? 66 : 79),
    prefersReducedMotion: (android, v) => v[0] >= (android ? 73 : 94),
    viewportHeight: (android, v) => v[0] >= (android ? 73 : 94),
    viewPortWidth: (android, v) => v[0] >= (android ? 73 : 94),
  }],
]

const AcceptClientHintsRequestHeaders = Object.entries(AcceptClientHintsHeaders).reduce((acc, [key, value]) => {
  acc[key as AcceptClientHintsHeadersKey] = value.toLowerCase()
  return acc
}, {} as Record<AcceptClientHintsHeadersKey, string>)

const ClientHeaders = ['Accept-CH', 'Vary', 'Critical-CH']

function readClientHeader(name: string, headers: IncomingHttpHeaders) {
  const value = headers[name]
  if (Array.isArray(value))
    return value[0]

  return value
}

function browserAvailable(userAgent: ReturnType<typeof parseUserAgent>, feature: AcceptClientHintsHeadersKey) {
  if (userAgent == null || userAgent.type !== 'browser')
    return false

  try {
    const browserName = userAgent.name
    const android = userAgent.os?.toLowerCase().startsWith('android') ?? false
    const versions = userAgent.version.split('.').map(v => Number.parseInt(v))
    return allowedBrowsers.some(([name, check]) => {
      if (browserName !== name)
        return false

      try {
        return check[feature](android, versions)
      }
      catch {
        return false
      }
    })
  }
  catch {
    return false
  }
}

function findClientHints(
  userAgent: ReturnType<typeof parseUserAgent>,
  clientHints: ClientHints,
) {
  const features: ClientHintsRequest = {
    firstRequest: true,
    prefersColorSchemeAvailable: false,
    prefersReducedMotionAvailable: false,
    viewportHeightAvailable: false,
    viewportWidthAvailable: false,
  }

  if (userAgent == null || userAgent.type !== 'browser')
    return features

  if (clientHints.prefersColorScheme)
    features.prefersColorSchemeAvailable = browserAvailable(userAgent, 'prefersColorScheme')

  if (clientHints.prefersReducedMotion)
    features.prefersReducedMotionAvailable = browserAvailable(userAgent, 'prefersReducedMotion')

  if (clientHints.viewportSize) {
    features.viewportHeightAvailable = browserAvailable(userAgent, 'viewportHeight')
    features.viewportWidthAvailable = browserAvailable(userAgent, 'viewPortWidth')
  }

  return features
}

function collectClientHints(
  userAgent: ReturnType<typeof parseUserAgent>,
  clientHints: ClientHints,
  headers: IncomingHttpHeaders,
) {
  // collect client hints
  const hints: ClientHintsRequest = findClientHints(userAgent, clientHints)

  if (clientHints.prefersColorScheme) {
    if (clientHints.prefersColorSchemeOptions) {
      const cookieName = clientHints.prefersColorSchemeOptions.cookieName
      const cookieValue = readClientHeader('cookie', headers)?.split(';').find(c => c.trim().startsWith(`${cookieName}=`))
      if (cookieValue) {
        const value = cookieValue.split('=')?.[1].trim()
        if (clientHints.prefersColorSchemeOptions.themeNames.includes(value)) {
          hints.colorSchemeFromCookie = value
          hints.firstRequest = false
        }
      }
    }
    if (!hints.colorSchemeFromCookie) {
      const value = hints.prefersColorSchemeAvailable
        ? readClientHeader(AcceptClientHintsRequestHeaders.prefersColorScheme, headers)?.toLowerCase()
        : undefined
      if (value === 'dark' || value === 'light' || value === 'no-preference') {
        hints.prefersColorScheme = value
        hints.firstRequest = false
      }

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

  if (hints.prefersReducedMotionAvailable && clientHints.prefersReducedMotion) {
    const value = readClientHeader(AcceptClientHintsRequestHeaders.prefersReducedMotion, headers)?.toLowerCase()
    if (value === 'no-preference' || value === 'reduce') {
      hints.prefersReducedMotion = value
      hints.firstRequest = false
    }
  }

  if (hints.viewportHeightAvailable && clientHints.viewportSize) {
    const header = readClientHeader(AcceptClientHintsRequestHeaders.viewportHeight, headers)
    if (header) {
      try {
        hints.viewportHeight = Number.parseInt(header)
      }
      catch {
        hints.viewportHeight = clientHints.clientHeight
      }
      hints.firstRequest = false
    }
  }
  else {
    hints.viewportHeight = clientHints.clientHeight
  }

  if (hints.viewportWidthAvailable && clientHints.viewportSize) {
    const header = readClientHeader(AcceptClientHintsRequestHeaders.viewPortWidth, headers)
    if (header) {
      try {
        hints.viewPortWidth = Number.parseInt(header)
      }
      catch {
        hints.viewPortWidth = clientHints.clientWidth
      }
      hints.firstRequest = false
    }
  }
  else {
    hints.viewPortWidth = clientHints.clientWidth
  }

  return hints
}

function writeClientHintHeaders(key: string, headers: Record<string, string[]>) {
  ClientHeaders.forEach((header) => {
    headers[header] = (headers[header] ? headers[header] : []).concat(key)
  })
}

function writeClientHintsResponseHeaders(
  clientHintsRequest: ClientHintsRequest,
  clientHints: ClientHints,
  response: ServerResponse,
) {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Critical-CH
  // Each header listed in the Critical-CH header should also be present in the Accept-CH and Vary headers.

  const headers: Record<string, string[]> = {}

  if (clientHints.prefersColorScheme && clientHintsRequest.prefersColorSchemeAvailable)
    writeClientHintHeaders(AcceptClientHintsHeaders.prefersColorScheme, headers)

  if (clientHints.prefersReducedMotion && clientHintsRequest.prefersReducedMotionAvailable)
    writeClientHintHeaders(AcceptClientHintsHeaders.prefersReducedMotion, headers)

  if (clientHints.viewportSize && clientHintsRequest.viewportHeightAvailable && clientHintsRequest.viewportWidthAvailable) {
    writeClientHintHeaders(AcceptClientHintsHeaders.viewportHeight, headers)
    writeClientHintHeaders(AcceptClientHintsHeaders.viewPortWidth, headers)
  }

  if (Object.keys(headers).length === 0)
    return

  withNuxtAppRendered(() => {
    Object.entries(headers).forEach(([key, value]) => {
      response.setHeader(key, value)
    })
  })
}

function shouldWriteCookie(
  clientHintsRequest: ClientHintsRequest,
  clientHints: ClientHints,
) {
  let writeCookie = clientHints.prefersColorScheme && !!clientHints.prefersColorSchemeOptions
  if (writeCookie && clientHintsRequest.firstRequest && clientHints.reloadOnFirstRequest) {
    const {
      prefersColorScheme,
      prefersReducedMotion,
      viewportSize,
    } = clientHints
    if (prefersColorScheme && clientHintsRequest.prefersColorSchemeAvailable)
      writeCookie = false

    if (prefersReducedMotion && clientHintsRequest.prefersReducedMotionAvailable)
      writeCookie = false

    if (viewportSize && clientHintsRequest.viewportWidthAvailable)
      writeCookie = false

    if (viewportSize && clientHintsRequest.viewportHeightAvailable)
      writeCookie = false
  }

  return writeCookie
}

function withNuxtAppRendered(callback: () => void) {
  const nuxtApp = useNuxtApp()
  const unhook = nuxtApp.hooks.hookOnce('app:rendered', callback)
  nuxtApp.hooks.hookOnce('app:error', () => {
    unhook()
    return callback()
  })
}

function writeThemeCookie(
  cookieName: string,
  themeName: string,
  path: string,
) {
  const date = new Date()
  const expires = new Date(date.setDate(date.getDate() + 365))
  useCookie(cookieName, {
    path,
    expires,
    sameSite: 'lax',
  }).value = themeName

  return `${cookieName}=${themeName}; Path=${path}; Expires=${expires.toUTCString()}; SameSite=Lax`
}
