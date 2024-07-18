# Transform Asset URLs

The module configures the `transformAssetUrls` from [Vuetify Vite Plugin](https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#image-loading) to resolve relative asset URLs that are passed to Vuetify components such as `VImg` (e.g. `~/assets/img/some.png`).

You can also add custom entries to the `includeTransformAssetsUrls` module option, for example, to include external components, or you can disable the module option to exclude all entries.

The module will include the following normalizations for each entry in `includeTransformAssetsUrls` module option:
- add kebab and pascal case entries (if missing from the original)
- add kebab and camel case and bind (`:xxx`) attrs entries (if missing from original)
- excluded normalizations on original attrs entries containing `:` (for example `xlink:href`)
