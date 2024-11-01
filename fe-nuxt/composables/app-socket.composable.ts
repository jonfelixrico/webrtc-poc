import { onBeforeUnmount, toValue, useSocketFromStore, watch } from '#imports'
import type {
  RoomWsEventHandler,
  RoomWsEventPayloadMap,
} from '@webrtcpoc/common'

export function onSocketEvent<K extends keyof RoomWsEventPayloadMap>(
  event: K,
  handler: RoomWsEventHandler<K>,
) {
  const socket = useSocketFromStore()

  watch(
    socket,
    (nSocket, oSocket) => {
      if (nSocket) {
        // Casting as string is just type-wanking to prevent socket.io types from complaining
        nSocket.on(event as string, handler)
      }

      if (oSocket) {
        oSocket.off(event as string, handler)
      }
    },
    {
      immediate: true,
    },
  )

  onBeforeUnmount(() => {
    const vSocket = toValue(socket)
    if (vSocket) {
      vSocket.off(event as string, handler)
    }
  })
}
