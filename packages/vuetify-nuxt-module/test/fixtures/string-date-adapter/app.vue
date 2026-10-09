<script setup lang="ts">
  import { useDate } from 'vuetify'

  const value = useDate().date('2026-08-22')
</script>

<template>
  <v-app>
    <p :data-date-type="typeof value">{{ value }}</p>
  </v-app>
</template>
