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
  viewPortWidth?: number
  colorSchemeFromCookie?: string
}

export interface SSRClientHints {
  ssrClientHints: ClientHintsRequest
}
