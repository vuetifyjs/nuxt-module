---
outline: deep
---

# Server Side Rendering (SSR)

Vuetify Nuxt Module supports [SSR](https://nuxt.com/docs/api/configuration/nuxt-config#ssr) out of the box. It will automatically detect if you are using SSR and configure Vuetify accordingly.

The module includes support for the following [Http Client Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints), check [SSR Http Client Hints](#ssr-http-client-hints) for more details:
- [Sec-CH-Prefers-Color-Scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Color-Scheme)
- [Sec-CH-Prefers-Reduced-Motion](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Reduced-Motion)
- [Sec-CH-Viewport-Width](https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-width)
- [Sec-CH-Viewport-Width](https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-height)


## Vuetify SASS Variables

If you are customising Vuetify SASS Variables via [configFile](https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#customising-variables) module option with SSR enabled, you have to disable `experimental.inlineSSRStyles` in your Nuxt config file, otherwise you will get an error when building your application:
```ts
// Nuxt config file
export default defineNuxtConfig({
  ssr: true,
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      /* other module options */
      styles: { configFile: '/settings.scss' }
    },
    vuetifyOptions: {
      /* vuetify options */
    }  
  },
  experimental: {
    inlineSSRStyles: false
  }
})
```

## Vuetify Themes

If you're using multiple Vuetify Themes with SSR enabled, Vuetify [useTheme](https://vuetifyjs.com/en/api/use-theme/) will not work since there is no way to know which theme to use in the server (the server will use the default theme).

This module provides support to restore the theme using `prefers-color-scheme`, check [Sec-CH-Prefers-Color-Scheme](#sec-ch-prefers-color-scheme) for more details.

Alternatively, you will need to add some logic in the client to restore the theme after hydration.

For example, if you want to use `dark` and `light` Vuetify Themes restoring the initial value using `prefers-color-scheme` and `localStorage`, you can use [useDark](https://vueuse.org/core/useDark/) and [useToogle](https://vueuse.org/shared/useToggle/) composables from VueUse in the following way:
```ts
// composables/useCustomTheme.ts
export function useCustomTheme() {
  const { $vuetify } = useNuxtApp()

  const isDark = useDark({
    valueDark: 'dark',
    valueLight: 'light',
    initialValue: 'light',
    onChanged: (dark: boolean) => {
      $vuetify.theme.global.name.value = dark ? 'dark' : 'light'
    },
  })

  const toggle = useToggle(isDark)

  return { isDark, toggle }
}
```

then, in your `App.vue` or layout templates, you can use previous composable to restore the theme:
```vue
<script setup>
import { useCustomTheme } from '~/composables/useCustomTheme'

const { isDark } = useCustomTheme()
</script>

<template>
  <VApp :theme="isDark ? 'dark' : 'light'">
    <!-- your content here -->
  </VApp>
</template>
```

## Vuetify Display

If you're using Vuetify [useDisplay](https://vuetifyjs.com/en/api/use-display/) composable with SSR enabled, there is only one way for the server to get the client's width and height (still in draft): use the [Sec-CH-Viewport-Width](https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-width) and [Sec-CH-Viewport-Height](https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-height) headers respectively, will not work for the initial request.

Check [SSR Http Client Hints](#ssr-http-client-hints) for more details.

## SSR Http Client Hints

You can enable SSR Http Client Hints using the module `ssrClientHints` option:
- `viewportSize`: enable `Sec-CH-Viewport-Width` and `Sec-CH-Viewport-Height` headers? Defaults to `false`.
- `prefersColorScheme`: `Sec-CH-Prefers-Color-Scheme` header? Defaults to `false`, check [Sec-CH-Prefers-Color-Scheme](#sec-ch-prefers-color-scheme) for more details.
- `prefersReducedMotion`: `Sec-CH-Prefers-Reduced-Motion` header Defaults to `false`.

If you enable `prefersReducedMotion`, you should handle them with a Nuxt plugin registering the `vuetify:ssr-client-hints` hook.
**Your Nuxt plugin hook will be only called on the server** with the Vuetify options and the `ssrClientHints` as parameter.
Before calling your `vuetify:ssr-client-hints` hook, this module will configure `vuetifyOptions.ssr` and the `global Vuetify theme` properly when `ssrClientHints.viewportSize` and `ssrClientHints.prefersColorScheme` are enabled.

```ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:ssr-client-hints', ({ vuetifyOptions, ssrClientHints }) => {
    // vuetifyOptions.ssr is configured when ssrClientHints.viewportSize is enabled  
    // your logic here
  })
})
```

The module will expose the `$ssrClientHints` property in the Nuxt App instance (`useNuxtApp().$ssrClientHints`) for the headers received from the client (all the properties that not enabled in the module option will be `undefined`), here the definition:
```ts
/**
 * Request headers received from the client in SSR.
 */
export interface SSRClientHints {
  /**
   * The browser supports http client hints?
   */
  available: boolean
  prefersColorScheme?: 'dark' | 'light' | 'no-preference'
  prefersReducedMotion?: 'no-preference' | 'reduce'
  viewportHeight?: number
  viewPortWidth?: number
  /**
   * The theme name from the cookie.
   */
  colorSchemeFromCookie?: string
}
declare module '#app' {
  interface NuxtApp {
    $ssrClientHints: UnwrapNestedRefs<SSRClientHints>
  }
}
```

### Sec-CH-Prefers-Color-Scheme

This module provides support to access to the `prefers-color-scheme` user's preference in the server side, it will not work on first request.

To enable it, you must configure `ssrClientHints.prefersColorScheme` to `true` in the module options. To access the value in the server, you can use the `vuetify:ssr-client-hints` hook in your custom Nuxt plugin or using the `$ssrClientHints` property in the Nuxt App instance (`useNuxtApp().$ssrClientHints`).

If you want to support multiple themes, this module provides support using a cookie. 
To enable it, you must configure:
- `ssrClientHints.prefersColorScheme` to `true` 
- `ssrClientHints.prefersColorSchemeOptions`: can be an empty object

where `ssrClientHints.prefersColorSchemeOptions` is an object with the following properties:
- `darkThemeName`: the theme name to be used when the user's preference is `dark`
- `lightThemeName`: the theme name to be used when the user's preference is `light`
- `defaultTheme`: the theme name to be used when the user's preference is `no-preference`
- `cookieName`: the cookie name to store the theme

If `ssrClientHints.prefersColorSchemeOptions` option is empty, the module will use:
- `dark` for `darkThemeName`
- `light` for `lightThemeName`
- `defaultTheme` will be extracted from the Vuetify `vuetifyOptions.theme.defaultTheme` property
- `color-scheme` for `cookieName`

The module will add the cookie with the following properties:
- `Path` to `nuxt.options.app.baseURL` (defaults to `/`)
- `Expires` to 365 days (will be updated on every page refresh)
- `SameSite` to `Lax`
- `Secure` when the request is `https`

:::warning
Since the headers sent by the user agent may not be accurate, from time to time your application will get some hydration mismatch warnings in the console.

If you resize the window while your application is loading then you may get a mismatch hydration warning in the console.
:::
