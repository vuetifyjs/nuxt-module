import { ssrClientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'
import type { createVuetify } from 'vuetify'
import type { SSRClientHints } from './client-hints'
import { VuetifyHTTPClientHints } from './client-hints'
import { defineNuxtPlugin } from '#imports'
import { useNuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const state = useState<SSRClientHints>(VuetifyHTTPClientHints)

  const {
    firstRequest,
    prefersColorSchemeAvailable,
    prefersReducedMotionAvailable,
    viewportHeightAvailable,
    viewportWidthAvailable,
  } = state.value.ssrClientHints

  const {
    reloadOnFirstRequest,
    viewportSize,
    prefersReducedMotion,
    prefersColorScheme,
    prefersColorSchemeOptions,
  } = ssrClientHintsConfiguration

  // reload the page when it is the first request, explicitly configured, and any feature available
  if (firstRequest && reloadOnFirstRequest) {
    if (prefersColorScheme) {
      const themeCookie = state.value.ssrClientHints.colorSchemeCookie
      // write the cookie and refresh the page if configured
      if (prefersColorSchemeOptions && themeCookie) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const cookieName = prefersColorSchemeOptions.cookieName
        const parseCookieName = `${cookieName}=`
        const cookieEntry = `${parseCookieName}${state.value.ssrClientHints.colorSchemeFromCookie ?? prefersColorSchemeOptions.defaultTheme};`
        const newThemeName = prefersDark ? prefersColorSchemeOptions.darkThemeName : prefersColorSchemeOptions.lightThemeName
        document.cookie = themeCookie.replace(cookieEntry, `${cookieName}=${newThemeName};`)
        window.location.reload()
      }
      else if (prefersColorSchemeAvailable) {
        window.location.reload()
      }
    }

    if (prefersReducedMotion && prefersReducedMotionAvailable)
      window.location.reload()

    if (viewportSize && viewportHeightAvailable)
      window.location.reload()

    if (viewportSize && viewportWidthAvailable)
      window.location.reload()
  }

  if (viewportSize || (prefersColorScheme && prefersColorSchemeOptions)) {
    // restore SSR state
    nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
      // on client, we update the display to avoid hydration mismatch on page refresh
      // there will be some hydration mismatch since the headers sent by the user agent may not be accurate
      if (viewportSize) {
        const clientWidth = state.value.ssrClientHints.viewportWidth
        const clientHeight = state.value.ssrClientHints.viewportHeight
        vuetifyOptions.ssr = typeof clientWidth === 'number'
          ? {
              clientWidth,
              clientHeight,
            }
          : true
      }

      // update the theme
      if (prefersColorScheme && prefersColorSchemeOptions)
        vuetifyOptions.theme.defaultTheme = state.value.ssrClientHints.colorSchemeFromCookie ?? prefersColorSchemeOptions.defaultTheme
    })

    // update theme logic
    if (prefersColorScheme && prefersColorSchemeOptions) {
      const themeCookie = state.value.ssrClientHints.colorSchemeCookie
      if (themeCookie) {
        nuxtApp.hook('app:beforeMount', () => {
          const vuetify = useNuxtApp().$vuetify
          // update the theme
          const cookieName = prefersColorSchemeOptions.cookieName
          const parseCookieName = `${cookieName}=`
          const cookieEntry = `${parseCookieName}${state.value.ssrClientHints.colorSchemeFromCookie ?? prefersColorSchemeOptions.defaultTheme};`
          watch(vuetify.theme.global.name, (newThemeName) => {
            document.cookie = themeCookie.replace(cookieEntry, `${cookieName}=${newThemeName};`)
          })
          if (prefersColorSchemeOptions.useBrowserThemeOnly) {
            const { darkThemeName, lightThemeName } = prefersColorSchemeOptions
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)')
            prefersDark.addEventListener('change', e => switchTheme(e, darkThemeName, vuetify))
            prefersLight.addEventListener('change', e => switchTheme(e, lightThemeName, vuetify))
          }
        })
      }
    }
  }

  return {
    provide: reactive({
      ssrClientHints: state,
    }),
  }
})

function switchTheme(
  e: MediaQueryListEvent,
  newThemeName: string,
  vuetify: ReturnType<typeof createVuetify>,
) {
  e.matches && (vuetify.theme.global.name.value = newThemeName)
}
