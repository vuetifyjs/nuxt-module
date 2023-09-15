import { useClientHintsHeaders } from '~/utils/client-hints'

export default defineNuxtRouteMiddleware((to) => {
  if (process.client)
    return

  const headers = useClientHintsHeaders()

  console.log('PASO', to.fullPath)
  console.log('PASO', headers)
})
