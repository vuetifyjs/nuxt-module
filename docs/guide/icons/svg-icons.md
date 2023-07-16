---
outline: deep
---

# SVG Icons

This module supports the following SVG icon libraries:
- [@mdi/js](https://www.npmjs.com/package/@mdi/js)
- [@fortawesome/fontawesome-svg-core](https://www.npmjs.com/package/@fortawesome/fontawesome-svg-core)

You can also use the following packages SVG icons libraries:
- [Nuxt Icon](https://github.com/nuxt-modules/icon)
- [unplugin-icons](https://github.com/antfu/unplugin-icons)

## Material Design Icons

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

## Font Awesome

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

### Font Awesome PRO

To register Font Awesome Icons PRO you need to add `@fortawesome/pro-solid-svg-icons` dependency to your project, configure the default set and add the library to the list of libraries:
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
              [/* default export? */ false, /* export name */ 'fad', /* library */ '@fortawesome/pro-duotone-svg-icons']
            ]
          }
        }
      }
    }
  }
})
```

then you can use the icons in your components:
```vue
<v-icon>fa-duotone fa-server</v-icon>
```

If you want to animate the icon, add the animation to the `v-icon` class:
```vue
<v-icon class="fa-bounce">fa-duotone fa-server</v-icon>
```
