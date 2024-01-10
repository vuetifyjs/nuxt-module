import { ssrClientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'
import type { UnwrapNestedRefs } from 'vue'
import { reactive, ref, watch } from 'vue'
import type { SSRClientHints } from './types'
import { VuetifyHTTPClientHints } from './client-hints'
import { defineNuxtPlugin, useNuxtApp, useState } from '#imports'
import type { Plugin } from '#app'

const plugin: Plugin<{
  ssrClientHints: UnwrapNestedRefs<SSRClientHints>
}> = defineNuxtPlugin(async (nuxtApp) => {
  const state = await useSSRClientHints()

  const {
    firstRequest,
    prefersColorSchemeAvailable,
    prefersReducedMotionAvailable,
    viewportHeightAvailable,
    viewportWidthAvailable,
  } = state.value

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
      const themeCookie = state.value.colorSchemeCookie
      // write the cookie and refresh the page if configured
      if (prefersColorSchemeOptions && themeCookie) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const cookieName = prefersColorSchemeOptions.cookieName
        const parseCookieName = `${cookieName}=`
        const cookieEntry = `${parseCookieName}${state.value.colorSchemeFromCookie ?? prefersColorSchemeOptions.defaultTheme};`
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
        const clientWidth = state.value.viewportWidth
        const clientHeight = state.value.viewportHeight
        vuetifyOptions.ssr = typeof clientWidth === 'number'
          ? {
              clientWidth,
              clientHeight,
            }
          : true
      }

      // update the theme
      if (prefersColorScheme && prefersColorSchemeOptions) {
        if (vuetifyOptions.theme === false) {
          vuetifyOptions.theme = { defaultTheme: state.value.colorSchemeFromCookie ?? prefersColorSchemeOptions.defaultTheme }
        }
        else {
          vuetifyOptions.theme = vuetifyOptions.theme ?? {}
          vuetifyOptions.theme.defaultTheme = state.value.colorSchemeFromCookie ?? prefersColorSchemeOptions.defaultTheme
        }
      }
    })

    // update theme logic
    if (prefersColorScheme && prefersColorSchemeOptions) {
      const themeCookie = state.value.colorSchemeCookie
      if (themeCookie) {
        nuxtApp.hook('app:beforeMount', () => {
          const vuetify = useNuxtApp().$vuetify
          // update the theme
          const cookieName = prefersColorSchemeOptions.cookieName
          const parseCookieName = `${cookieName}=`
          const cookieEntry = `${parseCookieName}${state.value.colorSchemeFromCookie ?? prefersColorSchemeOptions.defaultTheme};`
          watch(vuetify.theme.global.name, (newThemeName) => {
            document.cookie = themeCookie.replace(cookieEntry, `${cookieName}=${newThemeName};`)
          })
          if (prefersColorSchemeOptions.useBrowserThemeOnly) {
            const { darkThemeName, lightThemeName } = prefersColorSchemeOptions
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
            prefersDark.addEventListener('change', (e) => {
              vuetify.theme.global.name.value = e.matches ? darkThemeName : lightThemeName
            })
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

export default plugin

function defaultValues() {
  return <SSRClientHints>{
    firstRequest: false,
    prefersColorSchemeAvailable: false,
    prefersReducedMotionAvailable: false,
    viewportHeightAvailable: true,
    viewportWidthAvailable: true,
    viewportHeight: window.innerHeight,
    viewportWidth: window.innerWidth,
    prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'no-preference',
  }
}

async function useSSRClientHints() {
  const state = useState<SSRClientHints>(VuetifyHTTPClientHints)
  if (state.value)
    return state

  const initial = ref(defaultValues())

  // avoid error in Safari 10, IE9- and other old browsers
  if (!window.performance || !('getEntriesByType' in performance))
    return initial

  const entryList = performance.getEntriesByType('navigation')
  // still not supported as of Safari 14...
  if (!entryList.length)
    return initial

  const entry = entryList[0] instanceof PerformanceResourceTiming ? entryList[0] : undefined
  if (!entry || !entry.serverTiming?.length)
    return initial

  const entries = Array.from(entry.serverTiming)
    .filter(e => e.name.startsWith('vtfy-'))
    .reduce((acc, value) => {
      acc[value.name] = value.description
      return acc
    }, {} as Record<string, string>)
  console.log(entries)
  /*
  initial.firstRequest = entries['vtfy-0'] === '1'
  initial.prefersColorSchemeAvailable = entries['vtfy-1'] === '1'
  initial.prefersReducedMotionAvailable = entries['vtfy-2'] === '1'
  initial.viewportHeightAvailable = entries['vtfy-3'] === '1'
  initial.viewportWidthAvailable = entries['vtfy-4'] === '1'
  if (initial.prefersColorSchemeAvailable) {
    const prefersColorScheme = entries['vtfy-5']
    initial.prefersColorScheme = prefersColorScheme === '0'
      ? 'light'
      : prefersColorScheme === '1'
        ? 'dark'
        : prefersColorScheme === '2'
          ? 'no-preference'
          : undefined
  }

  if (initial.prefersReducedMotionAvailable) {
    const prefersReducedMotion = entries['vtfy-6']
    initial.prefersReducedMotion = prefersReducedMotion === '0'
      ? 'no-preference'
      : prefersReducedMotion === '1'
        ? 'reduce'
        : undefined
  }

  if (initial.viewportHeightAvailable) {
    const viewportHeight = entries['vtfy-7']
    try {
      initial.viewportHeight = parseInt(viewportHeight, 10)
      if (Number.isNaN(initial.viewportHeight))
        initial.viewportHeight = undefined
    }
    catch {
      initial.viewportHeight = undefined
    }
  }

  if (initial.viewportWidthAvailable) {
    const viewportWidth = entries['vtfy-8']
    try {
      initial.viewportWidth = parseInt(viewportWidth, 10)
      if (Number.isNaN(initial.viewportWidth))
        initial.viewportWidth = undefined
    }
    catch {
      initial.viewportWidth = undefined
    }
  }
  initial.colorSchemeFromCookie = entries['vtfy-9']

  const firstRequest: boolean
  prefersColorSchemeAvailable: boolean
  prefersReducedMotionAvailable: boolean
  viewportHeightAvailable: boolean
  viewportWidthAvailable: boolean
  prefersColorScheme?: 'dark' | 'light' | 'no-preference'
  prefersReducedMotion?: 'no-preference' | 'reduce'
  viewportHeight?: number
  viewportWidth?: number
  colorSchemeFromCookie?: string
  colorSchemeCookie?: string
*/
  return initial
}
