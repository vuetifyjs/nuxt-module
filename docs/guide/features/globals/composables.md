# Vuetify Composables

Manual imports of Vuetify composables are no longer required; auto-import is enabled by default for:
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

You can disable auto-import by setting `moduleOptions.importComposables: false`.

If you are using other composables that conflict with Vuetify's, you can enable `moduleOptions.prefixComposables: true` to prefix the Vuetify composables with `V`:
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

The `useRules` composable is available in Vuetify `v3.8.0+` and is enabled by default for that version.

You can configure it using `moduleOptions.enableRules` and `moduleOptions.rulesConfiguration`:

::: code-group

```ts [nuxt.config.ts]
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

:::
