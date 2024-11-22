# SASS Modern Compiler and SASS Variables

From version `0.17.0`, this module will configure Nuxt to use the new SASS modern compiler (`modern-compiler`). You don't need to change anything in your configuration to use it:
- update `vite` version to `v5.4.0` or higher (if you're using Nuxt `3.12.4` or higher, you don't need to update `vite`)
- replace your `sass` dependency with `sass-embedded`

If the `sass-embedded` dependency is not installed, the module will configure the `modern` compiler for you. In case you get errors, enable the `disableModernSassCompiler` option in the module configuration to fall back to the `legacy` compiler.

Check [Build Performance](https://vuetifyjs.com/en/features/sass-variables/#build-performance) in Vuetify docs for more details.

## Overriding SASS Variables

Vuetify allows for [overriding global and component-level SASS variables](https://vuetifyjs.com/en/features/sass-variables/).  Setting these up requires configuration that is slightly different from the Vuetify
documentation while using this Nuxt module.

1)  In your styles directory (for this example, we'll use `${workspace}/assets/styles`), create two files - `assets/styles/globals.scss` and `assets/styles/settings.scss`

2)  In the `globals.scss` file, we'll want to add
```scss
@use 'vuetify' with (
    // Global Vuetify SASS variable overrides.  For example:
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
    // Component Vuetify SASS variable overrides.
    // For example -- overriding button font capitalization (as seen at the bottom of the v-btn guide here https://vuetifyjs.com/en/api/v-btn/):
    // $button-text-transform: $button-text-transform-override,
);
```

4)  In your `nuxt.config.ts`, add a `css` entry to the `defineNuxtConfig` configuration object that points to `globals.scss` like so:
```javascript
export default defineNuxtConfig({
  css: ['@/assets/styles/globals.scss']
  // other options
})
```

> [!TIP]
> The [css](https://nuxt.com/docs/getting-started/styling#the-css-property) property within your `defineNuxtConfig` will import all styles from the file that you specify (in our case, `globals.scss`) into all components for convenience. Any styles appended to the `globals.scss` file in addition to the Vuetify Global Variables override will also be imported into all of your components. If you would like more fine-grained control, consider using a different file for your non-Vuetify global styles, like a separate `main.scss` that you import on a component-by-component basis.

5)  Again in your `nuxt.config.ts`, we'll want to add another entry to the `defineNuxtConfig` configuration object that overrides the default Vuetify Styles imports and instead imports your settings:
```javascript
export default defineNuxtConfig({
  css: ['assets/styles/globals.scss'],
  vuetify: {
    moduleOptions: {
      /* module specific options */
      /* https://www.youtube.com/watch?v=aamWg1TuC3o */
      disableVuetifyStyles: true,
      styles: {
        configFile: '@/assets/styles/settings.scss'
      },
    },
  }
  // other options
})
```

You should now be able to override your [global Vuetify SASS variables](https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/styles/settings/_variables.scss) as well as your [component-level Vuetify SASS variables](https://vuetifyjs.com/en/features/sass-variables/#variable-api)
