<script setup lang="ts">
import { useLocale } from 'vuetify'

const value = reactive<{
  name1?: string
  name2?: string
  name3?: string
}>({
  name1: undefined,
  name2: undefined,
  name3: undefined,
})
const { locales, t, availableLocales } = useI18n()
const { current } = useLocale()
watch(current, () => {
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
    <VTextField
      v-model="value.name1"
      :label="t('xxx')"
      hint="name 1"
      persistent-hint
      outlined
    />
    <VBtn>{{ t('xxx') }}</VBtn>
  </div>
</template>
