import type { Theme } from 'vitepress'
import * as Swetrix from 'swetrix'
import { inBrowser } from 'vitepress'
import CopyOrDownloadAsMarkdownButtons from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue'
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
  enhanceApp ({ app, router }) {
    app.component('HomeHeroCopy', HomeHeroCopy)
    app.component('CompatibilityMatrix', CompatibilityMatrix)
    app.component('CopyOrDownloadAsMarkdownButtons', CopyOrDownloadAsMarkdownButtons)

    if (inBrowser) {
      let rafId: number | null = null
      let mouseX = 0
      let mouseY = 0

      function updateLogoTilt () {
        const logo = document.querySelector('.VPHome .image-src') as HTMLElement
        if (!logo) {
          rafId = null
          return
        }

        const { innerWidth, innerHeight } = window
        const x = (mouseX / innerWidth - 0.5) * 2
        const y = (mouseY / innerHeight - 0.5) * 2

        const tiltX = (y * -10).toFixed(2)
        const tiltY = (x * 10).toFixed(2)

        logo.style.transform = `translate(-50%, -50%) perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
        rafId = null
      }

      function onMouseMove (e: MouseEvent) {
        mouseX = e.clientX
        mouseY = e.clientY

        if (!rafId) {
          rafId = requestAnimationFrame(updateLogoTilt)
        }
      }

      router.onBeforeRouteChange = to => {
        if (to === '/') {
          window.addEventListener('mousemove', onMouseMove, { passive: true })
        } else {
          window.removeEventListener('mousemove', onMouseMove)
          if (rafId) {
            cancelAnimationFrame(rafId)
          }
        }
      }

      Swetrix.init('KMc9xOD28UCn', {
        apiURL: 'https://swetrix-api.vuetifyjs.com/log',
      })
      Swetrix.trackViews()
      Swetrix.trackErrors()
    }
  },
} satisfies Theme
