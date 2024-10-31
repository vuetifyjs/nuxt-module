import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import * as Swetrix from 'swetrix'
import VuetifyLayout from './VuetifyLayout.vue'

import './styles/main.css'
import './styles/vars.css'

import 'uno.css'

if (inBrowser)
  import('./pwa')

export default {
  extends: DefaultTheme,
  Layout: VuetifyLayout,
  enhanceApp() {
    Swetrix.init('KMc9xOD28UCn', {
      apiURL: 'https://swetrix-api.vuetifyjs.com/log',
    })
    Swetrix.trackViews()
    Swetrix.trackErrors()
  },
} satisfies Theme
