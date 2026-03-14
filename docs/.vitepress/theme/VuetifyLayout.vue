<script setup lang="ts">
  import { useData, useRoute } from 'vitepress'
  import DefaultTheme from 'vitepress/theme'
  import { createApp, nextTick, onMounted, onUnmounted, provide, watch } from 'vue'
  import HomeHeroCopy from './components/HomeHeroCopy.vue'

  const { isDark } = useData()
  const route = useRoute()
  const INSTALL_COMMAND = 'npx nuxi@latest module add vuetify-nuxt-module'
  const HERO_COPY_SELECTOR = '.VPHome .VPHero .actions .action:nth-child(1) a'

  function enableTransitions () {
    return 'startViewTransition' in document
      && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  }

  provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
    if (!enableTransitions()) {
      isDark.value = !isDark.value
      return
    }

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )}px at ${x}px ${y}px)`,
    ]

    await document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    }).ready

    document.documentElement.animate(
      { clipPath: isDark.value ? clipPath.toReversed() : clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
      },
    )
  })

  function mountHeroCopy () {
    nextTick(() => {
      const element = document.querySelector(HERO_COPY_SELECTOR)
      if (element) {
        const container = document.createElement('div')
        element.replaceWith(container)
        createApp(HomeHeroCopy, { command: INSTALL_COMMAND }).mount(container)
      }
    })
  }

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

  onMounted(() => {
    mountHeroCopy()
    window.addEventListener('mousemove', onMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    if (rafId) cancelAnimationFrame(rafId)
  })

  watch(
    () => route.path,
    () => {
      mountHeroCopy()
    },
  )
</script>

<template>
  <DefaultTheme.Layout />
</template>
