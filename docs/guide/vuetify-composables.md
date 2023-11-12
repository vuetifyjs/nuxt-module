# Vuetify Composables

No more Vuetify composables manual imports, auto import is enabled by default:
- [useDate](https://vuetifyjs.com/en/api/use-date/)
- [useDefaults](https://vuetifyjs.com/en/api/use-defaults/)
- [useDisplay](https://vuetifyjs.com/en/api/use-display/)
- [useLayout](https://vuetifyjs.com/en/api/use-layout/)
- [useLocale](https://vuetifyjs.com/en/api/use-locale/)
- [useRtl](https://vuetifyjs.com/en/api/use-rtl/)
- [useTheme](https://vuetifyjs.com/en/api/use-theme/)

You can disable auto-import using `moduleOptions.importComposables: false`.

If you are using another composables that collide with the Vuetify ones, enable `moduleOptions.prefixComposables: true` to prefix them with `V`:
- `useDate` => `useVDate`
- `useDefaults` => `useVDefaults`
- `useLayout` => `useVLayout`
- `useDisplay` => `useVDisplay`
- `useLocale` => `useVLocale`
- `useRtl` => `useVRtl`
- `useTheme` => `useVTheme`

