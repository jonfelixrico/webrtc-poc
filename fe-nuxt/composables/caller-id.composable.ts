import { useSessionStorage } from '@vueuse/core'
import { nanoid } from 'nanoid'

export function useCallerId() {
  if (import.meta.server) {
    return ref('<caller-id>')
  }

  return useSessionStorage('callerId', nanoid())
}
