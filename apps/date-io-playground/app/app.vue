<script setup lang="ts">
  import type DateFnsAdapter from '@date-io/date-fns'
  import { adapter } from 'virtual:vuetify-date-configuration'

  const dateString = ref('')

  watch(dateString, x => {
    console.log('dateString', x)
  })

  onMounted(() => {
    const date = useVDate()
    dateString.value = adapter === 'date-fns'
      ? (date as DateFnsAdapter).formatByString(new Date(), 'dd MMMM yyyy')
      : date.format(date.parseISO(new Date().toISOString()), 'fullDate')
  })
</script>

<template>
  <div>
    <div class="adapter">
      @date-io/{{ adapter }}: {{ dateString }}
    </div>
    <br>
    <v-date-picker />
  </div>
</template>

<style>
.adapter {
  padding: 1rem;
}
</style>
