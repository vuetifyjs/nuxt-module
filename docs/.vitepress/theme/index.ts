import type { Theme } from 'vitepress'
import * as Swetrix from 'swetrix'
import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CompatibilityMatrix from './components/CompatibilityMatrix.vue'
import HomeHeroCopy from './components/HomeHeroCopy.vue'
import VuetifyLayout from './VuetifyLayout.vue'

import './styles/main.css'
import './styles/vars.css'

import 'uno.css'

if (inBrowser) {
  import('./pwa')
}

export default {
  extends: DefaultTheme,
  Layout: VuetifyLayout,
  enhanceApp ({ app }) {
    app.component('HomeHeroCopy', HomeHeroCopy)
    app.component('CompatibilityMatrix', CompatibilityMatrix)

    Swetrix.init('KMc9xOD28UCn', {
      apiURL: 'https://swetrix-api.vuetifyjs.com/log',
    })
    Swetrix.trackViews()
    Swetrix.trackErrors()
  },
} satisfies Theme
