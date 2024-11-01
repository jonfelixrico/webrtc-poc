import { onSocketEvent } from '#imports'
import type {
  RoomWsEventHandler,
  RoomWsEventPayloadMap,
} from '@webrtcpoc/common'

export const onAppSocketEvent: <K extends keyof RoomWsEventPayloadMap>(
  event: K,
  handler: RoomWsEventHandler<K>,
) => void = onSocketEvent
