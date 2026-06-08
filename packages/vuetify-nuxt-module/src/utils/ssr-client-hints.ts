import type { VuetifyNuxtContext } from './config'

export interface ResolvedClientHints {
  enabled: boolean
  reloadOnFirstRequest: boolean
  viewportSize: boolean
  prefersColorScheme: boolean
  prefersReducedMotion: boolean
  prefersColorSchemeOptions?: {
    baseUrl: string
    defaultTheme: string
    themeNames: string[]
    cookieName: string
    cookieDomain?: string
    cookieSecure?: boolean
    cookieSameSite: 'lax' | 'strict' | 'none'
    darkThemeName: string
    lightThemeName: string
    useBrowserThemeOnly: boolean
  }
}

const disabledClientHints: ResolvedClientHints = Object.freeze({
  enabled: false,
  reloadOnFirstRequest: false,
  viewportSize: false,
  prefersColorScheme: false,
  prefersReducedMotion: false,
})

type PrefersColorSchemeInput = NonNullable<NonNullable<VuetifyNuxtContext['moduleOptions']['ssrClientHints']>['prefersColorSchemeOptions']>

function resolveColorSchemeCookie (options: PrefersColorSchemeInput, logger: VuetifyNuxtContext['logger']) {
  if (options.cookieName !== undefined) {
    logger.warn('[vuetify-nuxt-module] `prefersColorSchemeOptions.cookieName` is deprecated, use `prefersColorSchemeOptions.cookie.name` instead.')
  }

  const cookieSameSite = options.cookie?.sameSite ?? 'lax'

  return {
    cookieName: options.cookie?.name ?? options.cookieName ?? 'color-scheme',
    cookieDomain: options.cookie?.domain,
    cookieSecure: cookieSameSite === 'none' ? true : options.cookie?.secure,
    cookieSameSite,
  }
}

export function prepareSSRClientHints (baseUrl: string, ctx: VuetifyNuxtContext) {
  if (!ctx.isSSR || ctx.isNuxtGenerate) {
    return disabledClientHints
  }

  const { ssrClientHints: ssrClientHintsConfiguration } = ctx.moduleOptions

  const clientHints: ResolvedClientHints = {
    enabled: false,
    reloadOnFirstRequest: ssrClientHintsConfiguration?.reloadOnFirstRequest ?? false,
    viewportSize: ssrClientHintsConfiguration?.viewportSize ?? false,
    prefersColorScheme: ssrClientHintsConfiguration?.prefersColorScheme ?? false,
    prefersReducedMotion: ssrClientHintsConfiguration?.prefersReducedMotion ?? false,
  }

  clientHints.enabled = clientHints.viewportSize || clientHints.prefersColorScheme || clientHints.prefersReducedMotion

  if (clientHints.enabled && clientHints.prefersColorScheme && ssrClientHintsConfiguration?.prefersColorSchemeOptions) {
    const theme = ctx.vuetifyOptions.theme
    if (!theme) {
      throw new Error('Vuetify theme is disabled')
    }

    const themes = theme.themes
    if (!themes) {
      throw new Error('Vuetify themes is missing in theme!')
    }

    const defaultTheme = theme.defaultTheme
    if (!defaultTheme) {
      throw new Error('Vuetify default theme is missing in theme!')
    }

    if (!themes[defaultTheme]) {
      throw new Error(`Missing default theme ${defaultTheme} in the Vuetify themes!`)
    }

    const darkThemeName = ssrClientHintsConfiguration.prefersColorSchemeOptions?.darkThemeName ?? 'dark'
    if (!themes[darkThemeName]) {
      throw new Error(`Missing theme ${darkThemeName} in the Vuetify themes!`)
    }

    const lightThemeName = ssrClientHintsConfiguration.prefersColorSchemeOptions?.lightThemeName ?? 'light'
    if (!themes[lightThemeName]) {
      throw new Error(`Missing theme ${lightThemeName} in the Vuetify themes!`)
    }

    if (darkThemeName === lightThemeName) {
      throw new Error('Vuetify dark theme and light theme are the same, change darkThemeName or lightThemeName!')
    }

    const pcsOptions = ssrClientHintsConfiguration.prefersColorSchemeOptions

    clientHints.prefersColorSchemeOptions = {
      baseUrl,
      defaultTheme,
      themeNames: Array.from(Object.keys(themes)),
      ...resolveColorSchemeCookie(pcsOptions, ctx.logger),
      darkThemeName,
      lightThemeName,
      useBrowserThemeOnly: pcsOptions?.useBrowserThemeOnly ?? false,
    }
  }

  return clientHints
}
