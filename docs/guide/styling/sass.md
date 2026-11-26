# SASS Customization

Starting from version `0.17.0`, this module configures Nuxt to use the SASS modern compiler (`modern-compiler`) by default.

For the best compatibility and performance, it is recommended to replace your `sass` dependency with `sass-embedded`.

Please check [Build Performance](https://vuetifyjs.com/en/features/sass-variables/#build-performance) in the Vuetify documentation for more details.

## Overriding SASS Variables

Vuetify allows for [overriding global and component-level SASS variables](https://vuetifyjs.com/en/features/sass-variables/). With this module, both kinds of variables live in a single settings file that you pass to the `styles.configFile` module option.

1)  Create a settings file, for example `${srcDir}/assets/settings.scss`, and configure `vuetify/settings` in it:
::: code-group

```scss [assets/settings.scss]
@use 'vuetify/settings' with (
  // Global variables
  $body-font-family: ('Work Sans', sans-serif),
  $heading-font-family: ('Mulish', sans-serif),
  $font-size-root: 18px,
  // $utilities: false,
  // $reset: false,
  // $color-pack: false,

  // Component variables, see https://vuetifyjs.com/en/features/sass-variables/#variable-api
  $button-font-weight: 700,
  $button-text-transform: capitalize,
);
```

:::

2)  Point the module at that file in your `nuxt.config.ts`:
::: code-group

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      styles: { configFile: 'assets/settings.scss' }
    }
  }
})
```

:::

The module then compiles Vuetify's global styles and the styles of every component with your settings, instead of loading the precompiled CSS. You do not need to add anything to the Nuxt `css` option.

For a full list of variables, check the [global variables](https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/styles/settings/_variables.scss) and [all of the imports in the settings index](https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/styles/settings/_index.sass).

::: tip
Use `@forward 'vuetify/settings' with (...)` instead of `@use` if you also want to read the variables in your own components with `@use '~/assets/settings'`.
:::

### Do not load a second copy of the styles

::: warning
Do not configure Vuetify with `@use 'vuetify' with (...)` (or `@use 'vuetify/styles' with (...)`) in a file listed in the Nuxt `css` option, and do not add `vuetify/styles` to `css` yourself.
:::

The Vuetify documentation suggests `@use 'vuetify' with (...)` for projects that set up the styles manually. This module already adds Vuetify's styles for you, so that file becomes a second, differently configured copy:

- without `styles.configFile`, the module adds the precompiled `vuetify/styles/core`, which ignores SASS variables;
- with `styles.configFile`, the module adds the styles compiled with your settings file.

In both cases the module's copy is loaded after your `css` entries and sits in the same cascade layer, so it wins. The typical symptom is that component variables apply while global ones such as `$body-font-family` or `$font-size-root` fall back to the defaults (`Roboto`, `1rem`). Move those variables to the settings file to fix it.

### Things to know

- **`$typography` is merged.** Vuetify deep-merges your map into its defaults, so you only need to list the text styles and keys you change.
- **Fonts are not loaded for you.** `$body-font-family` and `$heading-font-family` only set `font-family`; Vuetify does not emit `@font-face`. Load the fonts separately, for example with [`@nuxt/fonts`](https://fonts.nuxt.com/).
- **Compilation is slower than the precompiled CSS.** See [Experimental Cache](/guide/styling/caching).
