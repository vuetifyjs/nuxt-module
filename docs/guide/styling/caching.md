# Experimental Cache

When using custom SASS configuration (`configFile`), Vuetify needs to compile SASS variables for every component. This process can be slow during development startup and HMR.

To improve performance, this module provides an experimental caching mechanism.

## Enabling Cache

You can enable the experimental cache in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      styles: {
        configFile: 'assets/settings.scss',
        experimental: {
          cache: true
        }
      }
    }
  }
})
```

## How it works

When enabled, the module will:

1.  Calculate a hash based on your:
    *   Vuetify version
    *   Vite version
    *   Content of your SASS config file
2.  Check if a cache exists for this hash in `node_modules/.cache/vuetify-nuxt-module/styles`.
3.  If not found, it will pre-compile all Vuetify styles with your SASS variables into CSS files and store them in the cache directory.
4.  Serve these cached CSS files directly during development, bypassing the SASS compilation step.

## Benefits

*   **Faster Startup**: Initial compilation happens once. Subsequent starts are instant.
*   **Faster HMR**: Changing Vue files doesn't trigger SASS recompilation for Vuetify styles.
*   **Persistent**: Cache survives server restarts.

## Invalidation

The cache is automatically invalidated (recreated) if:
*   You update Vuetify or Vite.
*   You modify your SASS configuration file.

You can also manually clear the cache by deleting the `node_modules/.cache/vuetify-nuxt-module` directory.
