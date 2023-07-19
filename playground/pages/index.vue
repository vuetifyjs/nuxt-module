<script setup lang="ts">
// import { useLocale, useRtl } from 'vuetify'

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
// eslint-disable-next-line no-console
console.log(useNuxtApp().$vuetify.icons)

// const rtl = ref(isRtl.value)

watch(isRtl, (x) => {
  // eslint-disable-next-line no-console
  console.log('isRtl', x)
  // rtl.value = x
}, { immediate: true })

watch(current, () => {
  // eslint-disable-next-line no-console
  console.log('current', t('xxx', { locale: current.value }))
})
</script>

<template>
  <div>
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
      :items="locales"
      item-title="name"
      item-value="code"
      outlined
    />
    <v-text-field
      v-model="value.name1"
      :label="t('xxx')"
      hint="name 1"
      persistent-hint
      outlined
      clearable
    />
    <v-btn>{{ t('xxx') }}</v-btn>
    <v-locale-provider locale="es-ES">
      <v-btn>{{ $vuetify.locale.t('xxx') }}</v-btn>
    </v-locale-provider>
    <!--    <v-icon icon="fas fa-home" /> -->
    <!--    <v-icon icon="$account" /> -->
    <v-icon class="i-mdi:account" />
    <i class="i-mdi:account block" />
    <v-checkbox v-model="isRtl" label="isRtl" readonly :true-value="true" :false-value="false" />
    <v-checkbox v-model="isRtl" label="isRtl" readonly :true-value="true" :false-value="false" false-icon="i-mdi:account" />
    <div style="display: flex">
      <v-date-picker />
      <v-locale-provider locale="ar-EG" rtl>
        <v-date-picker />
      </v-locale-provider>
    </div>
  </div>
</template>
