import type {
  RoomWsCommandPayloadMap,
  RoomWsEventHandler,
  RoomWsEventPayloadMap,
} from '@webrtcpoc/common'
import { useSocket, onSocketEvent } from '~/composables/socket.composable'

export const onAppSocketEvent: <K extends keyof RoomWsEventPayloadMap>(
  event: K,
  handler: RoomWsEventHandler<K>,
) => void = onSocketEvent

export function useAppSocketEmit() {
  const socket = useSocket()

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
