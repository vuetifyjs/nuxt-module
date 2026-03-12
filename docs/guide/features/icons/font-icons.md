# Font Icons

This module supports the following font icons libraries:
- [Material Design Icons](https://materialdesignicons.com/)
- [Material Icons](https://fonts.google.com/icons)
- [Font Awesome 4](https://fontawesome.com/v4.7.0/)
- [Font Awesome 5](https://fontawesome.com/)

By default, the module uses the `mdi` font icon library. You can change this by setting the `defaultSet` option to:
- `mdi` for [Material Design Icons](https://materialdesignicons.com/)
- `md` for [Material Icons](https://fonts.google.com/icons)
- `fa4` for [Font Awesome 4](https://fontawesome.com/v4.7.0/)
- `fa` for [Font Awesome 5](https://fontawesome.com)

To configure a font icon, specify the default set:
::: code-group

```ts [nuxt.config.ts]
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

:::

The module uses the CDN version of the font icon by default. If you prefer to use the local version, install the corresponding dependency; the module will automatically detect it and switch to registering the font using the local version.

You can use the `cdn` option to change the CDN used for each font icon library:
- [CDN for Material Design Icons (mdi)](https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css)
- [CDN for Material Icons (md)](https://fonts.googleapis.com/css?family=Material+Icons)
- [CDN for Font Awesome 4 (fa4)](https://cdn.jsdelivr.net/npm/font-awesome@4.x/css/font-awesome.min.css)
- [CDN for Font Awesome 5 (fa)](https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css)

To change the CDN for a font icon library, specify the `cdn` option:
::: code-group

```ts [nuxt.config.ts]
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi',
        sets: [{
          name: 'mdi',
          cdn: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css'
        }]
      }
    }
  }
})
```

:::
