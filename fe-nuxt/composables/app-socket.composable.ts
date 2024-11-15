import { onSocketEvent, useSocketFromStore } from '#imports'
import type {
  RoomWsCommandPayloadMap,
  RoomWsEventHandler,
  RoomWsEventPayloadMap,
} from '@webrtcpoc/common'

export const onAppSocketEvent: <K extends keyof RoomWsEventPayloadMap>(
  event: K,
  handler: RoomWsEventHandler<K>,
) => void = onSocketEvent

export function useAppSocketEmit() {
  const socket = useSocketFromStore()

  function emit<K extends keyof RoomWsCommandPayloadMap>(
    name: K,
    payload: RoomWsCommandPayloadMap[K],
  ) {
    if (!socket.value) {
      return
    }

    socket.value.emit(name, payload)
  }

  return emit
}
