# Icons

This module will work with Pure CSS Icons, Font icons and SVG icons:
- Pure CSS Icons via [UnoCSS Preset Icons](/guide/icons/unocss-preset-icons)
- [Font icons](/guide/icons/font-icons)
- [SVG icons](/guide/icons/svg-icons)

We recommend using Pure CSS Icons, you will use/bundle only the SVG icons used in your application inside your CSS.

## Multiple Icon Sets

You can register multiple icons sets adding them to the sets array, don't forget to add the default set, otherwise 'mdi' will be used:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi',
        sets: ['mdi', 'fa']
      }
    }
  }
})
```
