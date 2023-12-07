<script setup lang="ts">
import type DateFnsAdapter from '@date-io/date-fns'
import { adapter } from 'virtual:vuetify-date-configuration'

const dateString = ref('')

watch(dateString, (x) => {
  // eslint-disable-next-line no-console
  console.log('dateString', x)
})

onMounted(() => {
  if (adapter === 'date-fns') {
    // Missing type is a Vuetify error (https://github.com/vuetifyjs/vuetify/issues/18710)
    const date = useVDate() as DateFnsAdapter
    dateString.value = date.formatByString(new Date(), 'dd MMMM yyyy')
  }
})
</script>

<template>
  <div>
    <div>@date-io/{{ adapter }}: {{ dateString }}</div>
  </div>
</template>
