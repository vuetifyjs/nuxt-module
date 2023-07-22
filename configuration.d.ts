declare module 'virtual:vuetify-configuration' {
  import type { VuetifyOptions } from 'vuetify';

  export const isDev: boolean
  export function vuetifyConfiguration(): VuetifyOptions
}

declare module 'virtual:vuetify-date-configuration' {
  import type { DateOptions } from 'vuetify';

  export const enabled: boolean
  export const isDev: boolean
  export const i18n: boolean
  export const adapter: 'vuetify' | 'date-fns' | 'moment' | 'luxon' | 'dayjs' | 'js-joda' | 'date-fns-jalali' | 'jalaali' | 'hijri' | 'custom'
  export function dateConfiguration(): DateOptions
}

declare module 'virtual:vuetify-icons-configuration' {
  import type { IconOptions } from 'vuetify'

  export const enabled: boolean
  export const isDev: boolean
  export function iconsConfiguration(): IconOptions
}
