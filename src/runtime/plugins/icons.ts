import { iconsConfiguration } from 'virtual:vuetify-icons-configuration'
import type { VuetifyOptions } from 'vuetify'

export function configureIcons(_vuetifyOptions: VuetifyOptions) {
  console.log('configureIcons', iconsConfiguration())
  // vuetifyOptions.icons = iconsConfiguration()
}
