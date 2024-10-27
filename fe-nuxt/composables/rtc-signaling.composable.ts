import type { Socket } from 'socket.io-client'
import type { AppSocket } from '~/composables/socket.composable'

function onAppSocketConnect(
  appSocket: AppSocket,
  handler: (socket: Socket) => void,
) {
  watch(
    appSocket,
    (as) => {
      if (!as?.connected) {
        return
      }

      handler(as.socket)
    },
    {
      deep: true,
      immediate: true,
    },
  )
}

export function useRtcJoinHandler(appSocket: AppSocket) {
  onAppSocketConnect(appSocket, (sock) => {})
}

export function useRtcOfferListener(appSocket: AppSocket) {
  onAppSocketConnect(appSocket, (sock) => {})
}
