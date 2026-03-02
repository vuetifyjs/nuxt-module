# Vuetify Composables

No more Vuetify composables manual imports, auto-import is enabled by default:
- [useDate](https://vuetifyjs.com/en/api/use-date/)
- [useDefaults](https://vuetifyjs.com/en/api/use-defaults/)
- [useDisplay](https://vuetifyjs.com/en/api/use-display/)
- [useLayout](https://vuetifyjs.com/en/api/use-layout/)
- [useLocale](https://vuetifyjs.com/en/api/use-locale/)
- [useRtl](https://vuetifyjs.com/en/api/use-rtl/)
- [useTheme](https://vuetifyjs.com/en/api/use-theme/)
- [useGoTo](https://vuetifyjs.com/en/api/use-go-to/): from Vuetify `v3.5.0+` (Polaris) and Vuetify Nuxt Module `v0.13.2+`
- [useHotkey](https://vuetifyjs.com/en/api/use-hotkey/): from Vuetify `v3.8.0+` and Vuetify Nuxt Module `v0.19.0+`
- [useRules](https://vuetifyjs.com/en/features/rules/): from Vuetify `v3.8.0+` and Vuetify Nuxt Module `v0.19.0+`
- [useMask](https://vuetifyjs.com/en/api/use-mask/): from Vuetify `v3.10.0+` and Vuetify Nuxt Module `v0.19.0+`

You can disable auto-import using `moduleOptions.importComposables: false`.

If you are using another composables that collide with the Vuetify ones, enable `moduleOptions.prefixComposables: true` to prefix them with `V`:
- `useDate` => `useVDate`
- `useDefaults` => `useVDefaults`
- `useLayout` => `useVLayout`
- `useDisplay` => `useVDisplay`
- `useLocale` => `useVLocale`
- `useRtl` => `useVRtl`
- `useTheme` => `useVTheme`
- `useGoTo` => `useVGoTo`: from Vuetify `v3.5.0+` (Polaris) and Vuetify Nuxt Module `v0.13.2+`
- `useHotkey` => `useVHotkey`: from Vuetify `v3.8.0+` and Vuetify Nuxt Module `v0.19.0+`
- `useRules` => `useVRules`: from Vuetify `v3.8.0+` and Vuetify Nuxt Module `v0.19.0+`
- `useMask` => `useVMask`: from Vuetify `v3.10.0+` and Vuetify Nuxt Module `v0.19.0+`

### useRules

`useRules` composable is available from Vuetify `v3.8.0+`. It is enabled by default if you are using Vuetify `v3.8.0+`.

You can configure it using `moduleOptions.enableRules` and `moduleOptions.rulesConfiguration`:

```ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      enableRules: true, // default true for Vuetify 3.8+
      rulesConfiguration: {
        fromLabs: true // default true until promotion
      }
    }
  }
})
```
