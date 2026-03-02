import type { Ref } from 'vue'
import type { Locale } from 'vue-i18n'
import type { LocaleInstance, LocaleMessages, LocaleOptions, VuetifyOptions } from 'vuetify'
import { useNuxtApp } from '#imports'
import { ref, toRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

function inferDecimalSeparator (n: ReturnType<typeof useI18n>['n']) {
  return n(0.1).includes(',') ? ',' : '.'
}

export function createAdapter (vuetifyOptions: VuetifyOptions) {
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
    if (oldVal) {
      i18n.setLocale(val)
    }
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
    decimalSeparator: toRef(() => inferDecimalSeparator(i18n.n)),
  }
}

// todo: add formatNumber, formatCurrency, formatDateTime, formatDate, formatTime...
function createProvideFunction (data: {
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
      if (oldVal) {
        // @ts-expect-error i18n missing
        i18n.setLocale(val)
      }
    }, { immediate: true, flush: 'post' })

    const t = wrapI18n(i18n.t)
    const n = wrapI18n(i18n.n)

    return <LocaleInstance>{
      name: 'nuxt-vue-i18n',
      current: currentLocale,
      fallback: data.fallback,
      messages: data.messages,
      t,
      n,
      decimalSeparator: toRef(() => props.decimalSeparator ?? inferDecimalSeparator(n)),
      provide: createProvideFunction({ current: currentLocale, fallback: data.fallback, messages: data.messages }),
    }
  }
}

function wrapI18n<T extends (...args: any[]) => any> (t: T): T {
  return <T>((...args: any[]) => {
    return t(...args)
  })
}
