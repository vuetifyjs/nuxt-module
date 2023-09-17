import { clientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'
import type { SSRClientHints } from './client-hints'
import { defineNuxtPlugin } from '#imports'
import { useNuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const clientHints = clientHintsConfiguration()
  const state = useState<SSRClientHints>('ssrClientHints')

  const {
    viewportSize,
    prefersColorScheme,
    prefersColorSchemeOptions,
  } = clientHints
  if (viewportSize || (prefersColorScheme && prefersColorSchemeOptions)) {
    // If the browser does not support client hints, we need to update the vuetify configuration
    // In that case, the state will get the ssr configured in the server and later the viewport size will be updated
    if (!state.value.ssrClientHints.available && viewportSize) {
      nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
        const clientWidth = state.value.ssrClientHints.viewPortWidth
        const clientHeight = state.value.ssrClientHints.viewportHeight
        vuetifyOptions.ssr = typeof clientWidth === 'number'
          ? {
              clientWidth,
              clientHeight,
            }
          : true
      })
    }
    nuxtApp.hook('app:beforeMount', () => {
      const vuetify = useNuxtApp().$vuetify
      // on client, we update the display to avoid hydration mismatch on page refresh
      // there will be some hydration mismatch since the headers sent by the user agent may not be accurate
      if (state.value.ssrClientHints.available && viewportSize)
        vuetify.display.update()

      // update the theme
      if (prefersColorScheme && prefersColorSchemeOptions) {
        vuetify.theme.global.name.value = state.value.ssrClientHints.colorSchemeFromCookie ?? prefersColorSchemeOptions.defaultTheme

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
      }
    })
  }

  return {
    provide: reactive({
      ssrClientHints: state,
    }),
  }
})
