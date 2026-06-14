<script setup lang="ts">
  import { useTheme } from 'vuetify'

  const theme = useTheme()
</script>

<template>
  <v-app>
    <v-main>
      <div id="primary-probe">{{ theme.current.value.colors.primary }}</div>
    </v-main>
  </v-app>
</template>
