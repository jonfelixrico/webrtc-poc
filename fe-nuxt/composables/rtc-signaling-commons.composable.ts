import { onBeforeUnmount, toValue } from 'vue'
import { useLogger } from '~/composables/logger.composable'
import { useSocketFromStore } from '~/composables/socket-v2.composable'

export function useAddListener(connection: RTCPeerConnection) {
  const unsubscribeFns: ((...args: any[]) => void)[] = []

  function addListener<K extends keyof RTCPeerConnectionEventMap>(
    event: K,
    handler: (ev: RTCPeerConnectionEventMap[K]) => void,
  ) {
    connection.addEventListener(event, handler)
    unsubscribeFns.push(() => {
      connection.removeEventListener(event, handler)
    })
  }

  onBeforeUnmount(() => {
    unsubscribeFns.forEach((fn) => fn())
  })

  return addListener
}
