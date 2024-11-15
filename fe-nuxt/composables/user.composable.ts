import { computed } from 'vue'
import { useSocketFromStore } from '~/composables/socket.composable'

export function useUserId() {
  const socket = useSocketFromStore()
  return computed(() => socket.value?.id)
}
