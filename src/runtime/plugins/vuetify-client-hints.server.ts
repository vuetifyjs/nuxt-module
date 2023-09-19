import type { IncomingHttpHeaders, ServerResponse } from 'node:http'
import {
  type SSRClientHintsConfiguration,
  ssrClientHintsConfiguration,
} from 'virtual:vuetify-ssr-client-hints-configuration'
import { reactive } from 'vue'
import type { ClientHintsRequest, SSRClientHints } from './client-hints'
import { type Browser, parseUserAgent } from './detect-browser'
import { VuetifyHTTPClientHints } from './client-hints'
import {
  defineNuxtPlugin,
  useCookie,
  useNuxtApp,
  useRequestEvent,
  useState,
} from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const event = useRequestEvent()
  const state = useState<SSRClientHints>(VuetifyHTTPClientHints)

  const request = event.node.req
  const response = event.node.res

  const requestHeaders = request.headers ?? {}

  const userAgentHeader = readClientHeader('user-agent', requestHeaders)

  // 1. extract browser info
  const userAgent = userAgentHeader
    ? parseUserAgent(userAgentHeader)
    : null
  // 2. prepare client hints request
  const clientHintsRequest = collectClientHints(userAgent, ssrClientHintsConfiguration, requestHeaders)
  // 3. write client hints response headers
  writeClientHintsResponseHeaders(clientHintsRequest, ssrClientHintsConfiguration, response)
  state.value = {
    ssrClientHints: clientHintsRequest,
  }
  // 4. send the theme cookie to the client when required
  state.value.ssrClientHints.colorSchemeCookie = writeThemeCookie(
    clientHintsRequest,
    ssrClientHintsConfiguration,
  )

  nuxtApp.hook('vuetify:before-create', async ({ vuetifyOptions }) => {
    const clientWidth = clientHintsRequest.viewportWidth
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
      ssrClientHintsConfiguration,
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
  viewportWidth: 'Sec-CH-Viewport-Width',
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
  viewportWidth: (_, v) => v[0] >= 108,
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
    viewportWidth: (android, v) => v[0] >= (android ? 73 : 94),
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

function browserFeatureAvailable(userAgent: ReturnType<typeof parseUserAgent>, feature: AcceptClientHintsHeadersKey) {
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

function lookupClientHints(
  userAgent: ReturnType<typeof parseUserAgent>,
  ssrClientHintsConfiguration: SSRClientHintsConfiguration,
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

  if (ssrClientHintsConfiguration.prefersColorScheme)
    features.prefersColorSchemeAvailable = browserFeatureAvailable(userAgent, 'prefersColorScheme')

  if (ssrClientHintsConfiguration.prefersReducedMotion)
    features.prefersReducedMotionAvailable = browserFeatureAvailable(userAgent, 'prefersReducedMotion')

  if (ssrClientHintsConfiguration.viewportSize) {
    features.viewportHeightAvailable = browserFeatureAvailable(userAgent, 'viewportHeight')
    features.viewportWidthAvailable = browserFeatureAvailable(userAgent, 'viewportWidth')
  }

  return features
}

function collectClientHints(
  userAgent: ReturnType<typeof parseUserAgent>,
  ssrClientHintsConfiguration: SSRClientHintsConfiguration,
  headers: IncomingHttpHeaders,
) {
  // collect client hints
  const hints: ClientHintsRequest = lookupClientHints(userAgent, ssrClientHintsConfiguration)

  if (ssrClientHintsConfiguration.prefersColorScheme) {
    if (ssrClientHintsConfiguration.prefersColorSchemeOptions) {
      const cookieName = ssrClientHintsConfiguration.prefersColorSchemeOptions.cookieName
      const cookieValue = readClientHeader('cookie', headers)?.split(';').find(c => c.trim().startsWith(`${cookieName}=`))
      if (cookieValue) {
        const value = cookieValue.split('=')?.[1].trim()
        if (ssrClientHintsConfiguration.prefersColorSchemeOptions.themeNames.includes(value)) {
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
      if (ssrClientHintsConfiguration.prefersColorSchemeOptions) {
        if (!value || value === 'no-preference') {
          hints.colorSchemeFromCookie = ssrClientHintsConfiguration.prefersColorSchemeOptions.defaultTheme
        }
        else {
          hints.colorSchemeFromCookie = value === 'dark'
            ? ssrClientHintsConfiguration.prefersColorSchemeOptions.darkThemeName
            : ssrClientHintsConfiguration.prefersColorSchemeOptions.lightThemeName
        }
      }
    }
  }

  if (hints.prefersReducedMotionAvailable && ssrClientHintsConfiguration.prefersReducedMotion) {
    const value = readClientHeader(AcceptClientHintsRequestHeaders.prefersReducedMotion, headers)?.toLowerCase()
    if (value === 'no-preference' || value === 'reduce') {
      hints.prefersReducedMotion = value
      hints.firstRequest = false
    }
  }

  if (hints.viewportHeightAvailable && ssrClientHintsConfiguration.viewportSize) {
    const header = readClientHeader(AcceptClientHintsRequestHeaders.viewportHeight, headers)
    if (header) {
      hints.firstRequest = false
      try {
        hints.viewportHeight = Number.parseInt(header)
      }
      catch {
        hints.viewportHeight = ssrClientHintsConfiguration.clientHeight
      }
    }
  }
  else {
    hints.viewportHeight = ssrClientHintsConfiguration.clientHeight
  }

  if (hints.viewportWidthAvailable && ssrClientHintsConfiguration.viewportSize) {
    const header = readClientHeader(AcceptClientHintsRequestHeaders.viewportWidth, headers)
    if (header) {
      hints.firstRequest = false
      try {
        hints.viewportWidth = Number.parseInt(header)
      }
      catch {
        hints.viewportWidth = ssrClientHintsConfiguration.clientWidth
      }
    }
  }
  else {
    hints.viewportWidth = ssrClientHintsConfiguration.clientWidth
  }

  return hints
}

function writeClientHintHeaders(key: string, headers: Record<string, string[]>) {
  ClientHeaders.forEach((header) => {
    headers[header] = (headers[header] ? headers[header] : []).concat(key)
  })
}

function withNuxtAppRendered(callback: () => void) {
  const nuxtApp = useNuxtApp()
  const unhook = nuxtApp.hooks.hookOnce('app:rendered', callback)
  nuxtApp.hooks.hookOnce('app:error', () => {
    unhook()
    return callback()
  })
}

function writeClientHintsResponseHeaders(
  clientHintsRequest: ClientHintsRequest,
  ssrClientHintsConfiguration: SSRClientHintsConfiguration,
  response: ServerResponse,
) {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Critical-CH
  // Each header listed in the Critical-CH header should also be present in the Accept-CH and Vary headers.

  const headers: Record<string, string[]> = {}

  if (ssrClientHintsConfiguration.prefersColorScheme && clientHintsRequest.prefersColorSchemeAvailable)
    writeClientHintHeaders(AcceptClientHintsHeaders.prefersColorScheme, headers)

  if (ssrClientHintsConfiguration.prefersReducedMotion && clientHintsRequest.prefersReducedMotionAvailable)
    writeClientHintHeaders(AcceptClientHintsHeaders.prefersReducedMotion, headers)

  if (ssrClientHintsConfiguration.viewportSize && clientHintsRequest.viewportHeightAvailable && clientHintsRequest.viewportWidthAvailable) {
    writeClientHintHeaders(AcceptClientHintsHeaders.viewportHeight, headers)
    writeClientHintHeaders(AcceptClientHintsHeaders.viewportWidth, headers)
  }

  if (Object.keys(headers).length === 0)
    return

  withNuxtAppRendered(() => {
    Object.entries(headers).forEach(([key, value]) => {
      response.setHeader(key, value)
    })
  })
}

function writeThemeCookie(
  clientHintsRequest: ClientHintsRequest,
  ssrClientHintsConfiguration: SSRClientHintsConfiguration,
) {
  if (!ssrClientHintsConfiguration.prefersColorScheme || !ssrClientHintsConfiguration.prefersColorSchemeOptions)
    return

  const cookieName = ssrClientHintsConfiguration.prefersColorSchemeOptions.cookieName
  const themeName = clientHintsRequest.colorSchemeFromCookie ?? ssrClientHintsConfiguration.prefersColorSchemeOptions.defaultTheme
  const path = ssrClientHintsConfiguration.prefersColorSchemeOptions.baseUrl

  const date = new Date()
  const expires = new Date(date.setDate(date.getDate() + 365))
  if (!clientHintsRequest.firstRequest || !ssrClientHintsConfiguration.reloadOnFirstRequest) {
    useCookie(cookieName, {
      path,
      expires,
      sameSite: 'lax',
    }).value = themeName
  }

  return `${cookieName}=${themeName}; Path=${path}; Expires=${expires.toUTCString()}; SameSite=Lax`
}
