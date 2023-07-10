/* eslint-disable no-prototype-builtins */
import type { EffectScope, Ref, WatchSource } from 'vue'
import {
  getCurrentInstance as _getCurrentInstance,
  computed,
  effectScope,
  onScopeDispose,
  ref,
  toRaw,
  watch,
} from 'vue'
import type { LocaleInstance, LocaleMessages, LocaleOptions, VuetifyOptions } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { toKebabCase } from '../../utils'
import { useNuxtApp } from '#app'

export function createAdapter(vuetifyOptions: VuetifyOptions) {
  vuetifyOptions.locale = {}
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  const current = i18n.locale
  const fallback = i18n.fallbackLocale
  const messages = i18n.messages

  vuetifyOptions.locale.rtl = i18n.locales.value.reduce((acc: Record<string, boolean>, locale: any) => {
    acc[locale.code] = locale.dir === 'rtl'
    return acc
  }, {})

  vuetifyOptions.locale.adapter = {
    name: 'nuxt-vue-i18n',
    current,
    fallback,
    messages,
    t: (key, ...params) => i18n.t(key, params),
    n: i18n.n,
    provide: createProvideFunction({ current, fallback, messages }),
  }
}

function getCurrentInstance(name: string, message?: string) {
  const vm = _getCurrentInstance()

  if (!vm)
    throw new Error(`[Vuetify] ${name} ${message || 'must be called from inside a setup function'}`)

  return vm
}

function useToggleScope(source: WatchSource<boolean>, fn: (reset: () => void) => void) {
  let scope: EffectScope | undefined
  function start() {
    scope = effectScope()
    scope.run(() => fn.length
      ? fn(() => {
        scope?.stop()
        start()
      })
      : (fn as any)(),
    )
  }

  watch(source, (active) => {
    if (active && !scope) {
      start()
    }
    else if (!active) {
      scope?.stop()
      scope = undefined
    }
  }, { immediate: true })

  onScopeDispose(() => {
    scope?.stop()
  })
}

type InnerVal<T> = T extends any[] ? Readonly<T> : T

function useProxiedModel<
  Props extends object & { [key in Prop as `onUpdate:${Prop}`]: ((val: any) => void) | undefined },
  Prop extends Extract<keyof Props, string>,
  Inner = Props[Prop],
>(
  props: Props,
  prop: Prop,
  defaultValue?: Props[Prop],
  transformIn: (value?: Props[Prop]) => Inner = (v: any) => v,
  transformOut: (value: Inner) => Props[Prop] = (v: any) => v,
) {
  const vm = getCurrentInstance('useProxiedModel')
  const internal = ref(props[prop] !== undefined ? props[prop] : defaultValue) as Ref<Props[Prop]>
  const kebabProp = toKebabCase(prop)
  const checkKebab = kebabProp !== prop

  const isControlled = checkKebab
    ? computed(() => {
      void props[prop]
      return !!(
        (vm.vnode.props?.hasOwnProperty(prop) || vm.vnode.props?.hasOwnProperty(kebabProp))
        && (vm.vnode.props?.hasOwnProperty(`onUpdate:${prop}`) || vm.vnode.props?.hasOwnProperty(`onUpdate:${kebabProp}`))
      )
    })
    : computed(() => {
      void props[prop]
      return !!(vm.vnode.props?.hasOwnProperty(prop) && vm.vnode.props?.hasOwnProperty(`onUpdate:${prop}`))
    })

  useToggleScope(() => !isControlled.value, () => {
    watch(() => props[prop], (val) => {
      internal.value = val
    })
  })

  const model = computed({
    get(): any {
      const externalValue = props[prop]
      return transformIn(isControlled.value ? externalValue : internal.value)
    },
    set(internalValue) {
      const newValue = transformOut(internalValue)
      const value = toRaw(isControlled.value ? props[prop] : internal.value)
      if (value === newValue || transformIn(value) === internalValue)
        return

      internal.value = newValue
      vm?.emit(`update:${prop}`, newValue)
    },
  }) as any as Ref<InnerVal<Inner>> & { readonly externalValue: Props[Prop] }

  Object.defineProperty(model, 'externalValue', {
    get: () => isControlled.value ? props[prop] : internal.value,
  })

  return model
}

function useProvided<T>(props: any, prop: string, provided: Ref<T>) {
  const internal = useProxiedModel(props, prop)

  internal.value = props[prop] ?? provided.value

  watch(provided, (v) => {
    if (props[prop] == null)
      internal.value = v
  })

  return internal as Ref<T>
}

// todo: add formatNumber, formatCurrency, formatDateTime, formatDate, formatTime...
function createProvideFunction(data: {
  current: Ref<string>
  fallback: Ref<string>
  messages: Ref<LocaleMessages>
}) {
  return (props: LocaleOptions) => {
    // todo: simplify this, we don't need to proxy anything, the messages are there
    const current = useProvided(props, 'locale', data.current)
    const fallback = useProvided(props, 'fallback', data.fallback)
    const messages = useProvided(props, 'messages', data.messages)

    const i18n = useI18n({
      locale: current.value,
      fallbackLocale: fallback.value,
      messages: messages.value as any,
      useScope: 'local',
      legacy: false,
      inheritLocale: false,
    })

    return <LocaleInstance>{
      name: 'nuxt-vue-i18n',
      current,
      fallback,
      messages,
      // todo: fix this, we should check the options
      // @ts-expect-error Type instantiation is excessively deep and possibly infinite.ts(2589)
      t: (key, ...params) => i18n.t(key, params),
      n: i18n.n,
      provide: createProvideFunction({ current, fallback, messages }),
    }
  }
}
