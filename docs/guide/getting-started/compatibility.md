# Compatibility

## Version Requirements

The Vuetify Nuxt Module is designed to work with **Nuxt** `^3.15.0` (including Nuxt 4 support), **Vuetify** `^3.8.0`, and **@nuxtjs/i18n** `^9.0.0`. The module is also tested with and supports **Vuetify** `^4.1.0`.

::: info Builder Support
Please note that this module is intended to use with **Vite**. Support for Webpack and Rspack is not available.
:::

::: info Vuetify 4.1 Labs Graduations
Vuetify 4.1 graduated several components from labs to stable. Since this module resolves components data-driven from Vuetify's shipped import maps, graduated components like `VFileUpload`, `VDateInput`, `VColorInput`, `VPicker` and `VIconBtn` are now auto-imported without needing the `labComponents` option. The new labs components `VDateRangePicker`, `VHeatmap`, `VHighlight` and `VMonthPicker` remain available via `labComponents`.
:::

## Compatibility Matrix

<CompatibilityMatrix />
