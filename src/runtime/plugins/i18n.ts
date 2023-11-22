import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import type { LocaleInstance, LocaleMessages, LocaleOptions, VuetifyOptions } from 'vuetify'
import type { Locale } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import { useNuxtApp } from '#imports'

export function createAdapter(vuetifyOptions: VuetifyOptions) {
  vuetifyOptions.locale = {}
  const nuxtApp = useNuxtApp()
  const i18n: ReturnType<typeof useI18n> = nuxtApp.$i18n
  const current = i18n.locale
  const fallback = i18n.fallbackLocale
  const messages = i18n.messages
  const currentLocale = ref<Locale>(current.value)

  vuetifyOptions.locale.rtl = i18n.locales.value.reduce((acc: Record<string, boolean>, locale: any) => {
    acc[locale.code] = locale.dir === 'rtl'
    return acc
  }, {})

  watch(currentLocale, (val, oldVal) => {
    if (oldVal)
      i18n.setLocale(val)
  }, { immediate: true, flush: 'post' })

  nuxtApp.hook('i18n:localeSwitched', ({ newLocale }) => {
    currentLocale.value = newLocale
  })

  vuetifyOptions.locale.adapter = {
    name: 'nuxt-vue-i18n',
    current: currentLocale,
    fallback,
    messages,
    t: (key, ...params) => i18n.t(key, params),
    n: i18n.n,
    provide: createProvideFunction({ current: currentLocale, fallback, messages }),
  }
}

// todo: add formatNumber, formatCurrency, formatDateTime, formatDate, formatTime...
function createProvideFunction(data: {
  current: Ref<string>
  fallback: Ref<string>
  messages: Ref<LocaleMessages>
}) {
  return (props: LocaleOptions) => {
    const currentLocale = ref(props.locale ?? data.current.value)

    const i18n = useI18n({
      locale: currentLocale.value,
      fallbackLocale: data.fallback.value,
      messages: data.messages.value as any,
      useScope: 'local',
      legacy: false,
      inheritLocale: false,
    })

    watch(currentLocale, (val, oldVal) => {
      if (oldVal)
        i18n.setLocale(val)
    }, { immediate: true, flush: 'post' })

    return <LocaleInstance>{
      name: 'nuxt-vue-i18n',
      current: currentLocale,
      fallback: data.fallback,
      messages: data.messages,
      // todo: fix this, we should check the options
      t: (key, ...params) => i18n.t(key, params),
      n: i18n.n,
      provide: createProvideFunction({ current: currentLocale, fallback: data.fallback, messages: data.messages }),
    }
  }
}
