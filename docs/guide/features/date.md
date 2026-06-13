# Date Support

To use Vuetify components [that require date functionality](https://vuetifyjs.com/en/features/dates/), you can install and configure one of the [@date-io](https://github.com/dmtrKovalenko/date-io#projects) adapters.

Here are the steps to set up date functionality:
- Install one of the [@date-io](https://github.com/dmtrKovalenko/date-io#projects) adapters (optional).
- Configure the date entry in your Vuetify configuration:


```ts
vuetifyOptions: {
  date: {
    adapter: 'vuetify' // 'vuetify' | 'date-fns' | 'moment' | 'luxon' | 'dayjs' | 'js-joda' | 'date-fns-jalali' | 'jalaali' | 'hijri' | 'custom'
  }
}
```

If the `@nuxtjs/i18n` module is installed, the `vuetifyOptions.date.locale` and `vuetifyOptions.date.rtl` options will be automatically configured. Please note that any manually configured `locale` entry will be ignored in this case.

If you prefer to use a custom date adapter, you can set `vuetifyOptions.date.adapter = 'custom'` and then follow these steps:
- Add a Nuxt Plugin and use the `vuetify:configuration` hook to configure your Vuetify options.
- Import the `virtual:vuetify-date-configuration` module to access the configuration:
  
  
```ts
import { adapter, dateConfiguration, i18n } from 'virtual:vuetify-date-configuration'
```

Check out [vuetify-date](https://github.com/vuetifyjs/nuxt-module/blob/main/src/runtime/plugins/vuetify-date.ts) plugin and the [date module](https://github.com/vuetifyjs/nuxt-module/blob/main/src/runtime/plugins/date.ts) for an example of a custom date adapter and how to access to the configuration.

## Troubleshooting

### `useDate()` — call methods on the instance, don't destructure them

`useDate()` returns a Vuetify date adapter instance whose methods rely on `this`.
Destructuring them detaches `this`, which throws during SSR (e.g.
`Cannot read properties of undefined (reading 'locale')`). In dev the error is
swallowed and the page falls back to client rendering, so it only surfaces after
`nuxt build`/`nuxt generate`.

```ts
// ❌ loses `this` — crashes on the server
const { date, format } = useDate()
format(date(value), 'keyboardDate')

// ✅ keep the instance, call methods on it
const adapter = useDate()
adapter.format(adapter.date(value), 'keyboardDate')
```

### date-fns base locale

With the `date-fns` adapter the locale is resolved from
`vuetifyOptions.locale.locale` (mapped to the matching `date-fns/locale` export)
at build time. If it is unset or unknown the module falls back to `enUS` and logs
a warning. Set `vuetifyOptions.locale.locale` to a supported Vuetify locale to
choose the base locale.

### Function-valued date formats are not supported

`vuetifyOptions.date.formats` only accepts serializable
`Intl.DateTimeFormatOptions`. The date configuration is statically serialized, so
function formats cannot be expressed. Use a `custom` date adapter if you need them.
