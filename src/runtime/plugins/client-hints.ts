export interface ClientHintRequestFeatures {
  firstRequest: boolean
  prefersColorSchemeAvailable: boolean
  prefersReducedMotionAvailable: boolean
  viewportHeightAvailable: boolean
  viewportWidthAvailable: boolean
}
export interface ClientHintsRequest extends ClientHintRequestFeatures {
  prefersColorScheme?: 'dark' | 'light' | 'no-preference'
  prefersReducedMotion?: 'no-preference' | 'reduce'
  viewportHeight?: number
  viewportWidth?: number
  colorSchemeFromCookie?: string
  colorSchemeCookie?: string
}

export interface SSRClientHints {
  ssrClientHints: ClientHintsRequest
}

export const VuetifyHTTPClientHints = 'vuetify:nuxt:ssr-client-hints'
