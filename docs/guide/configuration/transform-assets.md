# Transform Asset URLs

The module automatically configures `transformAssetUrls` from the [Vuetify Vite Plugin](https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#image-loading) to resolve relative asset URLs passed to Vuetify components, such as `VImg` (e.g., `~/assets/img/some.png`).

You can customize this behavior by adding entries to the `includeTransformAssetsUrls` module option (for example, to include external components) or by disabling the option to exclude all entries.

The module will include the following normalizations for each entry in the `includeTransformAssetsUrls` module option:
- Adds kebab and pascal case entries (if missing from the original).
- Adds kebab and camel case and bind (`:xxx`) attrs entries (if missing from original).
- Excludes normalizations on original attrs entries containing `:` (for example `xlink:href`).
