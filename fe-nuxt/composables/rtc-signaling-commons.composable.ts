import { onBeforeUnmount } from 'vue'

export function useAddListener(connection: RTCPeerConnection) {
  const unsubscribeFns: ((...args: unknown[]) => void)[] = []

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
