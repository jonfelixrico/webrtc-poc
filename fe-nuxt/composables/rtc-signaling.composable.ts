import {
  onAppSocketConnect,
  type AppSocket,
} from '~/composables/socket.composable'

export function useRtcJoinHandler(appSocket: AppSocket) {
  onAppSocketConnect(appSocket, (sock) => {})
}

export function useRtcOfferListener(appSocket: AppSocket) {
  onAppSocketConnect(appSocket, (sock) => {})
}
