import { onBeforeUnmount } from 'vue'

export function useAddListener(connection: RTCPeerConnection) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
