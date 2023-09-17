import { clientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'
import type { SSRClientHints } from './client-hints'
import { defineNuxtPlugin } from '#imports'
import { useNuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const clientHints = clientHintsConfiguration()
  const state = useState<SSRClientHints>('ssrClientHints')

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
  } = clientHints

  // reload the page when it is the first request, explicitly configured, and any feature available
  if (firstRequest && reloadOnFirstRequest) {
    if (prefersColorScheme && prefersColorSchemeAvailable)
      window.location.reload()

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
        const clientWidth = state.value.ssrClientHints.viewPortWidth
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
      nuxtApp.hook('app:beforeMount', () => {
        const vuetify = useNuxtApp().$vuetify

        // update the theme
        const cookieName = prefersColorSchemeOptions.cookieName
        const parseCookieName = `${cookieName}=`
        watch(vuetify.theme.global.name, (newThemeName) => {
          const oldCookies = document.cookie
          document.cookie = oldCookies.split(';').map(c => c.trim()).map((c) => {
            return c.startsWith(parseCookieName) ? `${cookieName}=${newThemeName}` : c
          }).join('; ')
          if (document.cookie === oldCookies)
            console.warn(`Cannot rewrite document.cookie to store ${cookieName}, review the cookies in your application, try cleaning all browser cookies for the site!`)
        })
      })
    }
  }

  return {
    provide: reactive({
      ssrClientHints: state,
    }),
  }
})
