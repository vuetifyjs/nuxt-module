# Overriding SAAS Variables

Vuetify allows for [overriding global and component-level SAAS variables](https://vuetifyjs.com/en/features/sass-variables/).  Setting these up requires configuration that is slightly different from the Vuetify
documentation while using this Nuxt module.

1)  In your styles directory (for this example, we'll use `${workspace}/assets/styles`), create two files - `assets/styles/main.scss` and `assets/styles/settings.scss`

2)  In the `main.scss` file, we'll want to add
```scss
@use 'vuetify' with (
    // Global Vuetify SAAS variable overrides.  For example:
    // $utilities: false,
    // $reset: false,
    // $color-pack: false,
    // $body-font-family: sans-serif
)
```

3)  In the `settings.scss` file, we'll want to add
```scss
// $button-text-transform-override: capitalize;

@forward 'vuetify/settings' with (
    // Component Vuetify SAAS variable overrides.
    // For example -- overriding button font capitalization (as seen at the bottom of the v-btn guide here https://vuetifyjs.com/en/api/v-btn/):
    // $button-text-transform: $button-text-transform-override,
);
```

4)  In your `nuxt.config.ts`, add a `css` entry to the `defineNuxtConfig` configuration object that points to `main.scss` like so:
```javascript
export default defineNuxtConfig({
/* ... */
  css: ['assets/styles/main.scss']
/* ... */
})
```

_Note: This will import `main.scss` into ALL of your components by default. If you would like different behavior, you can create a different file with these overrides and import that instead._

5)  Again in your `nuxt.config.ts`, we'll want to add another entry to the `defineNuxtConfig` configuration object that overrides the default Vuetify Styles imports and instead imports your settings:
```javascript
export default defineNuxtConfig({
/* ... */
  css: ['assets/styles/main.scss'],
  vuetify: {
    moduleOptions: {
      /* module specific options */
      /* https://www.youtube.com/watch?v=aamWg1TuC3o */
      disableVuetifyStyles: true,
      styles: {
        configFile: 'assets/styles/settings.scss'
      },
    },
  }
/* ... */
})
```

You should now be able to override your [global Vuetify SAAS variables](https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/styles/settings/_variables.scss) as well as your [component-level Vuetify SAAS variables](https://vuetifyjs.com/en/features/sass-variables/#variable-api)
in your respective `settings.scss` and `main.scss` files.
