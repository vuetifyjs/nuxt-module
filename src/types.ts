import type { VuetifyOptions } from 'vuetify'

export type BooleanOrArrayString = boolean | string[]

export interface VOptions extends Partial<Omit<VuetifyOptions, 'ssr' | 'directives'>> {
  /**
   * Include labs components?
   *
   * @see https://vuetifyjs.com/en/labs/introduction/
   *
   * @default false
   */
  labComponents?: BooleanOrArrayString
  /**
   * Include directives?
   *
   * You can include all directives configuring `directives: true`.
   *
   * Ypu can provide an array with the directive names to be included.
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
