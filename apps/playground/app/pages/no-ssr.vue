<script setup lang="ts">
  import { ssrClientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'

  definePageMeta({
    ssr: false,
  })

  const { locales } = useI18n()
  const { current } = useLocale()
  const theme = useTheme()

  const enableToggleTheme = computed(() => {
    if (ssrClientHintsConfiguration.prefersColorScheme && ssrClientHintsConfiguration.prefersColorSchemeOptions)
      return !ssrClientHintsConfiguration.prefersColorSchemeOptions.useBrowserThemeOnly

    return false
  })

  const isDark = computed({
    get: () => theme.global.name.value === 'dark',
    set: () => theme.cycle(),
  })

  function toggleTheme () {
    theme.cycle()
  }
</script>

<template>
  <v-container fluid>
    <v-row>
      <!-- Header Section -->
      <v-col cols="12">
        <v-card class="mb-4" color="secondary" variant="tonal">
          <v-card-text class="d-flex align-center">
            <v-icon class="mr-4" icon="i-mdi-earth-off" size="64" />
            <div>
              <div class="text-h4 font-weight-bold">No-SSR Page</div>
              <div class="text-subtitle-1">This page is rendered entirely on the client side</div>
            </div>
            <v-spacer />
            <v-btn
              color="surface"
              prepend-icon="i-mdi-home"
              to="/"
              variant="elevated"
            >
              Back to Home
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Configuration Card -->
      <v-col cols="12" md="6">
        <v-card height="100%" prepend-icon="i-mdi-cog" title="Configuration">
          <v-card-text>
            <div class="text-subtitle-2 mb-2">Theme Settings</div>
            <v-row align="center" class="mb-4">
              <v-col cols="auto">
                <v-switch
                  v-if="enableToggleTheme"
                  v-model="isDark"
                  color="primary"
                  hide-details
                  inset
                  label="Dark Theme"
                />
                <v-btn
                  v-else
                  prepend-icon="i-mdi-theme-light-dark"
                  variant="tonal"
                  @click="toggleTheme"
                >
                  Toggle Theme
                </v-btn>
              </v-col>
              <v-col>
                <v-chip :color="isDark ? 'white' : 'black'" variant="outlined">
                  Current: {{ theme.global.name }}
                </v-chip>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="text-subtitle-2 mb-2">Localization</div>
            <v-select
              v-model="current"
              density="comfortable"
              item-title="name"
              item-value="code"
              :items="locales"
              label="Select Locale"
              prepend-inner-icon="i-mdi-web"
              variant="outlined"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Client Side Demo -->
      <v-col cols="12" md="6">
        <v-card height="100%" prepend-icon="i-mdi-monitor-cellphone" title="Client-Side Interaction">
          <v-card-text>
            <v-alert
              border="start"
              class="mb-4"
              type="info"
              variant="tonal"
            >
              Since this page has <code>ssr: false</code>, all content is generated in the browser.
            </v-alert>

            <div class="d-flex flex-column gap-2">
              <v-btn color="primary" prepend-icon="i-mdi-plus">
                Interactive Button
              </v-btn>

              <v-sheet class="pa-4 bg-grey-lighten-4 rounded mt-2">
                <div class="text-caption">Client Time:</div>
                <div class="text-h6 font-weight-mono">{{ new Date().toLocaleTimeString() }}</div>
              </v-sheet>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.font-weight-mono {
  font-family: monospace;
}
.gap-2 {
  gap: 8px;
}
</style>
