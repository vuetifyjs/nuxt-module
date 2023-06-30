<script setup lang="ts">
const value = reactive<{
  name1?: string
  name2?: string
  name3?: string
}>({
  name1: undefined,
  name2: undefined,
  name3: undefined,
})
</script>

<template>
  <div>
    <VTextField
      v-model="value.name1"
      label="Name 1"
      hint="name 1"
      persistent-hint
      outlined
    />
    <VBtn>ja</VBtn>
  </div>
</template>
