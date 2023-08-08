# Server Side Rendering (SSR)

Vuetify Nuxt Module supports [SSR](https://nuxt.com/docs/api/configuration/nuxt-config#ssr) out of the box. It will automatically detect if you are using SSR and configure Vuetify accordingly.

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

If you're using multiple Vuetify Themes with SSR enabled, Vuetify [useTheme]() will not work since there is no way to know which theme to use in the server. You will need to add some logic in the client to restore the theme after hydration.

For example, if you want to use `dark` and `light` Vuetify Themes restoring the initial value using `prefers-color-scheme` and `localStorage` respectively, you can use [useDark](https://vueuse.org/core/useDark/) and [useToogle](https://vueuse.org/shared/useToggle/) from VueUse in the following composable:

```ts
// composables/useSSRTheme.ts
export function useSSRTheme() {
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

then, in your `App.vue` or layout templates, you can use the composable to restore the theme:
```vue
<script setup>
import { useSSRTheme } from '~/composables/useSSRTheme'

const { isDark } = useSSRTheme()
</script>

<template>
  <VApp :theme="isDark ? 'dark' : 'light'">
    <!-- your content here -->
  </VApp>
</template>
```
