import type { VuetifyOptions } from 'vuetify'

export type VOptions = Partial<VuetifyOptions> & { ssr: boolean }

export interface ModuleOptions {
  moduleOptions: {
    writePlugin?: boolean
    styles?: true | 'none' | 'expose' | 'sass' | {
      configFile: string
    }
  }
  vuetifyOptions?: VOptions
}
