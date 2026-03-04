<script setup lang="ts">
  import { ssrClientHintsConfiguration } from 'virtual:vuetify-ssr-client-hints-configuration'
  import prependAvatar from '~/assets/logo.svg'

  definePageMeta({
    middleware: 'vuetify',
  })

  const { locales, t, locale } = useI18n()
  const { current } = useLocale()
  const { isRtl } = useRtl()
  const { width, height, name: displayName } = useDisplay()
  const theme = useTheme()
  const rules = useRules()

  const isDark = computed({
    get: () => theme.global.name.value === 'dark',
    set: () => theme.cycle(),
  })

  const ssrClientHints = useNuxtApp().$ssrClientHints

  const formData = reactive({
    name: '',
    email: '',
    select: null,
    date: undefined,
    ruleValue: '',
  })

  watch(isRtl, val => {
    console.log('RTL changed:', val)
  }, { immediate: true })

</script>

<template>
  <v-container fluid>
    <v-row>
      <!-- Welcome Section -->
      <v-col cols="12">
        <v-card class="mb-4" color="primary" variant="tonal">
          <v-card-text class="d-flex align-center">
            <v-avatar class="mr-4" size="64">
              <v-img alt="Logo" :src="prependAvatar" />
            </v-avatar>
            <div>
              <div class="text-h4 font-weight-bold">Vuetify Nuxt Playground</div>
              <div class="text-subtitle-1">Explore features, components, and configurations</div>
            </div>
            <v-spacer />
            <v-btn
              color="surface"
              prepend-icon="i-mdi:earth-off"
              to="/no-ssr"
              variant="elevated"
            >
              No-SSR Page
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Theme & Display -->
      <v-col cols="12" md="6">
        <v-card height="100%" prepend-icon="i-mdi:monitor-dashboard" title="Theme & Display">
          <v-card-text>
            <v-row align="center">
              <v-col cols="6">
                <v-switch
                  v-model="isDark"
                  color="primary"
                  hide-details
                  inset
                  label="Dark Theme"
                />
              </v-col>
              <v-col cols="6">
                <v-chip :color="isDark ? 'white' : 'black'" variant="outlined">
                  Current: {{ theme.global.name }}
                </v-chip>
              </v-col>
            </v-row>
            <v-divider class="my-3" />
            <div class="text-subtitle-2 mb-2">Display Dimensions</div>
            <v-list class="bg-grey-lighten-4 rounded" density="compact" nav>
              <v-list-item prepend-icon="i-mdi:resize" :subtitle="width + 'px'" title="Width" />
              <v-list-item prepend-icon="i-mdi:resize" :subtitle="height + 'px'" title="Height" />
              <v-list-item prepend-icon="i-mdi:tablet" :subtitle="displayName" title="Breakpoint" />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Localization -->
      <v-col cols="12" md="6">
        <v-card height="100%" prepend-icon="i-mdi:translate" title="Localization">
          <v-card-text>
            <v-select
              v-model="current"
              density="comfortable"
              item-title="name"
              item-value="code"
              :items="locales"
              label="Select Locale"
              prepend-inner-icon="i-mdi:web"
              variant="outlined"
            />

            <v-row class="mt-2">
              <v-col cols="6">
                <div class="text-caption">Vuetify Locale: <strong>{{ current }}</strong></div>
                <div class="text-caption">i18n Locale: <strong>{{ locale }}</strong></div>
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  v-model="isRtl"
                  color="secondary"
                  density="compact"
                  hide-details
                  label="RTL Mode"
                />
              </v-col>
            </v-row>

            <v-divider class="my-3" />

            <div class="text-subtitle-2 mb-2">Translation Test</div>
            <v-alert border="start" border-color="primary" density="compact" variant="tonal">
              t('xxx'): {{ t('xxx') }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Components Showcase -->
      <v-col cols="12" md="6">
        <v-card height="100%" prepend-icon="i-mdi:view-grid-plus" title="Components Showcase">
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="formData.name"
                clearable
                hint="Type something..."
                label="Interactive Input"
                persistent-hint
                prepend-inner-icon="i-mdi:pencil"
                variant="outlined"
              />
            </v-form>

            <div class="my-4">
              <div class="text-subtitle-2 mb-2">Buttons & Icons</div>
              <div class="d-flex gap-2 flex-wrap align-center">
                <v-btn color="primary" prepend-icon="i-mdi:check">Primary</v-btn>
                <v-btn color="secondary" variant="tonal">Tonal</v-btn>
                <v-btn color="info" variant="outlined">Outlined</v-btn>

                <v-divider class="mx-2" vertical />

                <v-badge color="success" dot>
                  <v-icon icon="i-mdi:bell" size="large" />
                </v-badge>

                <v-badge color="error" content="3">
                  <v-icon icon="i-mdi:email" size="large" />
                </v-badge>

                <v-icon class="i-mdi:account" size="large" />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Date Picker -->
      <v-col cols="12" md="6">
        <v-card height="100%" prepend-icon="i-mdi:calendar" title="Date Picker">
          <div class="d-flex justify-center pa-4">
            <v-date-picker
              v-model="formData.date"
              elevation="2"
              rounded="lg"
            />
          </div>
        </v-card>
      </v-col>

      <!-- Validation Rules -->
      <v-col cols="12" md="6">
        <v-card height="100%" prepend-icon="i-mdi:check-circle-outline" title="Validation Rules">
          <v-card-text>
            <div class="text-subtitle-2 mb-2">Input Validation (useRules)</div>
            <v-text-field
              v-model="formData.ruleValue"
              label="Type something (min 3 chars)"
              :rules="[rules.required('Field is required'), rules.minLength(3, 'At least 3 characters')]"
              variant="outlined"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- SSR Info -->
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel title="SSR Client Hints & Configuration">
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="text-subtitle-2 mb-2">Client Hints</div>
                  <pre class="overflow-auto pa-4 bg-grey-lighten-4 rounded text-caption">{{ JSON.stringify(ssrClientHints, null, 2) }}</pre>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-subtitle-2 mb-2">Configuration</div>
                  <pre class="overflow-auto pa-4 bg-grey-lighten-4 rounded text-caption">{{ JSON.stringify(ssrClientHintsConfiguration, null, 2) }}</pre>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
