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
const { locales, t } = useI18n({ useScope: 'global' })
const { current } = useLocale()
</script>

<template>
  <div>
    <div>Vuetify current: {{ current }}</div>
    <div>I18N current: {{ $i18n.locale }}</div>
    <div>t without locale: {{ t('favoutire') }}</div>
    <div>t with I18N locale: {{ t('favoutire', $i18n.locale) }}</div>
    <div>t with Vuetify current locale: {{ t('favoutire', current) }}</div>
    <div>$t {{ $t('favoutire') }}</div>
    <v-select
      v-model="current"
      :items="locales"
      item-title="name"
      item-value="code"
      outlined
    />
    <VTextField
      v-model="value.name1"
      :label="t('favoutire')"
      hint="name 1"
      persistent-hint
      outlined
    />
    <VBtn>ja</VBtn>
  </div>
</template>
