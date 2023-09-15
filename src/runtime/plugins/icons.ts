import { enabled, iconsConfiguration } from 'virtual:vuetify-icons-configuration'
import type { VuetifyOptions } from 'vuetify'

export function configureIcons(vuetifyOptions: VuetifyOptions) {
  if (enabled) {
    const icons = iconsConfiguration()
    const custom = icons?.defaultSet === 'custom'
    if (custom)
      return

    vuetifyOptions.icons = icons
  }
}
