# FAQ

## Maximum call stack size exceeded error

If you're getting a `Maximum call stack size exceeded` error when starting Nuxt dev server after upgrading to the latest Nuxt version (`3.11.0+`), disable `devLogs` in your Nuxt config file:
```ts
export default defineNuxtConfig({
  features: {
    devLogs: false,
  },
})
```

This PR [fix(nuxt): support serialising rich server logs](https://github.com/nuxt/nuxt/pull/26503) should fix the error in the next Nuxt release (`v3.12.0 or `v4.0.0`).

