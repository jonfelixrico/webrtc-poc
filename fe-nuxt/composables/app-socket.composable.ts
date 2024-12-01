import type {
  RoomWsCommandPayloadMap,
  RoomWsEventPayloadMap,
} from '@webrtcpoc/common'
import { useSocket, onSocketEvent } from '~/composables/socket.composable'
import type { MaybeAsync } from '~/typings/util.types'

type Handler<K extends keyof RoomWsEventPayloadMap> = (
  payload: RoomWsEventPayloadMap[K],
) => MaybeAsync<void>

export const onAppSocketEvent: <K extends keyof RoomWsEventPayloadMap>(
  event: K,
  handler: Handler<K>,
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
