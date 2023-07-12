# Font Icons

This module supports the following font icons libraries:
- [Material Design Icons](https://materialdesignicons.com/)
- [Material Icons](https://fonts.google.com/icons)
- [Font Awesome 4](https://fontawesome.com/v4.7.0/)
- [Font Awesome 5](https://fontawesome.com/)

By default, the module will use the `mdi` font icon library. You can change it by setting the `defaultSet` option to:
- `mdi` for [Material Design Icons](https://materialdesignicons.com/)
- `md` for [Material Icons](https://fonts.google.com/icons)
- `fa4` for [Font Awesome 4](https://fontawesome.com/v4.7.0/)
- `fa` for [Font Awesome 5](https://fontawesome.com)

To configure a font icon you only need to specify the default set:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi'
      }
    }
  }
})
```

The module will use the CDN version of the font icon. If you want to use the local version, you only need to install the corresponding dependency, the module will auto-detect it and will switch to register the font to use the local version.

The CDN used for each font icon library, you can use the `cdn` option to change it:
- [CDN for Material Design Icons (mdi)](https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css)
- [CDN for Material Icons (md)](https://fonts.googleapis.com/css?family=Material+Icons)
- [CDN for Font Awesome 4 (fa4)](https://cdn.jsdelivr.net/npm/font-awesome@4.x/css/font-awesome.min.css)
- [CDN for Font Awesome 5 (fa)](https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css)

To change the CDN for a font icon library you only need to specify the `cdn` option:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi',
        sets: [{
          name: 'mdi',
          cdn: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons'
        }]
      }
    }
  }
})
```
