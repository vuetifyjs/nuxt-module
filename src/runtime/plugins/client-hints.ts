export interface ClientHintsRequest {
  available: boolean
  prefersColorScheme?: 'dark' | 'light' | 'no-preference'
  prefersReducedMotion?: 'no-preference' | 'reduce'
  viewportHeight?: number
  viewPortWidth?: number
  colorSchemeFromCookie?: string
}

export interface SSRClientHints {
  ssrClientHints: ClientHintsRequest
}
