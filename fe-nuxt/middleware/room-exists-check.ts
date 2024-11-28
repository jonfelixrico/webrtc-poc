import { abortNavigation, defineNuxtRouteMiddleware } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  try {
    await $fetch(`/be/room/${to.params.id}`, {
      method: 'HEAD',
    })

    // To disable the complaints about error below
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // TODO check if should log
    return abortNavigation()
  }
})
