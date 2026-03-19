<script setup lang="ts">
  import { useData } from 'vitepress'
  import DefaultTheme from 'vitepress/theme'
  import { nextTick, provide } from 'vue'
  import HomeHeroCopy from './components/HomeHeroCopy.vue'

  const { isDark } = useData()
  const INSTALL_COMMAND = 'npx nuxi@latest module add vuetify-nuxt-module'

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
        fill: 'forwards',
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
      },
    )
  })
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-actions-before-actions>
      <HomeHeroCopy class="home" :command="INSTALL_COMMAND" />
    </template>
  </DefaultTheme.Layout>
</template>
