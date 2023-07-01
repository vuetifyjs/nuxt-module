declare module 'virtual:vuetify-configuration' {
  import type { VuetifyOptions } from 'vuetify';

  export const isDev: boolean
  export const vuetifyConfiguration: () => VuetifyOptions
}
