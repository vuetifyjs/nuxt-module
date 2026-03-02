<script setup lang="ts">
// import { useLocale, useRtl } from 'vuetify'
  import { ssrClientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'
  import prependAvatar from '~/assets/logo.svg'

  definePageMeta({
    middleware: 'vuetify',
  })

  const value = reactive<{
    name1?: string
    name2?: string
    name3?: string
  }>({
    name1: undefined,
    name2: undefined,
    name3: undefined,
  })
  const { locales, t } = useI18n()
  const { current } = useLocale()
  const { isRtl } = useRtl()
  const x = useDate()

  console.log(x.date)

  if (import.meta.client) {
    console.log(useNuxtApp().$vuetify.icons)
  }

  const ssrClientHints = useNuxtApp().$ssrClientHints
  const { width, height, md } = useDisplay()
  const theme = useTheme()

  const enableToogleTheme = computed(() => {
    if (ssrClientHintsConfiguration.prefersColorScheme && ssrClientHintsConfiguration.prefersColorSchemeOptions)
      return !ssrClientHintsConfiguration.prefersColorSchemeOptions.useBrowserThemeOnly

    return false
  })

  function toogleTheme () {
    theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'
  }

  // const rtl = ref(isRtl.value)

  watch(isRtl, x => {
    console.log('isRtl', x)
  // rtl.value = x
  }, { immediate: true })

  watch(current, () => {
    console.log('current', t('xxx', { locale: current.value }))
  })
</script>

<template>
  <div>
    <NuxtLink to="/no-ssr">
      Go To No-SSR Page
    </NuxtLink>
    <v-img height="48" src="~/assets/logo.svg" width="48" />
    <v-card height="48" prepend-avatar="~/assets/logo.svg" width="48" />
    <v-card height="48" :prepend-avatar="prependAvatar" width="48" />
    <div>
      <h2>SSR Client Hints Headers:</h2>
      <pre class="text-body-2">{{ ssrClientHints }}</pre>
      <h2>useDisplay</h2>
      <div>Resize the screen and refresh the page</div>
      <pre>{{ width }} x {{ height }} (md {{ md }}?)</pre>
      <div>
        <h2>useTheme: {{ theme.global.name }}</h2>
        <v-btn v-if="enableToogleTheme" @click="toogleTheme">
          toogle theme
        </v-btn>
      </div>
    </div>
    <div>Vuetify useLocale(): {{ current }}</div>
    <div>$i18n current: {{ $i18n.locale }}</div>
    <div>$vuetify.locale.current: {{ $vuetify.locale.current }}</div>
    <div>t without locale: {{ t('xxx') }}</div>
    <div>t with I18N locale: {{ t('xxx', { locale: $i18n.locale }) }}</div>
    <div>t with Vuetify current locale: {{ t('xxx', { locale: current }) }}</div>
    <div>$t {{ $t('xxx') }}</div>
    <div>$vuetify.locale.t {{ $vuetify.locale.t('xxx') }}</div>
    <v-select
      v-model="current"
      item-title="name"
      item-value="code"
      :items="locales"
      outlined
    />
    <v-text-field
      v-model="value.name1"
      clearable
      :error="true"
      hint="name 1"
      :label="t('xxx')"
      outlined
      persistent-hint
    />
    <v-btn>{{ t('xxx') }}</v-btn>
    <v-locale-provider locale="es-ES">
      <v-btn>{{ $t('xxx') }}</v-btn>
    </v-locale-provider>
    <!--    <v-icon icon="fas fa-home" /> -->
    <!--    <v-icon icon="$account" /> -->
    <v-icon class="i-mdi:account" />
    <i class="i-mdi:account block" />
    <v-checkbox
      :false-value="false"
      label="isRtl"
      :model-value="isRtl"
      readonly
      :true-value="true"
    />
    <v-checkbox
      base-color="red"
      false-icon="i-mdi:account"
      :false-value="false"
      label="isRtl"
      :model-value="isRtl"
      readonly
    />
    <div style="display: flex">
      <v-date-picker />
      <!-- we cannot use this when using lazy: missing messages since ar-EG not being loaded -->
      <!--      <v-locale-provider locale="ar-EG" rtl>
        <v-date-picker />
      </v-locale-provider> -->
    </div>
    <button class="mb-2 ml-2 px-2 my-button text-white bg-primary rounded-lg">
      Reserve
    </button>
  </div>
</template>

<style lang="scss">
  @use '../assets/settings';

  .my-button {
    height: settings.$button-height;
  }
</style>
