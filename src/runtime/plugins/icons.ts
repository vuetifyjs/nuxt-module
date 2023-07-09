import { iconsConfiguration } from 'virtual:vuetify-icons-configuration'
import type { VuetifyOptions } from 'vuetify'

export function configureIcons(vuetifyOptions: VuetifyOptions) {
  vuetifyOptions.icons = iconsConfiguration()
}
