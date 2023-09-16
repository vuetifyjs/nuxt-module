import type { IncomingHttpHeaders } from 'node:http'
import { type ClientHints, clientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'
import { defineNuxtPlugin } from '#imports'
import { useNuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const clientHints = clientHintsConfiguration()
  const state = useState<SSRClientHints>('ssrClientHints')
  const event = useRequestEvent(nuxtApp)

  if (!event) {
    if (clientHints.viewportSize) {
      // on client, we update the display to avoid hydration mismatch on page refresh
      // there will be some hydration mismatch since the headers sent by the user agent may not be accurate
      nuxtApp.hook('app:beforeMount', () => {
        useNuxtApp().$vuetify.display.update()
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

  // TODO: detect user agent
  // 1. check if we should send client hints
  // 2. prepare client hints request
  const clientHintsRequest = collectClientHints(clientHints, requestHeaders)
  // 3. send client hints request
  const responseHeader = createClientHintsResponseHeaders(clientHints)
  Object.entries(responseHeader).forEach(([key, value]) => {
    response.setHeader(key, value)
  })

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
    const value = readClientHeader(AcceptClientHintsRequestHeaders.prefersColorScheme, headers)?.toLowerCase()
    if (value === 'dark' || value === 'light' || value === 'no-preference')
      hints.prefersColorScheme = value
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
