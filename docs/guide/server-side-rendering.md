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

::: warning
The [Http Client Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints) headers listed above are still in draft, and only Chromium based browsers support them: Chrome, Edge, Chromium and Opera.
:::

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

If you enable `prefersReducedMotion`, you should handle it with a Nuxt plugin registering the `vuetify:ssr-client-hints` hook.
**Your Nuxt plugin hook will be only called on the server** with the Vuetify options and the `ssrClientHints` as parameter.
Before calling your `vuetify:ssr-client-hints` hook, this module will configure `vuetifyOptions.ssr` and the `global Vuetify theme` properly when `ssrClientHints.viewportSize` and `ssrClientHints.prefersColorScheme` are enabled.

```ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:ssr-client-hints', ({ vuetifyOptions, ssrClientHints, ssrClientHintsConfiguration }) => {
    // your logic here
  })
})
```

where:
- `vuetifyOptions` is the configuration for the Vuetify instance (if you need to update some option)
- `ssrClientHints` are the client hints extracted from the request headers (the full definition can be found in the [types.ts](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts) in the `#app` module augmentation)
- `ssrClientHintsConfiguration` is the client hints configuration (the full definition can be found in the `virtual:vuetify-ssr-client-hints-configuration` declaration in the [configuration.ts](https://github.com/userquin/vuetify-nuxt-module/blob/main/configuration.d.ts) module)

This module will expose the `$ssrClientHints` property in the Nuxt App instance (`useNuxtApp().$ssrClientHints`) for the headers received from the client (all the properties that are not enabled in the module option will be `undefined`), check the module augmentation for `#app` in the [types.ts](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts) module for the full definition.

### Reload on First Request

Browsers that support any of the Http Client Hints will send them only after the first request. This module provides support to reload the page when the browser hits the server for the first time.

To enable this feature, you must configure `ssrClientHints.reloadOnFirstRequest` to `true` in the module options.

### Sec-CH-Prefers-Color-Scheme

This module provides support to access to the `prefers-color-scheme` user's preference in the server side, it will not work on first request.

To enable this feature, you must configure `ssrClientHints.prefersColorScheme` to `true` in the module options. To access the value in the server, you can use the `vuetify:ssr-client-hints` hook in your custom Nuxt plugin or using the `$ssrClientHints` property in the Nuxt App instance (`useNuxtApp().$ssrClientHints`).

:::warning
Since the headers sent by the user agent may not be accurate, from time to time your application will get some hydration mismatch warnings in the console.

If you resize the window while your application is loading then you may get a mismatch hydration warning in the console.
:::

#### Multiple Themes

This module also provides support for **multiple themes** via custom HTTP cookie. 

To enable this feature, add the following module options:
- `ssrClientHints.prefersColorScheme` to `true` 
- `ssrClientHints.prefersColorSchemeOptions`: can be an empty object

where `ssrClientHints.prefersColorSchemeOptions` is an object with the following properties:
- `darkThemeName`: the theme name to be used when the user's preference is `dark` (defaults to `dark`)
- `lightThemeName`: the theme name to be used when the user's preference is `light` (defaults to `light`)
- `cookieName`: the cookie name to store the theme name (defaults to `color-scheme`)
- `useBrowserThemeOnly`: this flag can be used when your application provides a custom dark and light themes, but will not provide a theme selector, i.e., the theme selector will be the one provided by the browser (defaults to `false`)

You also need to configure the default Vuetify theme in the `vuetifyOptions` module option, should be `darkThemeName` or `lightThemeName`, otherwise you will get an error.

`darkThemeName` and `lightThemeName` will be used by the module for the initial theme configuration, when the user changes the application theme (via `useNuxtApp().$vuetify.theme.global.name`), the module will update the cookie with the selected theme.

The module will add the cookie with the following properties:
- `Path` to `nuxt.options.app.baseURL` (defaults to `/`)
- `Expires` to 365 days (will be updated on every page refresh)
- `SameSite` to `Lax`
