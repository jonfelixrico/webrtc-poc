import { onBeforeUnmount, toValue } from 'vue'
import { useLogger } from '~/composables/logger.composable'
import { useSocketFromStore } from '~/composables/socket-v2.composable'

export function useSendOffer() {
  const logger = useLogger()
  const socket = useSocketFromStore()

  async function sendOffer(
    peerConnection: RTCPeerConnection,
    peerClientId: string,
  ) {
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })
    await peerConnection.setLocalDescription(offer)

    toValue(socket).emit('send_offer', {
      clientId: peerClientId,
      rtcSession: offer,
    })
    logger.debug('Sent an offer to client %s', peerClientId)
  }

  return sendOffer
}

export function useEventListener<K extends keyof RTCPeerConnectionEventMap>(
  connection: RTCPeerConnection,
  event: K,
  handler: (ev: RTCPeerConnectionEventMap[K]) => void,
) {
  connection.addEventListener(event, handler)
  onBeforeUnmount(() => {
    connection.addEventListener(event, handler)
  })
}
