<script setup lang="ts">
import type DateFnsAdapter from '@date-io/date-fns'
import { adapter } from 'virtual:vuetify-date-configuration'

const dateString = ref('')

watch(dateString, (x) => {
  // eslint-disable-next-line no-console
  console.log('dateString', x)
})

onMounted(() => {
  const date = useVDate()
  if (adapter === 'date-fns') {
    // Missing type is a Vuetify error (https://github.com/vuetifyjs/vuetify/issues/18710)
    dateString.value = (date as DateFnsAdapter).formatByString(new Date(), 'dd MMMM yyyy')
  }
  else {
    dateString.value = date.format(date.parseISO(new Date().toISOString()), 'fullDate')
  }
})
</script>

<template>
  <div>
    <div>@date-io/{{ adapter }}: {{ dateString }}</div>
  </div>
</template>
