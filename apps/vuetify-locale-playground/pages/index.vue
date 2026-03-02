<script setup lang="ts">
  const { locales, t, locale } = useI18n()
  const { current } = useVLocale()
  const { isRtl } = useVRtl()

  const name = ref('')
  const hint = ref('')
  const persistentHint = computed(() => hint.value.trim().length > 0)

  const dir = computed(() => isRtl.value ? 'rtl' : undefined)
  // const dir = computed(() => localeProperties.value.dir)

  function onChanged (name?: string) {
    hint.value = name && name.trim().length > 0 ? t('say-hi', [name]) : ''
  }

  // don't use current, dir will not be updated
  watch([locale, name], ([, nn]) => {
    onChanged(nn)
  }, { immediate: true, flush: 'post' })
</script>

<template>
  <v-container>
    <v-col>
      <v-row>
        <div dir="auto">
          <dl>
            <dt :dir="dir">
              t('$vuetify.badge'):
            </dt><dd :dir="dir">
              {{ t('$vuetify.badge') }}
            </dd>
            <dt :dir="dir">
              t('$vuetify.dataFooter.pageText', [10, 19, 100]):
            </dt><dd :dir="dir">
              {{ t('$vuetify.dataFooter.pageText', [10, 19, 100]) }}
            </dd>
            <dt :dir="dir">
              $t('$vuetify.badge'):
            </dt><dd :dir="dir">
              {{ $t('$vuetify.badge') }}
            </dd>
            <dt :dir="dir">
              $t('$vuetify.dataFooter.pageText', [10, 19, 100]):
            </dt><dd :dir="dir">
              {{ $t('$vuetify.dataFooter.pageText', [10, 19, 100]) }}
            </dd>
          </dl>
        </div>
      </v-row>
      <v-row>
        <v-text-field
          v-model="name"
          autofocus
          clearable
          :hint="hint"
          :persistent-hint="persistentHint"
          :placeholder="$t('hi')"
          @click:clear="() => onChanged('')"
        />
      </v-row>
      <v-row>
        <v-select
          v-model="current"
          :hint="$t('hi')"
          item-title="name"
          item-value="code"
          :items="locales"
          outlined
          persistent-hint
        />
      </v-row>
    </v-col>
  </v-container>
</template>
