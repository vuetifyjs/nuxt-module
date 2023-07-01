import type { VuetifyOptions } from 'vuetify'

export type BooleanOrArrayString = boolean | string[]

export interface VOptions extends Partial<Omit<VuetifyOptions, 'ssr' | 'directives'>> {
  /**
   * Include the lab components?
   *
   * You can include all lab components configuring `labComponents: true`.
   *
   * You can provide an array with the names of the lab components to include.
   *
   * @see https://vuetifyjs.com/en/labs/introduction/
   *
   * @default false
   */
  labComponents?: BooleanOrArrayString
  /**
   * Include the directives?
   *
   * You can include all directives configuring `directives: true`.
   *
   * You can provide an array with the names of the directives to include.
   *
   * @default false
   */
  directives?: BooleanOrArrayString
}

export interface ModuleOptions {
  moduleOptions?: {
    writePlugin?: boolean
    styles?: true | 'none' | 'expose' | 'sass' | {
      configFile: string
    }
  }
  vuetifyOptions?: VOptions
}

declare module '#app' {
  interface RuntimeNuxtHooks {
    'vuetify:configuration': (vuetifyOptions: VuetifyOptions) => void
  }
}
