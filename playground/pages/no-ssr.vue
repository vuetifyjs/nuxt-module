<script setup lang="ts">
import { ssrClientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'

const { locales } = useI18n()
const { current } = useLocale()
const theme = useTheme()

const ResolvedVBtn = resolveComponent('v-btn')
const OtherResolvedVBtn = resolveComponent('VBtn')

const enableToogleTheme = computed(() => {
  if (ssrClientHintsConfiguration.prefersColorScheme && ssrClientHintsConfiguration.prefersColorSchemeOptions)
    return !ssrClientHintsConfiguration.prefersColorSchemeOptions.useBrowserThemeOnly

  return false
})

function toogleTheme() {
  theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'
}
function onClickOutside(e: MouseEvent) {
  // eslint-disable-next-line no-console
  console.log('onClickOutside', e)
}
</script>

<template>
  <div>
    <NuxtLink to="/">
      Back To Home Page
    </NuxtLink>
    <div>
      <h2>useTheme: {{ theme.global.name }}</h2>
      <v-btn v-if="enableToogleTheme" @click="toogleTheme">
        toogle theme
      </v-btn>
      <ResolvedVBtn v-click-outside="onClickOutside" v-ripple>
        resolveComponent('v-btn')
      </ResolvedVBtn>
      <OtherResolvedVBtn v-click-outside="onClickOutside" v-ripple>
        resolveComponent('VBtn')
      </OtherResolvedVBtn>
      <LazyVBtn v-click-outside="onClickOutside" v-ripple>
        LazyVBtn
      </LazyVBtn>
    </div>
    <v-select
      v-model="current"
      :items="locales"
      item-title="name"
      item-value="code"
      outlined
    />
  </div>
</template>
