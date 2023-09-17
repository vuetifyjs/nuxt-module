import type { VuetifyNuxtContext } from './config'

export interface ResolvedClientHints {
  enabled: boolean
  viewportSize: boolean
  prefersColorScheme: boolean
  prefersReducedMotion: boolean
  prefersColorSchemeOptions?: {
    baseUrl: string
    defaultTheme: string
    themeNames: string[]
    cookieName: string
    darkThemeName: string
    lightThemeName: string
  }
}

const disabledClientHints: ResolvedClientHints = Object.freeze({
  enabled: false,
  viewportSize: false,
  prefersColorScheme: false,
  prefersReducedMotion: false,
})

export function prepareSSRClientHints(baseUrl: string, ctx: VuetifyNuxtContext) {
  if (!ctx.isSSR || ctx.isNuxtGenerate)
    return disabledClientHints

  const { ssrClientHints } = ctx.moduleOptions

  const clientHints: ResolvedClientHints = {
    enabled: false,
    viewportSize: ssrClientHints?.viewportSize ?? false,
    prefersColorScheme: ssrClientHints?.prefersColorScheme ?? false,
    prefersReducedMotion: ssrClientHints?.prefersReducedMotion ?? false,
  }

  clientHints.enabled = clientHints.viewportSize || clientHints.prefersColorScheme || clientHints.prefersReducedMotion

  if (clientHints.enabled && clientHints.prefersColorScheme && ssrClientHints?.prefersColorSchemeOptions) {
    const theme = ctx.vuetifyOptions.theme
    if (!theme)
      throw new Error('Vuetify theme is disabled')

    const themes = theme.themes
    if (!themes)
      throw new Error('Vuetify themes is missing in theme!')

    const defaultTheme = theme.defaultTheme
    if (!defaultTheme)
      throw new Error('Vuetify default theme is missing in theme!')

    if (!themes[defaultTheme])
      throw new Error(`Missing default theme ${defaultTheme} in the Vuetify themes!`)

    const darkThemeName = clientHints.prefersColorSchemeOptions?.darkThemeName ?? 'dark'
    if (!themes[darkThemeName])
      throw new Error(`Missing theme ${darkThemeName} in the Vuetify themes!`)

    const lightThemeName = clientHints.prefersColorSchemeOptions?.lightThemeName ?? 'light'
    if (!themes[lightThemeName])
      throw new Error(`Missing theme ${lightThemeName} in the Vuetify themes!`)

    if (darkThemeName === lightThemeName)
      throw new Error('Vuetify dark theme and light theme are the same, change darkThemeName or lightThemeName!')

    clientHints.prefersColorSchemeOptions = {
      baseUrl,
      defaultTheme,
      themeNames: Array.from(Object.keys(themes)),
      cookieName: clientHints?.prefersColorSchemeOptions?.cookieName ?? 'color-scheme',
      darkThemeName,
      lightThemeName,
    }
  }

  return clientHints
}
