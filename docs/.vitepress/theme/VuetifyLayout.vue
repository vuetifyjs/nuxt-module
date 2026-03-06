<script setup lang="ts">
  import { useData, useRoute } from 'vitepress'
  import DefaultTheme from 'vitepress/theme'
  import { createApp, nextTick, onMounted, provide, watch } from 'vue'
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

  onMounted(() => {
    mountHeroCopy()
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
