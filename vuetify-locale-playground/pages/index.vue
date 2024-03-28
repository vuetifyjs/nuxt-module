<script setup lang="ts">
const { locales, t, locale } = useI18n()
const { current } = useVLocale()
const { isRtl } = useVRtl()

const name = ref('')
const hint = ref('')
const persistentHint = computed(() => hint.value.trim().length > 0)

const dir = computed(() => isRtl.value ? 'rtl' : undefined)

function onChanged(name?: string) {
  if (name && name.trim().length > 0)
    hint.value = t('say-hi', [name])
  else
    hint.value = ''
}

// cannot use current
watch([locale, name], ([, nn]) => {
  onChanged(nn)
}, { immediate: true, flush: 'post' })
</script>

<template>
  <v-container>
    <v-col cols="12">
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
          :placeholder="$t('hi')"
          :hint="hint"
          :persistent-hint="persistentHint"
          @click:clear="() => onChanged('')"
        />
      </v-row>
      <v-row>
        <v-select
          v-model="current"
          :items="locales"
          item-title="name"
          item-value="code"
          outlined
          :hint="$t('hi')"
          persistent-hint
        />
      </v-row>
    </v-col>
  </v-container>
</template>
