<script setup lang="ts">
  const data = [
    { module: '^1.0.0', nuxt: '>=3.15.0', vuetify: '>=3.8.0', i18n: '>=9.0.0' },
    { module: '>= 0.17.0', nuxt: '>= 3.9.0', vuetify: '^3.7.0', i18n: '^8.0.0' },
    { module: '> 0.15.0', nuxt: '>= 3.9.0', vuetify: '^3.6.12', i18n: '^8.0.0' },
    { module: '>= 0.13.0', nuxt: '^3.9.0', vuetify: '^3.5.1', i18n: '^8.0.0' },
    { module: '< 0.13.0', nuxt: '^3.6.5', vuetify: '^3.5.1', i18n: '^8.0.0' },
    { module: '<= 0.7.0', nuxt: '^3.0.0', vuetify: '^3.4.3', i18n: '^8.0.0-beta-12' },
  ]
</script>

<template>
  <div class="compatibility-matrix">
    <table>
      <thead>
        <tr>
          <th>Nuxt Module</th>
          <th>Nuxt</th>
          <th>Vuetify</th>
          <th>I18n</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.module">
          <td><strong>{{ row.module }}</strong></td>
          <td><code>{{ row.nuxt }}</code></td>
          <td><code>{{ row.vuetify }}</code></td>
          <td><code>{{ row.i18n }}</code></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
  .compatibility-matrix {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
    width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 !important;
    display: table !important;
  }

  th, td {
    padding: 12px 16px;
    /* text-align: center; */
    border: none !important;
    border-bottom: 1px solid var(--vp-c-divider) !important;
    background-color: var(--vp-c-bg);
    white-space: nowrap;
  }

  th {
    background-color: var(--vp-c-bg-soft);
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  tr:last-child td {
    border-bottom: none !important;
  }

  tbody tr:hover td {
    background-color: var(--vp-c-bg-soft);
  }
</style>
