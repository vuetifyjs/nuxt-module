# SVG Icons

This module supports the following SVG icon libraries:
- [@mdi/js](https://www.npmjs.com/package/@mdi/js)
- [@fortawesome/fontawesome-svg-core](https://www.npmjs.com/package/@fortawesome/fontawesome-svg-core)

We're trying to figure out how to include the following SVG icon libraries:
- [Nuxt Icon](https://github.com/nuxt-modules/icon)
- [unplugin-icons](https://github.com/antfu/unplugin-icons)

## mdi-svg

You only need to add `@mdi/js` dependency to your project and configure the default set:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi-svg'
      }
    }
  }
})
```

You can also add icon aliases:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi-svg',
        svg: {
          mdi: {
            aliases: {
              account: 'mdiAccount'
            }
          }
        }
      }
    }
  }
})
```

## fa-svg

You only need to add `@fortawesome/fontawesome-svg-core`, `@fortawesome/vue-fontawesome` and `@fortawesome/free-solid-svg-icons` dependencies to your project and configure the default set:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'fa-svg'
      }
    }
  }
})
```

You can also add more libraries and install them in your project, the module will register them for you (this is the default configuration using the above configuration):
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'fa-svg',
        svg: {
          fa: {
            libraries: [
              [/* default export? */ false, /* export name */ 'fas', /* library */ '@fortawesome/free-solid-svg-icons']
            ]
          }
        }
      }
    }
  }
})
```
