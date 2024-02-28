import type { UnwrapNestedRefs } from 'vue'
import type { createVuetify } from 'vuetify'

export interface ClientHintRequestFeatures {
  firstRequest: boolean
  prefersColorSchemeAvailable: boolean
  prefersReducedMotionAvailable: boolean
  viewportHeightAvailable: boolean
  viewportWidthAvailable: boolean
  devicePixelRatioAvailable: boolean
}
export interface SSRClientHints extends ClientHintRequestFeatures {
  prefersColorScheme?: 'dark' | 'light' | 'no-preference'
  prefersReducedMotion?: 'no-preference' | 'reduce'
  viewportHeight?: number
  viewportWidth?: number
  devicePixelRatio?: number
  colorSchemeFromCookie?: string
  colorSchemeCookie?: string
}

declare module '#app' {
  interface NuxtApp {
    $vuetify: ReturnType<typeof createVuetify>
    $ssrClientHints: UnwrapNestedRefs<SSRClientHints>
  }
}

export {}
